import { useState, useEffect, useCallback, useRef } from "react";
import { getCrosswordPuzzle, clonePuzzle, isCrosswordSolved, getIncorrectCells, findClueForCell } from "@/lib/crossword";
import type { CrosswordPuzzle, CrosswordClue, Difficulty, GameStatus } from "@/lib/types";

interface UseCrosswordGameOptions {
  onGameStart?: () => void;
}

export function useCrosswordGame(options?: UseCrosswordGameOptions) {
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle>(() => getCrosswordPuzzle('easy'));
  const [initialPuzzle, setInitialPuzzle] = useState<CrosswordPuzzle>(() => clonePuzzle(puzzle));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const currentDirection = useRef<'across' | 'down'>('across');

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
    const newPuzzle = getCrosswordPuzzle(difficulty);
    setPuzzle(newPuzzle);
    setInitialPuzzle(clonePuzzle(newPuzzle));
    setSelectedCell(null);
    setActiveClue(null);
    setIncorrectCells(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
    currentDirection.current = 'across';
  }, [difficulty]);

  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
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
    currentDirection.current = 'across';
    options?.onGameStart?.();
  }, [options]);

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
    const clue = puzzle.clues.find(c => c.id === clueId);
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

    setPuzzle(prevPuzzle => {
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

  return {
    puzzle,
    selectedCell,
    activeClue,
    incorrectCells,
    difficulty,
    timerSeconds,
    status,
    setDifficulty,
    startNewPuzzle,
    selectCell,
    selectClue,
    setLetter,
    resetPuzzle,
    checkSolution,
  };
}
