import { useState, useEffect, useCallback, useRef } from "react";
import { getCrosswordPuzzle, clonePuzzle, isCrosswordSolved, getIncorrectCells, findClueForCell, getDailyCrosswordPuzzle, getDailyCrosswordDifficulty, fetchDailyCrossword, verifyCrosswordSolution } from "@/lib/crossword";
import type { CrosswordPuzzle, CrosswordClue, Difficulty, GameStatus, ChallengeType } from "@/lib/types";
import { getTodayDateString } from "@/lib/types";
import { useWalletAddress } from "@/hooks/useWalletAddress";

interface UseCrosswordGameOptions {
  onGameStart?: () => void;
  challengeType?: ChallengeType;
}

export function useCrosswordGame(options?: UseCrosswordGameOptions) {
  const challengeType = options?.challengeType ?? 'practice';
  const today = getTodayDateString();
  const { address } = useWalletAddress();
  
  const [difficulty, setDifficultyState] = useState<Difficulty>(() => {
    if (challengeType === 'daily') {
      return getDailyCrosswordDifficulty(today);
    }
    return 'easy';
  });
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle>(() => {
    if (challengeType === 'daily') {
      return getDailyCrosswordPuzzle(today);
    }
    return getCrosswordPuzzle('easy');
  });
  const [initialPuzzle, setInitialPuzzle] = useState<CrosswordPuzzle>(() => clonePuzzle(puzzle));
  const [loading, setLoading] = useState(challengeType === 'daily');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hasStarted, setHasStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const currentDirection = useRef<'across' | 'down'>('across');

  // Load puzzle
  useEffect(() => {
    const loadPuzzle = async () => {
      if (challengeType === 'daily') {
        try {
          const fetchedPuzzle = await fetchDailyCrossword(today, address || undefined);
          setPuzzle(fetchedPuzzle);
          setInitialPuzzle(clonePuzzle(fetchedPuzzle));
        } catch (error) {
          console.error('Failed to load daily crossword:', error);
          // Fallback to local
          const localPuzzle = getDailyCrosswordPuzzle(today);
          setPuzzle(localPuzzle);
          setInitialPuzzle(clonePuzzle(localPuzzle));
        }
      } else {
        const localPuzzle = getCrosswordPuzzle(difficulty);
        setPuzzle(localPuzzle);
        setInitialPuzzle(clonePuzzle(localPuzzle));
      }
      setLoading(false);
    };
    loadPuzzle();
  }, [challengeType, today, difficulty, address]);

  useEffect(() => {
    if (status === 'playing' && hasStarted) {
      timerRef.current = window.setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, hasStarted]);

  const startNewPuzzle = useCallback(() => {
    if (challengeType === 'daily') {
      const newPuzzle = getDailyCrosswordPuzzle(today);
      setPuzzle(newPuzzle);
      setInitialPuzzle(clonePuzzle(newPuzzle));
      setDifficultyState(getDailyCrosswordDifficulty(today));
    } else {
      const newPuzzle = getCrosswordPuzzle(difficulty);
      setPuzzle(newPuzzle);
      setInitialPuzzle(clonePuzzle(newPuzzle));
    }
    setSelectedCell(null);
    setActiveClue(null);
    setIncorrectCells(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
    setHintsUsed(0);
    currentDirection.current = 'across';
  }, [difficulty, challengeType, today]);

  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    if (challengeType === 'daily') return;
    setDifficultyState(newDifficulty);
    const newPuzzle = getCrosswordPuzzle(newDifficulty);
    setPuzzle(newPuzzle);
    setInitialPuzzle(clonePuzzle(newPuzzle));
    setSelectedCell(null);
    setActiveClue(null);
    setIncorrectCells(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
    setHintsUsed(0);
    currentDirection.current = 'across';
    options?.onGameStart?.();
  }, [options, challengeType]);

  const selectCell = useCallback((row: number, col: number) => {
    const cell = puzzle.grid[row][col];
    if (cell.isBlock) return;

    if (!hasStarted) {
      setHasStarted(true);
      options?.onGameStart?.();
    }

    if (selectedCell?.row === row && selectedCell?.col === col) {
      currentDirection.current = currentDirection.current === 'across' ? 'down' : 'across';
    }

    setSelectedCell({ row, col });
    
    const clue = findClueForCell(puzzle, row, col, currentDirection.current);
    if (clue) {
      setActiveClue(clue);
      currentDirection.current = clue.direction;
    }
    
    setIncorrectCells(new Set());
  }, [puzzle, selectedCell, hasStarted, options]);

  const selectClue = useCallback((clueId: string) => {
    const clue = puzzle.clues.find((c: CrosswordClue) => c.id === clueId);
    if (!clue) return;

    if (!hasStarted) {
      setHasStarted(true);
      options?.onGameStart?.();
    }

    setActiveClue(clue);
    setSelectedCell({ row: clue.row, col: clue.col });
    currentDirection.current = clue.direction;
    setIncorrectCells(new Set());
  }, [puzzle.clues, hasStarted, options]);

  const setLetter = useCallback((row: number, col: number, letter: string | null) => {
    if (status !== 'playing') return;
    
    const cell = puzzle.grid[row][col];
    if (cell.isBlock) return;

    if (!hasStarted) {
      setHasStarted(true);
      options?.onGameStart?.();
    }

    setPuzzle((prevPuzzle: CrosswordPuzzle) => {
      const newPuzzle = clonePuzzle(prevPuzzle);
      newPuzzle.grid[row][col].userLetter = letter;
      return newPuzzle;
    });
    
    setIncorrectCells(new Set());
  }, [puzzle, status, hasStarted, options]);

  const resetPuzzle = useCallback(() => {
    setPuzzle(clonePuzzle(initialPuzzle));
    setSelectedCell(null);
    setActiveClue(null);
    setIncorrectCells(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
    setHintsUsed(0);
    currentDirection.current = 'across';
  }, [initialPuzzle]);

  const checkSolution = useCallback(() => {
    const incorrect = getIncorrectCells(puzzle);
    setIncorrectCells(incorrect);

    if (isCrosswordSolved(puzzle)) {
      setStatus('solved');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return true;
    }
    
    return false;
  }, [puzzle]);

  const submitSolution = useCallback(async () => {
    if (!puzzle || !address || challengeType !== 'daily') return false;
    
    try {
      const solution = puzzle.grid.flat().map((cell: CrosswordCell) => cell.letter || '');
      const result = await verifyCrosswordSolution(puzzle.id, solution, timerSeconds, address);
      if (result.valid) {
        setStatus('solved');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to verify solution:', error);
    }
    return false;
  }, [puzzle, address, challengeType, timerSeconds]);

  return {
    puzzle,
    loading,
    selectedCell,
    activeClue,
    incorrectCells,
    difficulty,
    timerSeconds,
    status,
    hintsUsed,
    challengeType,
    setDifficulty,
    startNewPuzzle,
    selectCell,
    selectClue,
    setLetter,
    resetPuzzle,
    checkSolution,
    submitSolution,
    setHintsUsed,
  };
}
