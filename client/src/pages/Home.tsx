import { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { ChallengeSwitcher } from "@/components/ChallengeSwitcher";
import { SudokuMode } from "@/components/modes/SudokuMode";
import { CrosswordMode } from "@/components/modes/CrosswordMode";
import { Leaderboard } from "@/components/Leaderboard";
import { ProfileStats } from "@/components/ProfileStats";
import { CompletionModal } from "@/components/CompletionModal";
import { ProfileModal } from "@/components/ProfileModal";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { useDailyStats } from "@/hooks/useDailyStats";
import { getSudokuPuzzle, getDailySudokuPuzzle, getDailySudokuDifficulty, cloneBoard, isBoardSolved, getErrorCells } from "@/lib/sudoku";
import { getCrosswordPuzzle, getDailyCrosswordPuzzle, getDailyCrosswordDifficulty, clonePuzzle, isCrosswordSolved, getIncorrectCells, findClueForCell } from "@/lib/crossword";
import type { PuzzleMode, ChallengeType, Difficulty, GameStatus, SudokuBoard, CrosswordPuzzle, CrosswordClue } from "@/lib/types";
import { getTodayDateString } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<PuzzleMode>(() => {
    const saved = localStorage.getItem('based-puzzles-mode');
    return (saved === 'sudoku' || saved === 'crossword') ? saved : 'sudoku';
  });
  const [challengeType, setChallengeType] = useState<ChallengeType>('practice');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const today = getTodayDateString();

  const { stats, updateName, recordCompletion, incrementStarted, updateStreak } = usePlayerStats();
  const { entries, addEntry } = useLeaderboard();
  const { markDailyCompleted, isDailyCompleted } = useDailyStats();
  
  const [sudokuDifficulty, setSudokuDifficulty] = useState<Difficulty>('easy');
  const [sudokuBoard, setSudokuBoard] = useState<SudokuBoard>(() => getSudokuPuzzle('easy'));
  const [sudokuInitialBoard, setSudokuInitialBoard] = useState<SudokuBoard>(() => cloneBoard(sudokuBoard));
  const [sudokuSelectedCell, setSudokuSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [sudokuErrors, setSudokuErrors] = useState<Set<string>>(new Set());
  const [sudokuTimerSeconds, setSudokuTimerSeconds] = useState(0);
  const [sudokuStatus, setSudokuStatus] = useState<GameStatus>('playing');
  const [sudokuHasStarted, setSudokuHasStarted] = useState(false);
  const [sudokuHintsUsed, setSudokuHintsUsed] = useState(0);

  const [crosswordDifficulty, setCrosswordDifficulty] = useState<Difficulty>('easy');
  const [crosswordPuzzle, setCrosswordPuzzle] = useState<CrosswordPuzzle>(() => getCrosswordPuzzle('easy'));
  const [crosswordInitialPuzzle, setCrosswordInitialPuzzle] = useState<CrosswordPuzzle>(() => clonePuzzle(crosswordPuzzle));
  const [crosswordSelectedCell, setCrosswordSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [crosswordActiveClue, setCrosswordActiveClue] = useState<CrosswordClue | null>(null);
  const [crosswordIncorrectCells, setCrosswordIncorrectCells] = useState<Set<string>>(new Set());
  const [crosswordTimerSeconds, setCrosswordTimerSeconds] = useState(0);
  const [crosswordStatus, setCrosswordStatus] = useState<GameStatus>('playing');
  const [crosswordHasStarted, setCrosswordHasStarted] = useState(false);
  const [crosswordHintsUsed, setCrosswordHintsUsed] = useState(0);
  const [crosswordDirection, setCrosswordDirection] = useState<'across' | 'down'>('across');

  useEffect(() => {
    let interval: number | null = null;
    if (mode === 'sudoku' && sudokuStatus === 'playing' && sudokuHasStarted) {
      interval = window.setInterval(() => {
        setSudokuTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, sudokuStatus, sudokuHasStarted]);

  useEffect(() => {
    let interval: number | null = null;
    if (mode === 'crossword' && crosswordStatus === 'playing' && crosswordHasStarted) {
      interval = window.setInterval(() => {
        setCrosswordTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, crosswordStatus, crosswordHasStarted]);

  useEffect(() => {
    localStorage.setItem('based-puzzles-mode', mode);
  }, [mode]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  useEffect(() => {
    if (challengeType === 'daily') {
      if (mode === 'sudoku') {
        const newBoard = getDailySudokuPuzzle(today);
        setSudokuBoard(newBoard);
        setSudokuInitialBoard(cloneBoard(newBoard));
        setSudokuDifficulty(getDailySudokuDifficulty(today));
        setSudokuSelectedCell(null);
        setSudokuErrors(new Set());
        setSudokuTimerSeconds(0);
        setSudokuStatus('playing');
        setSudokuHasStarted(false);
        setSudokuHintsUsed(0);
      } else {
        const newPuzzle = getDailyCrosswordPuzzle(today);
        setCrosswordPuzzle(newPuzzle);
        setCrosswordInitialPuzzle(clonePuzzle(newPuzzle));
        setCrosswordDifficulty(getDailyCrosswordDifficulty(today));
        setCrosswordSelectedCell(null);
        setCrosswordActiveClue(null);
        setCrosswordIncorrectCells(new Set());
        setCrosswordTimerSeconds(0);
        setCrosswordStatus('playing');
        setCrosswordHasStarted(false);
        setCrosswordHintsUsed(0);
        setCrosswordDirection('across');
      }
    } else {
      if (mode === 'sudoku') {
        const newBoard = getSudokuPuzzle(sudokuDifficulty);
        setSudokuBoard(newBoard);
        setSudokuInitialBoard(cloneBoard(newBoard));
        setSudokuSelectedCell(null);
        setSudokuErrors(new Set());
        setSudokuTimerSeconds(0);
        setSudokuStatus('playing');
        setSudokuHasStarted(false);
        setSudokuHintsUsed(0);
      } else {
        const newPuzzle = getCrosswordPuzzle(crosswordDifficulty);
        setCrosswordPuzzle(newPuzzle);
        setCrosswordInitialPuzzle(clonePuzzle(newPuzzle));
        setCrosswordSelectedCell(null);
        setCrosswordActiveClue(null);
        setCrosswordIncorrectCells(new Set());
        setCrosswordTimerSeconds(0);
        setCrosswordStatus('playing');
        setCrosswordHasStarted(false);
        setCrosswordHintsUsed(0);
        setCrosswordDirection('across');
      }
    }
  }, [challengeType, today]);

  const handleModeChange = useCallback((newMode: PuzzleMode) => {
    setMode(newMode);
  }, []);

  const handleChallengeChange = useCallback((newChallenge: ChallengeType) => {
    setChallengeType(newChallenge);
  }, []);

  const handleSudokuCellSelect = useCallback((row: number, col: number) => {
    setSudokuSelectedCell({ row, col });
    if (!sudokuHasStarted) {
      setSudokuHasStarted(true);
      incrementStarted('sudoku');
    }
  }, [sudokuHasStarted, incrementStarted]);

  const handleSudokuCellChange = useCallback((row: number, col: number, value: number | null) => {
    if (sudokuStatus !== 'playing') return;
    if (sudokuBoard[row][col].readonly) return;

    if (!sudokuHasStarted) {
      setSudokuHasStarted(true);
      incrementStarted('sudoku');
    }

    setSudokuBoard(prevBoard => {
      const newBoard = cloneBoard(prevBoard);
      newBoard[row][col].value = value;
      return newBoard;
    });
    setSudokuErrors(new Set());
  }, [sudokuStatus, sudokuBoard, sudokuHasStarted, incrementStarted]);

  const handleSudokuDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (challengeType === 'daily') return;
    setSudokuDifficulty(newDifficulty);
    const newBoard = getSudokuPuzzle(newDifficulty);
    setSudokuBoard(newBoard);
    setSudokuInitialBoard(cloneBoard(newBoard));
    setSudokuSelectedCell(null);
    setSudokuErrors(new Set());
    setSudokuTimerSeconds(0);
    setSudokuStatus('playing');
    setSudokuHasStarted(false);
    setSudokuHintsUsed(0);
  }, [challengeType]);

  const handleSudokuNewGame = useCallback(() => {
    if (challengeType === 'daily') {
      const newBoard = getDailySudokuPuzzle(today);
      setSudokuBoard(newBoard);
      setSudokuInitialBoard(cloneBoard(newBoard));
      setSudokuDifficulty(getDailySudokuDifficulty(today));
    } else {
      const newBoard = getSudokuPuzzle(sudokuDifficulty);
      setSudokuBoard(newBoard);
      setSudokuInitialBoard(cloneBoard(newBoard));
    }
    setSudokuSelectedCell(null);
    setSudokuErrors(new Set());
    setSudokuTimerSeconds(0);
    setSudokuStatus('playing');
    setSudokuHasStarted(false);
    setSudokuHintsUsed(0);
  }, [challengeType, today, sudokuDifficulty]);

  const handleSudokuReset = useCallback(() => {
    setSudokuBoard(cloneBoard(sudokuInitialBoard));
    setSudokuErrors(new Set());
    setSudokuTimerSeconds(0);
    setSudokuStatus('playing');
    setSudokuHasStarted(false);
    setSudokuHintsUsed(0);
  }, [sudokuInitialBoard]);

  const handleSudokuCheck = useCallback(() => {
    const errorCells = getErrorCells(sudokuBoard);
    setSudokuErrors(errorCells);

    if (isBoardSolved(sudokuBoard)) {
      setSudokuStatus('solved');
      return true;
    }
    return false;
  }, [sudokuBoard]);

  const handleCrosswordCellSelect = useCallback((row: number, col: number) => {
    const cell = crosswordPuzzle.grid[row][col];
    if (cell.isBlock) return;

    if (!crosswordHasStarted) {
      setCrosswordHasStarted(true);
      incrementStarted('crossword');
    }

    if (crosswordSelectedCell?.row === row && crosswordSelectedCell?.col === col) {
      setCrosswordDirection(prev => prev === 'across' ? 'down' : 'across');
    }

    setCrosswordSelectedCell({ row, col });
    
    const clue = findClueForCell(crosswordPuzzle, row, col, crosswordDirection);
    if (clue) {
      setCrosswordActiveClue(clue);
      setCrosswordDirection(clue.direction);
    }
    
    setCrosswordIncorrectCells(new Set());
  }, [crosswordPuzzle, crosswordSelectedCell, crosswordHasStarted, crosswordDirection, incrementStarted]);

  const handleCrosswordLetterInput = useCallback((row: number, col: number, letter: string | null) => {
    if (crosswordStatus !== 'playing') return;
    
    const cell = crosswordPuzzle.grid[row][col];
    if (cell.isBlock) return;

    if (!crosswordHasStarted) {
      setCrosswordHasStarted(true);
      incrementStarted('crossword');
    }

    setCrosswordPuzzle(prevPuzzle => {
      const newPuzzle = clonePuzzle(prevPuzzle);
      newPuzzle.grid[row][col].userLetter = letter;
      return newPuzzle;
    });
    
    setCrosswordIncorrectCells(new Set());
  }, [crosswordPuzzle, crosswordStatus, crosswordHasStarted, incrementStarted]);

  const handleCrosswordClueSelect = useCallback((clueId: string) => {
    const clue = crosswordPuzzle.clues.find(c => c.id === clueId);
    if (!clue) return;

    if (!crosswordHasStarted) {
      setCrosswordHasStarted(true);
      incrementStarted('crossword');
    }

    setCrosswordActiveClue(clue);
    setCrosswordSelectedCell({ row: clue.row, col: clue.col });
    setCrosswordDirection(clue.direction);
    setCrosswordIncorrectCells(new Set());
  }, [crosswordPuzzle.clues, crosswordHasStarted, incrementStarted]);

  const handleCrosswordDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (challengeType === 'daily') return;
    setCrosswordDifficulty(newDifficulty);
    const newPuzzle = getCrosswordPuzzle(newDifficulty);
    setCrosswordPuzzle(newPuzzle);
    setCrosswordInitialPuzzle(clonePuzzle(newPuzzle));
    setCrosswordSelectedCell(null);
    setCrosswordActiveClue(null);
    setCrosswordIncorrectCells(new Set());
    setCrosswordTimerSeconds(0);
    setCrosswordStatus('playing');
    setCrosswordHasStarted(false);
    setCrosswordHintsUsed(0);
    setCrosswordDirection('across');
  }, [challengeType]);

  const handleCrosswordNewPuzzle = useCallback(() => {
    if (challengeType === 'daily') {
      const newPuzzle = getDailyCrosswordPuzzle(today);
      setCrosswordPuzzle(newPuzzle);
      setCrosswordInitialPuzzle(clonePuzzle(newPuzzle));
      setCrosswordDifficulty(getDailyCrosswordDifficulty(today));
    } else {
      const newPuzzle = getCrosswordPuzzle(crosswordDifficulty);
      setCrosswordPuzzle(newPuzzle);
      setCrosswordInitialPuzzle(clonePuzzle(newPuzzle));
    }
    setCrosswordSelectedCell(null);
    setCrosswordActiveClue(null);
    setCrosswordIncorrectCells(new Set());
    setCrosswordTimerSeconds(0);
    setCrosswordStatus('playing');
    setCrosswordHasStarted(false);
    setCrosswordHintsUsed(0);
    setCrosswordDirection('across');
  }, [challengeType, today, crosswordDifficulty]);

  const handleCrosswordReset = useCallback(() => {
    setCrosswordPuzzle(clonePuzzle(crosswordInitialPuzzle));
    setCrosswordSelectedCell(null);
    setCrosswordActiveClue(null);
    setCrosswordIncorrectCells(new Set());
    setCrosswordTimerSeconds(0);
    setCrosswordStatus('playing');
    setCrosswordHasStarted(false);
    setCrosswordHintsUsed(0);
    setCrosswordDirection('across');
  }, [crosswordInitialPuzzle]);

  const handleCrosswordCheck = useCallback(() => {
    const incorrect = getIncorrectCells(crosswordPuzzle);
    setCrosswordIncorrectCells(incorrect);

    if (isCrosswordSolved(crosswordPuzzle)) {
      setCrosswordStatus('solved');
      return true;
    }
    return false;
  }, [crosswordPuzzle]);

  const handleSudokuSaveToLeaderboard = useCallback((playerName: string) => {
    updateName(playerName);
    recordCompletion('sudoku', sudokuTimerSeconds);
    
    if (challengeType === 'daily') {
      markDailyCompleted('sudoku', sudokuTimerSeconds);
    }
    
    addEntry({
      mode: 'sudoku',
      playerName,
      difficulty: sudokuDifficulty,
      timeSeconds: sudokuTimerSeconds,
      challengeType,
      assisted: sudokuHintsUsed > 0,
    });
  }, [updateName, recordCompletion, addEntry, sudokuTimerSeconds, sudokuDifficulty, sudokuHintsUsed, challengeType, markDailyCompleted]);

  const handleCrosswordSaveToLeaderboard = useCallback((playerName: string) => {
    updateName(playerName);
    recordCompletion('crossword', crosswordTimerSeconds);
    
    if (challengeType === 'daily') {
      markDailyCompleted('crossword', crosswordTimerSeconds);
    }
    
    addEntry({
      mode: 'crossword',
      playerName,
      difficulty: crosswordDifficulty,
      timeSeconds: crosswordTimerSeconds,
      challengeType,
      assisted: crosswordHintsUsed > 0,
    });
  }, [updateName, recordCompletion, addEntry, crosswordTimerSeconds, crosswordDifficulty, crosswordHintsUsed, challengeType, markDailyCompleted]);

  const dailyCompletedForMode = useMemo(() => {
    return isDailyCompleted(mode);
  }, [isDailyCompleted, mode]);

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="home-page">
      <Header 
        stats={stats} 
        onProfileClick={() => setShowProfileModal(true)} 
      />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <ModeSwitcher mode={mode} onChange={handleModeChange} />
          <ChallengeSwitcher 
            activeChallenge={challengeType} 
            onChallengeChange={handleChallengeChange}
            dailyCompleted={dailyCompletedForMode}
          />
        </div>

        {challengeType === 'daily' && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              Daily Challenge - {today}
            </Badge>
            {dailyCompletedForMode && (
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                Completed
              </Badge>
            )}
          </div>
        )}
        
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            {mode === 'sudoku' ? (
              <SudokuMode
                board={sudokuBoard}
                selectedCell={sudokuSelectedCell}
                errors={sudokuErrors}
                difficulty={sudokuDifficulty}
                timerSeconds={sudokuTimerSeconds}
                status={sudokuStatus}
                onCellSelect={handleSudokuCellSelect}
                onCellChange={handleSudokuCellChange}
                onDifficultyChange={handleSudokuDifficultyChange}
                onNewGame={handleSudokuNewGame}
                onReset={handleSudokuReset}
                onCheck={handleSudokuCheck}
                isDaily={challengeType === 'daily'}
              />
            ) : (
              <CrosswordMode
                puzzle={crosswordPuzzle}
                selectedCell={crosswordSelectedCell}
                activeClue={crosswordActiveClue}
                incorrectCells={crosswordIncorrectCells}
                difficulty={crosswordDifficulty}
                timerSeconds={crosswordTimerSeconds}
                status={crosswordStatus}
                onCellSelect={handleCrosswordCellSelect}
                onLetterInput={handleCrosswordLetterInput}
                onClueSelect={handleCrosswordClueSelect}
                onDifficultyChange={handleCrosswordDifficultyChange}
                onNewPuzzle={handleCrosswordNewPuzzle}
                onReset={handleCrosswordReset}
                onCheck={handleCrosswordCheck}
                isDaily={challengeType === 'daily'}
              />
            )}
          </div>
          
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Leaderboard entries={entries} mode={mode} challengeType={challengeType} />
            <div className="hidden lg:block">
              <ProfileStats stats={stats} />
            </div>
          </aside>
        </div>
      </main>

      <CompletionModal
        open={sudokuStatus === 'solved' && mode === 'sudoku'}
        onClose={handleSudokuNewGame}
        mode="sudoku"
        difficulty={sudokuDifficulty}
        timeSeconds={sudokuTimerSeconds}
        playerName={stats.playerName || ''}
        onSaveToLeaderboard={handleSudokuSaveToLeaderboard}
        onPlayAgain={handleSudokuNewGame}
      />

      <CompletionModal
        open={crosswordStatus === 'solved' && mode === 'crossword'}
        onClose={handleCrosswordNewPuzzle}
        mode="crossword"
        difficulty={crosswordDifficulty}
        timeSeconds={crosswordTimerSeconds}
        playerName={stats.playerName || ''}
        onSaveToLeaderboard={handleCrosswordSaveToLeaderboard}
        onPlayAgain={handleCrosswordNewPuzzle}
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
