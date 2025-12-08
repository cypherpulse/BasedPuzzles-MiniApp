import { useState, useEffect, useRef } from "react";
import { CheckCircle, Trophy, Clock, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTime, type Difficulty, type PuzzleMode } from "@/lib/types";

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  mode: PuzzleMode;
  difficulty: Difficulty;
  timeSeconds: number;
  playerName: string;
  onSaveToLeaderboard: (name: string) => void;
  onPlayAgain: () => void;
}

export function CompletionModal({
  open,
  onClose,
  mode,
  difficulty,
  timeSeconds,
  playerName,
  onSaveToLeaderboard,
  onPlayAgain,
}: CompletionModalProps) {
  const [name, setName] = useState(playerName || '');
  const [saved, setSaved] = useState(false);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setSaved(false);
      setName(playerName || '');
    }
    prevOpenRef.current = open;
  }, [open, playerName]);

  const handleSave = () => {
    if (name.trim()) {
      onSaveToLeaderboard(name.trim());
      setSaved(true);
    }
  };

  const handlePlayAgain = () => {
    setSaved(false);
    setName(playerName || '');
    onPlayAgain();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="completion-modal">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-2xl font-bold" data-testid="text-completion-title">
            {mode === 'sudoku' ? 'Sudoku Complete!' : 'Crossword Complete!'}
          </DialogTitle>
          <DialogDescription>
            Great job solving the puzzle!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-mono font-bold" data-testid="text-completion-time">
              {formatTime(timeSeconds)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Time</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold capitalize" data-testid="text-completion-difficulty">
              {difficulty}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Difficulty</p>
          </div>
        </div>

        {!saved ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player-name">Your Name</Label>
              <Input
                id="player-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                data-testid="input-player-name"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleSave} disabled={!name.trim()} className="gap-2" data-testid="button-save-leaderboard">
                <Trophy className="w-4 h-4" />
                Save to Leaderboard
              </Button>
              <Button variant="outline" onClick={handlePlayAgain} data-testid="button-play-again">
                Play Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Score saved to leaderboard!
            </div>
            <Button onClick={handlePlayAgain} className="w-full" data-testid="button-play-again-saved">
              Play Another Puzzle
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
