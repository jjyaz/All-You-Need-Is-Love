import { useState } from 'react';
import { useReactions, ReactionType, REACTION_ICONS, REACTION_COLORS } from '@/hooks/useReactions';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';
import { useSecretSequences } from '@/hooks/useSecretSequences';
import { cn } from '@/lib/utils';

interface ReactionBarProps {
  contentId: string;
  onSecretDiscovered?: (secretId: string) => void;
}

const ReactionBar = ({ contentId, onSecretDiscovered }: ReactionBarProps) => {
  const { getReactions, addReaction, reactionSequence } = useReactions();
  const { incrementCorruption } = useEntityIdentity();
  const { checkSequence, discoverSequence } = useSecretSequences();
  const [clickedReaction, setClickedReaction] = useState<ReactionType | null>(null);

  const contentReactions = getReactions(contentId);
  const reactionTypes: ReactionType[] = ['RESONATE', 'CORRUPT', 'STATIC', 'LOVE', 'VOID'];

  const handleReaction = (reaction: ReactionType) => {
    // Visual feedback
    setClickedReaction(reaction);
    setTimeout(() => setClickedReaction(null), 300);

    // Add reaction
    addReaction(contentId, reaction);

    // Increment corruption for CORRUPT reactions
    if (reaction === 'CORRUPT') {
      incrementCorruption(2);
    } else if (reaction === 'VOID') {
      incrementCorruption(1);
    }

    // Check for secret sequences after a brief delay
    setTimeout(() => {
      const updatedSequence = [...reactionSequence, { contentId, reaction }];
      const discovered = checkSequence(updatedSequence);
      if (discovered) {
        discoverSequence(discovered);
        onSecretDiscovered?.(discovered.id);
      }
    }, 100);
  };

  return (
    <div className="flex items-center gap-1 mt-4">
      <span className="font-mono text-[9px] text-muted-foreground/40 mr-2 tracking-widest">
        SIGNAL:
      </span>
      
      {reactionTypes.map((reaction) => {
        const isSelected = contentReactions.userReaction === reaction;
        const isClicked = clickedReaction === reaction;
        const count = contentReactions.collective[reaction];

        return (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            className={cn(
              "group relative px-2 py-1 border transition-all duration-300",
              "hover:border-foreground/30 active:scale-95",
              isSelected 
                ? "border-accent/50 bg-accent/10" 
                : "border-foreground/10 bg-transparent",
              isClicked && "animate-pulse"
            )}
          >
            {/* Icon */}
            <span className={cn(
              "text-sm transition-all duration-200",
              isSelected ? REACTION_COLORS[reaction] : "text-foreground/40",
              "group-hover:text-foreground/80",
              isClicked && "chromatic"
            )}>
              {REACTION_ICONS[reaction]}
            </span>

            {/* Count tooltip */}
            <span className={cn(
              "absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[8px]",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "text-muted-foreground/60 whitespace-nowrap"
            )}>
              {count}
            </span>

            {/* Reaction name on hover */}
            <span className={cn(
              "absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[7px]",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "text-muted-foreground/40 whitespace-nowrap tracking-wider"
            )}>
              {reaction}
            </span>

            {/* Click effect */}
            {isClicked && (
              <span className="absolute inset-0 bg-accent/20 animate-ping" />
            )}
          </button>
        );
      })}

      {/* Total signals indicator */}
      <span className="font-mono text-[8px] text-muted-foreground/30 ml-2">
        [{Object.values(contentReactions.collective).reduce((a, b) => a + b, 0)}]
      </span>
    </div>
  );
};

export default ReactionBar;
