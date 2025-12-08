import { RotateCcw, RefreshCw, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SudokuControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  onCheck: () => void;
  onClearCell: () => void;
  disabled?: boolean;
  canClear?: boolean;
}

export function SudokuControls({
  onNewGame,
  onReset,
  onCheck,
  onClearCell,
  disabled,
  canClear,
}: SudokuControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" data-testid="sudoku-controls">
      <Button
        variant="default"
        onClick={onCheck}
        disabled={disabled}
        className="gap-2"
        data-testid="button-check-solution"
      >
        <Check className="w-4 h-4" />
        Check Solution
      </Button>
      <Button
        variant="outline"
        onClick={onNewGame}
        disabled={disabled}
        className="gap-2"
        data-testid="button-new-game"
      >
        <RefreshCw className="w-4 h-4" />
        New Game
      </Button>
      <Button
        variant="outline"
        onClick={onReset}
        disabled={disabled}
        className="gap-2"
        data-testid="button-reset"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClearCell}
        disabled={!canClear || disabled}
        data-testid="button-clear-cell"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
