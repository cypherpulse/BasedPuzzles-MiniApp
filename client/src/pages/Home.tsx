import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { SudokuMode } from "@/components/modes/SudokuMode";
import { CrosswordMode } from "@/components/modes/CrosswordMode";
import { Leaderboard } from "@/components/Leaderboard";
import { ProfileStats } from "@/components/ProfileStats";
import { CompletionModal } from "@/components/CompletionModal";
import { ProfileModal } from "@/components/ProfileModal";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useCrosswordGame } from "@/hooks/useCrosswordGame";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import type { PuzzleMode } from "@/lib/types";

export default function Home() {
  const [mode, setMode] = useState<PuzzleMode>(() => {
    const saved = localStorage.getItem('based-puzzles-mode');
    return (saved === 'sudoku' || saved === 'crossword') ? saved : 'sudoku';
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { stats, updateName, recordCompletion, incrementStarted, updateStreak } = usePlayerStats();
  const { entries, addEntry } = useLeaderboard();
  
  const sudokuGame = useSudokuGame({
    onGameStart: () => incrementStarted('sudoku'),
  });
  
  const crosswordGame = useCrosswordGame({
    onGameStart: () => incrementStarted('crossword'),
  });

  useEffect(() => {
    localStorage.setItem('based-puzzles-mode', mode);
  }, [mode]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleModeChange = useCallback((newMode: PuzzleMode) => {
    setMode(newMode);
  }, []);

  const handleSudokuSaveToLeaderboard = useCallback((playerName: string) => {
    updateName(playerName);
    recordCompletion('sudoku', sudokuGame.timerSeconds);
    addEntry({
      mode: 'sudoku',
      playerName,
      difficulty: sudokuGame.difficulty,
      timeSeconds: sudokuGame.timerSeconds,
    });
  }, [updateName, recordCompletion, addEntry, sudokuGame.timerSeconds, sudokuGame.difficulty]);

  const handleCrosswordSaveToLeaderboard = useCallback((playerName: string) => {
    updateName(playerName);
    recordCompletion('crossword', crosswordGame.timerSeconds);
    addEntry({
      mode: 'crossword',
      playerName,
      difficulty: crosswordGame.difficulty,
      timeSeconds: crosswordGame.timerSeconds,
    });
  }, [updateName, recordCompletion, addEntry, crosswordGame.timerSeconds, crosswordGame.difficulty]);

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="home-page">
      <Header 
        stats={stats} 
        onProfileClick={() => setShowProfileModal(true)} 
      />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <ModeSwitcher mode={mode} onChange={handleModeChange} />
        
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div>
            {mode === 'sudoku' ? (
              <SudokuMode
                board={sudokuGame.board}
                selectedCell={sudokuGame.selectedCell}
                errors={sudokuGame.errors}
                difficulty={sudokuGame.difficulty}
                timerSeconds={sudokuGame.timerSeconds}
                status={sudokuGame.status}
                onCellSelect={sudokuGame.selectCell}
                onCellChange={sudokuGame.updateCell}
                onDifficultyChange={sudokuGame.setDifficulty}
                onNewGame={sudokuGame.startNewGame}
                onReset={sudokuGame.resetBoard}
                onCheck={sudokuGame.checkSolution}
              />
            ) : (
              <CrosswordMode
                puzzle={crosswordGame.puzzle}
                selectedCell={crosswordGame.selectedCell}
                activeClue={crosswordGame.activeClue}
                incorrectCells={crosswordGame.incorrectCells}
                difficulty={crosswordGame.difficulty}
                timerSeconds={crosswordGame.timerSeconds}
                status={crosswordGame.status}
                onCellSelect={crosswordGame.selectCell}
                onLetterInput={crosswordGame.setLetter}
                onClueSelect={crosswordGame.selectClue}
                onDifficultyChange={crosswordGame.setDifficulty}
                onNewPuzzle={crosswordGame.startNewPuzzle}
                onReset={crosswordGame.resetPuzzle}
                onCheck={crosswordGame.checkSolution}
              />
            )}
          </div>
          
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Leaderboard entries={entries} mode={mode} />
            <div className="hidden lg:block">
              <ProfileStats stats={stats} />
            </div>
          </aside>
        </div>
      </main>

      <CompletionModal
        open={sudokuGame.status === 'solved' && mode === 'sudoku'}
        onClose={sudokuGame.startNewGame}
        mode="sudoku"
        difficulty={sudokuGame.difficulty}
        timeSeconds={sudokuGame.timerSeconds}
        playerName={stats.playerName || ''}
        onSaveToLeaderboard={handleSudokuSaveToLeaderboard}
        onPlayAgain={sudokuGame.startNewGame}
      />

      <CompletionModal
        open={crosswordGame.status === 'solved' && mode === 'crossword'}
        onClose={crosswordGame.startNewPuzzle}
        mode="crossword"
        difficulty={crosswordGame.difficulty}
        timeSeconds={crosswordGame.timerSeconds}
        playerName={stats.playerName || ''}
        onSaveToLeaderboard={handleCrosswordSaveToLeaderboard}
        onPlayAgain={crosswordGame.startNewPuzzle}
      />

      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        stats={stats}
        onUpdateName={updateName}
      />
    </div>
  );
}
