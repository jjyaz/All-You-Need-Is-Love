import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioState {
  isPlaying: boolean;
  intensity: number;
}

const useAmbientAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    masterGain: GainNode | null;
    droneOsc1: OscillatorNode | null;
    droneOsc2: OscillatorNode | null;
    droneGain: GainNode | null;
    noiseSource: AudioBufferSourceNode | null;
    noiseGain: GainNode | null;
    lfo: OscillatorNode | null;
    lfoGain: GainNode | null;
    whisperGain: GainNode | null;
    filter: BiquadFilterNode | null;
  }>({
    masterGain: null,
    droneOsc1: null,
    droneOsc2: null,
    droneGain: null,
    noiseSource: null,
    noiseGain: null,
    lfo: null,
    lfoGain: null,
    whisperGain: null,
    filter: null,
  });
  
  const [state, setState] = useState<AudioState>({ isPlaying: false, intensity: 0.3 });
  const whisperTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createNoiseBuffer = useCallback((context: AudioContext, duration: number = 2) => {
    const bufferSize = context.sampleRate * duration;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    
    return buffer;
  }, []);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
    nodesRef.current.masterGain = masterGain;

    // Low frequency drone oscillator 1
    const droneOsc1 = ctx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.value = 55; // Low A
    
    // Drone oscillator 2 (slightly detuned for unsettling beat frequency)
    const droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.value = 55.5; // Slightly detuned

    // Drone gain
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.3;
    
    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneGain.connect(masterGain);
    
    nodesRef.current.droneOsc1 = droneOsc1;
    nodesRef.current.droneOsc2 = droneOsc2;
    nodesRef.current.droneGain = droneGain;

    // LFO for modulation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    
    lfo.connect(lfoGain);
    lfoGain.connect(droneOsc1.frequency);
    
    nodesRef.current.lfo = lfo;
    nodesRef.current.lfoGain = lfoGain;

    // Static/noise
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter for noise (makes it more like radio static)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    nodesRef.current.noiseSource = noiseSource;
    nodesRef.current.noiseGain = noiseGain;
    nodesRef.current.filter = filter;

    // Whisper layer (heavily filtered noise)
    const whisperGain = ctx.createGain();
    whisperGain.gain.value = 0;
    whisperGain.connect(masterGain);
    nodesRef.current.whisperGain = whisperGain;

    // Start oscillators
    droneOsc1.start();
    droneOsc2.start();
    lfo.start();
    noiseSource.start();

    setState(prev => ({ ...prev, isPlaying: true }));

    // Schedule random whisper bursts
    const scheduleWhisper = () => {
      if (!audioContextRef.current || !nodesRef.current.whisperGain) return;
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      
      // Create whisper sound (filtered noise burst)
      const whisperNoise = ctx.createBufferSource();
      whisperNoise.buffer = createNoiseBuffer(ctx, 1);
      
      const whisperFilter = ctx.createBiquadFilter();
      whisperFilter.type = 'bandpass';
      whisperFilter.frequency.value = 800 + Math.random() * 400;
      whisperFilter.Q.value = 2;
      
      const whisperEnv = ctx.createGain();
      whisperEnv.gain.setValueAtTime(0, now);
      whisperEnv.gain.linearRampToValueAtTime(0.15, now + 0.1);
      whisperEnv.gain.linearRampToValueAtTime(0.08, now + 0.3);
      whisperEnv.gain.linearRampToValueAtTime(0, now + 0.8);
      
      whisperNoise.connect(whisperFilter);
      whisperFilter.connect(whisperEnv);
      whisperEnv.connect(nodesRef.current.masterGain!);
      
      whisperNoise.start(now);
      whisperNoise.stop(now + 1);

      // Schedule next whisper
      const nextDelay = 5000 + Math.random() * 15000;
      whisperTimeoutRef.current = setTimeout(scheduleWhisper, nextDelay);
    };

    // Start whispers after a delay
    whisperTimeoutRef.current = setTimeout(scheduleWhisper, 3000);

  }, [createNoiseBuffer]);

  const setIntensity = useCallback((value: number) => {
    const intensity = Math.max(0, Math.min(1, value));
    setState(prev => ({ ...prev, intensity }));

    if (nodesRef.current.masterGain) {
      nodesRef.current.masterGain.gain.linearRampToValueAtTime(
        0.1 + intensity * 0.2,
        audioContextRef.current?.currentTime || 0 + 0.1
      );
    }

    if (nodesRef.current.noiseGain) {
      nodesRef.current.noiseGain.gain.linearRampToValueAtTime(
        0.05 + intensity * 0.15,
        audioContextRef.current?.currentTime || 0 + 0.1
      );
    }

    if (nodesRef.current.filter) {
      nodesRef.current.filter.frequency.linearRampToValueAtTime(
        2000 + intensity * 4000,
        audioContextRef.current?.currentTime || 0 + 0.1
      );
    }

    if (nodesRef.current.lfoGain) {
      nodesRef.current.lfoGain.gain.linearRampToValueAtTime(
        5 + intensity * 20,
        audioContextRef.current?.currentTime || 0 + 0.1
      );
    }
  }, []);

  const triggerGlitchSound = useCallback(() => {
    if (!audioContextRef.current || !nodesRef.current.masterGain) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Quick static burst
    const glitchNoise = ctx.createBufferSource();
    glitchNoise.buffer = createNoiseBuffer(ctx, 0.3);
    
    const glitchFilter = ctx.createBiquadFilter();
    glitchFilter.type = 'highpass';
    glitchFilter.frequency.value = 2000 + Math.random() * 3000;

    const glitchGain = ctx.createGain();
    glitchGain.gain.setValueAtTime(0.3, now);
    glitchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    glitchNoise.connect(glitchFilter);
    glitchFilter.connect(glitchGain);
    glitchGain.connect(nodesRef.current.masterGain);

    glitchNoise.start(now);
    glitchNoise.stop(now + 0.2);

    // Also add a quick pitch drop
    const glitchTone = ctx.createOscillator();
    glitchTone.type = 'square';
    glitchTone.frequency.setValueAtTime(200 + Math.random() * 300, now);
    glitchTone.frequency.exponentialRampToValueAtTime(30, now + 0.1);

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.1, now);
    toneGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    glitchTone.connect(toneGain);
    toneGain.connect(nodesRef.current.masterGain);

    glitchTone.start(now);
    glitchTone.stop(now + 0.15);
  }, [createNoiseBuffer]);

  const cleanup = useCallback(() => {
    if (whisperTimeoutRef.current) {
      clearTimeout(whisperTimeoutRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setState({ isPlaying: false, intensity: 0.3 });
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    initAudio,
    setIntensity,
    triggerGlitchSound,
    isPlaying: state.isPlaying,
    intensity: state.intensity,
    cleanup
  };
};

export default useAmbientAudio;
