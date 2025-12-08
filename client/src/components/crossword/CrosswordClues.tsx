import { ScrollArea } from "@/components/ui/scroll-area";
import type { CrosswordClue } from "@/lib/types";

interface CrosswordCluesProps {
  clues: CrosswordClue[];
  activeClueId: string | null;
  onClueSelect: (clueId: string) => void;
}

export function CrosswordClues({ clues, activeClueId, onClueSelect }: CrosswordCluesProps) {
  const acrossClues = clues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = clues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number);

  const ClueItem = ({ clue }: { clue: CrosswordClue }) => {
    const isActive = clue.id === activeClueId;
    return (
      <button
        onClick={() => onClueSelect(clue.id)}
        className={`
          w-full text-left py-2 px-3 rounded-md text-sm
          transition-colors duration-100
          hover-elevate active-elevate-2
          ${isActive 
            ? 'bg-primary/10 border-l-4 border-primary pl-2' 
            : 'border-l-4 border-transparent'}
        `}
        data-testid={`clue-${clue.id}`}
      >
        <span className="font-semibold text-primary mr-2">{clue.number}.</span>
        <span className="text-foreground">{clue.prompt}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4" data-testid="crossword-clues">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">ACROSS</h3>
        <ScrollArea className="h-40 lg:h-48">
          <div className="space-y-1">
            {acrossClues.map(clue => (
              <ClueItem key={clue.id} clue={clue} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">DOWN</h3>
        <ScrollArea className="h-40 lg:h-48">
          <div className="space-y-1">
            {downClues.map(clue => (
              <ClueItem key={clue.id} clue={clue} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
