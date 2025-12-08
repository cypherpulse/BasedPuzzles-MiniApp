import { useState, useEffect, useCallback, useRef } from "react";
import { getSudokuPuzzle, cloneBoard, isBoardSolved, getErrorCells } from "@/lib/sudoku";
import type { SudokuBoard, Difficulty, GameStatus } from "@/lib/types";

interface UseSudokuGameOptions {
  onGameStart?: () => void;
}

export function useSudokuGame(options?: UseSudokuGameOptions) {
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<SudokuBoard>(() => getSudokuPuzzle('easy'));
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>(() => cloneBoard(board));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<number | null>(null);

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

  const startNewGame = useCallback(() => {
    const newBoard = getSudokuPuzzle(difficulty);
    setBoard(newBoard);
    setInitialBoard(cloneBoard(newBoard));
    setSelectedCell(null);
    setErrors(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
  }, [difficulty]);

  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficultyState(newDifficulty);
    const newBoard = getSudokuPuzzle(newDifficulty);
    setBoard(newBoard);
    setInitialBoard(cloneBoard(newBoard));
    setSelectedCell(null);
    setErrors(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
    options?.onGameStart?.();
  }, [options]);

  const selectCell = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
    if (!hasStarted) {
      setHasStarted(true);
      options?.onGameStart?.();
    }
  }, [hasStarted, options]);

  const updateCell = useCallback((row: number, col: number, value: number | null) => {
    if (status !== 'playing') return;
    
    const cell = board[row][col];
    if (cell.readonly) return;

    if (!hasStarted) {
      setHasStarted(true);
      options?.onGameStart?.();
    }

    setBoard(prevBoard => {
      const newBoard = cloneBoard(prevBoard);
      newBoard[row][col].value = value;
      return newBoard;
    });
    
    setErrors(new Set());
  }, [board, status, hasStarted, options]);

  const resetBoard = useCallback(() => {
    setBoard(cloneBoard(initialBoard));
    setErrors(new Set());
    setTimerSeconds(0);
    setStatus('playing');
    setHasStarted(false);
  }, [initialBoard]);

  const checkSolution = useCallback(() => {
    const errorCells = getErrorCells(board);
    setErrors(errorCells);

    if (isBoardSolved(board)) {
      setStatus('solved');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return true;
    }
    
    return false;
  }, [board]);

  return {
    board,
    initialBoard,
    selectedCell,
    errors,
    difficulty,
    timerSeconds,
    status,
    setDifficulty,
    startNewGame,
    selectCell,
    updateCell,
    resetBoard,
    checkSolution,
  };
}
