import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glitch: {
          red: "hsl(var(--glitch-red))",
          cyan: "hsl(var(--glitch-cyan))",
          magenta: "hsl(var(--glitch-magenta))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["Times New Roman", "serif"],
        mono: ["Courier New", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "drift": {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(2px, -2px)" },
          "50%": { transform: "translate(-1px, 1px)" },
          "75%": { transform: "translate(1px, 2px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "static-noise": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scramble": {
          "0%": { opacity: "1" },
          "10%": { opacity: "0.8", transform: "skewX(2deg)" },
          "20%": { opacity: "0.9", transform: "skewX(-1deg)" },
          "30%": { opacity: "0.7", transform: "skewX(1deg)" },
          "40%": { opacity: "1", transform: "skewX(0)" },
          "100%": { opacity: "1", transform: "skewX(0)" },
        },
        "horizontal-glitch": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(-2px)" },
          "20%": { transform: "translateX(2px)" },
          "30%": { transform: "translateX(-1px)" },
          "40%": { transform: "translateX(1px)" },
          "50%": { transform: "translateX(0)" },
        },
        "rgb-split": {
          "0%, 100%": { textShadow: "0 0 0 transparent" },
          "50%": { textShadow: "-2px 0 hsl(var(--glitch-cyan)), 2px 0 hsl(var(--glitch-red))" },
        },
        "reveal": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "blink": {
          "0%, 50%, 100%": { opacity: "1" },
          "25%, 75%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "drift": "drift 10s ease-in-out infinite",
        "static-noise": "static-noise 0.2s steps(10) infinite",
        "scan": "scan 8s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "scramble": "scramble 0.5s ease-in-out",
        "horizontal-glitch": "horizontal-glitch 0.3s ease-in-out",
        "rgb-split": "rgb-split 3s ease-in-out infinite",
        "reveal": "reveal 1s ease-out forwards",
        "blink": "blink 1s step-end infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
