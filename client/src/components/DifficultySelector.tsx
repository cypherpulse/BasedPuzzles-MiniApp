import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/lib/types";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function DifficultySelector({ difficulty, onChange, disabled }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-2" data-testid="difficulty-selector">
      {difficulties.map(({ value, label }) => (
        <Button
          key={value}
          variant={difficulty === value ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onChange(value)}
          disabled={disabled}
          data-testid={`button-difficulty-${value}`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
