import type { SudokuBoard, SudokuCell, Difficulty } from "./types";

const EASY_PUZZLES = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
];

const MEDIUM_PUZZLES = [
  [
    [0, 0, 0, 6, 0, 0, 4, 0, 0],
    [7, 0, 0, 0, 0, 3, 6, 0, 0],
    [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 1, 8, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0],
    [9, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0, 0],
  ],
  [
    [2, 0, 0, 3, 0, 0, 0, 0, 0],
    [8, 0, 4, 0, 6, 2, 0, 0, 3],
    [0, 1, 3, 8, 0, 0, 2, 0, 0],
    [0, 0, 0, 0, 2, 0, 3, 9, 0],
    [5, 0, 7, 0, 0, 0, 6, 2, 1],
    [0, 3, 2, 0, 0, 6, 0, 0, 0],
    [0, 2, 0, 0, 0, 9, 1, 4, 0],
    [6, 0, 1, 2, 5, 0, 8, 0, 9],
    [0, 0, 0, 0, 0, 1, 0, 0, 2],
  ],
];

const HARD_PUZZLES = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 8, 5],
    [0, 0, 1, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 7, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 1, 0, 0],
    [0, 9, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 7, 3],
    [0, 0, 2, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 9],
  ],
  [
    [0, 0, 5, 3, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 7, 0, 0, 1, 0, 5, 0, 0],
    [4, 0, 0, 0, 0, 5, 3, 0, 0],
    [0, 1, 0, 0, 7, 0, 0, 0, 6],
    [0, 0, 3, 2, 0, 0, 0, 8, 0],
    [0, 6, 0, 5, 0, 0, 0, 0, 9],
    [0, 0, 4, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 9, 7, 0, 0],
  ],
];

function getPuzzlesByDifficulty(difficulty: Difficulty): number[][][] {
  switch (difficulty) {
    case 'easy':
      return EASY_PUZZLES;
    case 'medium':
      return MEDIUM_PUZZLES;
    case 'hard':
      return HARD_PUZZLES;
  }
}

export function getSudokuPuzzle(difficulty: Difficulty): SudokuBoard {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  const puzzleData = puzzles[Math.floor(Math.random() * puzzles.length)];
  
  return puzzleData.map((row, rowIndex) =>
    row.map((value, colIndex): SudokuCell => ({
      value: value === 0 ? null : value,
      row: rowIndex,
      col: colIndex,
      readonly: value !== 0,
    }))
  );
}

export function isRowValid(board: SudokuBoard, rowIndex: number): boolean {
  const values = board[rowIndex]
    .map(cell => cell.value)
    .filter((v): v is number => v !== null);
  return new Set(values).size === values.length;
}

export function isColValid(board: SudokuBoard, colIndex: number): boolean {
  const values = board
    .map(row => row[colIndex].value)
    .filter((v): v is number => v !== null);
  return new Set(values).size === values.length;
}

export function isBoxValid(board: SudokuBoard, boxRowIndex: number, boxColIndex: number): boolean {
  const values: number[] = [];
  for (let r = boxRowIndex * 3; r < boxRowIndex * 3 + 3; r++) {
    for (let c = boxColIndex * 3; c < boxColIndex * 3 + 3; c++) {
      const value = board[r][c].value;
      if (value !== null) {
        values.push(value);
      }
    }
  }
  return new Set(values).size === values.length;
}

export function isBoardComplete(board: SudokuBoard): boolean {
  return board.every(row => row.every(cell => cell.value !== null));
}

export function isBoardSolved(board: SudokuBoard): boolean {
  if (!isBoardComplete(board)) return false;
  
  for (let i = 0; i < 9; i++) {
    if (!isRowValid(board, i)) return false;
    if (!isColValid(board, i)) return false;
  }
  
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      if (!isBoxValid(board, boxRow, boxCol)) return false;
    }
  }
  
  return true;
}

export function getErrorCells(board: SudokuBoard): Set<string> {
  const errors = new Set<string>();
  
  for (let row = 0; row < 9; row++) {
    const rowValues = new Map<number, number[]>();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!rowValues.has(value)) {
          rowValues.set(value, []);
        }
        rowValues.get(value)!.push(col);
      }
    }
    rowValues.forEach((cols, _) => {
      if (cols.length > 1) {
        cols.forEach(col => errors.add(`r${row}c${col}`));
      }
    });
  }

  for (let col = 0; col < 9; col++) {
    const colValues = new Map<number, number[]>();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!colValues.has(value)) {
          colValues.set(value, []);
        }
        colValues.get(value)!.push(row);
      }
    }
    colValues.forEach((rows, _) => {
      if (rows.length > 1) {
        rows.forEach(row => errors.add(`r${row}c${col}`));
      }
    });
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const boxValues = new Map<number, Array<{ row: number; col: number }>>();
      for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
        for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
          const value = board[r][c].value;
          if (value !== null) {
            if (!boxValues.has(value)) {
              boxValues.set(value, []);
            }
            boxValues.get(value)!.push({ row: r, col: c });
          }
        }
      }
      boxValues.forEach((cells, _) => {
        if (cells.length > 1) {
          cells.forEach(({ row, col }) => errors.add(`r${row}c${col}`));
        }
      });
    }
  }

  return errors;
}

export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return board.map(row => row.map(cell => ({ ...cell })));
}
