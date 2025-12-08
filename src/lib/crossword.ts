import type { CrosswordPuzzle, CrosswordCell, CrosswordClue, Difficulty } from "./types";

const BASE_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'base-basics-1',
    title: 'Base Basics',
    difficulty: 'easy',
    width: 7,
    height: 7,
    grid: [],
    clues: [
      { id: 'a1', number: 1, direction: 'across', row: 0, col: 0, length: 4, prompt: 'The L2 network built on Ethereum by Coinbase' },
      { id: 'a5', number: 5, direction: 'across', row: 2, col: 0, length: 7, prompt: 'Type of blockchain that uses optimistic technology' },
      { id: 'a6', number: 6, direction: 'across', row: 4, col: 0, length: 5, prompt: 'Digital assets stored on blockchain' },
      { id: 'a7', number: 7, direction: 'across', row: 6, col: 2, length: 5, prompt: 'The process of bridging assets to L2' },
      { id: 'd1', number: 1, direction: 'down', row: 0, col: 0, length: 5, prompt: 'What you do with crypto when not selling' },
      { id: 'd2', number: 2, direction: 'down', row: 0, col: 2, length: 7, prompt: 'Self-custody key phrase count word' },
      { id: 'd3', number: 3, direction: 'down', row: 0, col: 4, length: 5, prompt: 'Native token of Ethereum' },
      { id: 'd4', number: 4, direction: 'down', row: 2, col: 6, length: 5, prompt: 'Smart contract language' },
    ],
  },
  {
    id: 'base-culture-1',
    title: 'Base Culture',
    difficulty: 'medium',
    width: 9,
    height: 9,
    grid: [],
    clues: [
      { id: 'a1', number: 1, direction: 'across', row: 0, col: 0, length: 6, prompt: 'Exchange that launched Base network' },
      { id: 'a4', number: 4, direction: 'across', row: 2, col: 0, length: 9, prompt: 'What Base provides for the global economy (open ___)' },
      { id: 'a6', number: 6, direction: 'across', row: 4, col: 2, length: 7, prompt: 'Base App feature for messaging' },
      { id: 'a8', number: 8, direction: 'across', row: 6, col: 0, length: 5, prompt: 'You can ___ and earn on Base App' },
      { id: 'a9', number: 9, direction: 'across', row: 8, col: 3, length: 6, prompt: 'Non-fungible ___ (popular on Base)' },
      { id: 'd1', number: 1, direction: 'down', row: 0, col: 0, length: 7, prompt: 'Base community members are often called ___ builders' },
      { id: 'd2', number: 2, direction: 'down', row: 0, col: 3, length: 5, prompt: 'Decentralized identifier (3 letters + DOMAIN)' },
      { id: 'd3', number: 3, direction: 'down', row: 0, col: 5, length: 9, prompt: 'What you do with friends on Base App' },
      { id: 'd5', number: 5, direction: 'down', row: 2, col: 8, length: 5, prompt: 'Unit of transaction cost' },
      { id: 'd7', number: 7, direction: 'down', row: 4, col: 2, length: 5, prompt: 'Base is ___ source' },
    ],
  },
  {
    id: 'crypto-expert-1',
    title: 'Crypto Expert',
    difficulty: 'hard',
    width: 11,
    height: 11,
    grid: [],
    clues: [
      { id: 'a1', number: 1, direction: 'across', row: 0, col: 0, length: 8, prompt: 'Technology that bundles transactions for efficiency' },
      { id: 'a5', number: 5, direction: 'across', row: 2, col: 3, length: 8, prompt: 'Smart contract platform Base is built on' },
      { id: 'a7', number: 7, direction: 'across', row: 4, col: 0, length: 11, prompt: 'What makes Base transactions cheaper than L1' },
      { id: 'a9', number: 9, direction: 'across', row: 6, col: 2, length: 6, prompt: 'Cryptographic proof system (zero-knowledge)' },
      { id: 'a10', number: 10, direction: 'across', row: 8, col: 0, length: 7, prompt: 'Transaction processing capacity' },
      { id: 'a11', number: 11, direction: 'across', row: 10, col: 4, length: 7, prompt: 'Base uses optimistic ___ technology' },
      { id: 'd1', number: 1, direction: 'down', row: 0, col: 0, length: 9, prompt: 'Fraud proof window period on optimistic rollups' },
      { id: 'd2', number: 2, direction: 'down', row: 0, col: 4, length: 11, prompt: 'What secures Base network from the L1' },
      { id: 'd3', number: 3, direction: 'down', row: 0, col: 7, length: 7, prompt: 'Transactions per second metric (abbr)' },
      { id: 'd4', number: 4, direction: 'down', row: 0, col: 10, length: 5, prompt: 'Block reward for validators' },
      { id: 'd6', number: 6, direction: 'down', row: 2, col: 3, length: 7, prompt: 'Moving assets between chains' },
      { id: 'd8', number: 8, direction: 'down', row: 4, col: 8, length: 5, prompt: 'Token standard (ERC-__)' },
    ],
  },
];

const SOLUTIONS: Record<string, string[][]> = {
  'base-basics-1': [
    ['B', 'A', 'S', 'E', '#', '#', '#'],
    ['U', '#', 'E', '#', 'E', '#', '#'],
    ['R', 'O', 'L', 'L', 'T', 'U', 'P'],
    ['N', '#', 'V', '#', 'H', '#', 'O'],
    ['T', 'O', 'K', 'E', 'N', '#', 'S'],
    ['#', '#', 'N', '#', '#', '#', 'T'],
    ['#', '#', 'O', 'N', 'R', 'A', 'M'],
  ],
  'base-culture-1': [
    ['C', 'O', 'I', 'N', 'B', 'A', 'S', 'E', '#'],
    ['R', '#', 'D', 'E', 'N', '#', 'O', '#', '#'],
    ['Y', 'I', 'N', 'F', 'R', 'A', 'C', 'I', 'A'],
    ['P', '#', 'S', '#', 'I', '#', 'I', '#', 'N'],
    ['T', '#', 'C', 'H', 'A', 'T', 'A', 'L', 'K'],
    ['O', '#', '#', '#', 'L', '#', 'L', '#', '#'],
    ['T', 'R', 'A', 'D', 'E', '#', '#', '#', '#'],
    ['R', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['A', '#', '#', 'T', 'O', 'K', 'E', 'N', 'S'],
  ],
  'crypto-expert-1': [
    ['R', 'O', 'L', 'L', 'S', 'E', 'C', 'T', 'P', 'S', 'A'],
    ['E', '#', '#', '#', 'E', '#', '#', 'P', '#', '#', 'S'],
    ['C', '#', '#', 'E', 'T', 'H', 'E', 'R', 'E', 'U', 'M'],
    ['H', '#', '#', '#', 'C', '#', '#', 'S', '#', '#', 'O'],
    ['S', 'C', 'A', 'L', 'A', 'B', 'I', 'L', 'I', 'T', 'Y'],
    ['L', '#', '#', '#', 'I', '#', '#', '#', '#', '#', '#'],
    ['E', '#', 'Z', 'K', 'R', 'O', 'L', 'L', '#', '#', '#'],
    ['N', '#', '#', '#', 'N', '#', '#', '#', '#', '#', '#'],
    ['G', 'A', 'S', 'C', 'O', 'S', 'T', '#', '#', '#', '#'],
    ['T', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['H', '#', '#', '#', 'R', 'O', 'L', 'L', 'U', 'P', 'S'],
  ],
};

function buildGrid(puzzle: CrosswordPuzzle): CrosswordCell[][] {
  const solution = SOLUTIONS[puzzle.id];
  const grid: CrosswordCell[][] = [];
  
  const cellNumbers = new Map<string, number>();
  puzzle.clues.forEach(clue => {
    const key = `${clue.row}-${clue.col}`;
    if (!cellNumbers.has(key)) {
      cellNumbers.set(key, clue.number);
    }
  });

  for (let row = 0; row < puzzle.height; row++) {
    const rowCells: CrosswordCell[] = [];
    for (let col = 0; col < puzzle.width; col++) {
      const letter = solution[row][col];
      const isBlock = letter === '#';
      const key = `${row}-${col}`;
      
      rowCells.push({
        row,
        col,
        letter: isBlock ? null : letter,
        userLetter: null,
        isBlock,
        number: cellNumbers.get(key),
      });
    }
    grid.push(rowCells);
  }
  
  return grid;
}

export function getCrosswordPuzzle(difficulty: Difficulty, seed?: number): CrosswordPuzzle {
  const puzzles = BASE_PUZZLES.filter(p => p.difficulty === difficulty);
  const index = seed !== undefined ? seed % puzzles.length : Math.floor(Math.random() * puzzles.length);
  const puzzle = puzzles.length > 0 
    ? puzzles[index % puzzles.length]
    : BASE_PUZZLES[0];
  
  return {
    ...puzzle,
    grid: buildGrid(puzzle),
  };
}

export function getDailyCrosswordPuzzle(dateString: string): CrosswordPuzzle {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash;
  }
  const seed = Math.abs(hash);
  const puzzle = BASE_PUZZLES[seed % BASE_PUZZLES.length];
  return {
    ...puzzle,
    grid: buildGrid(puzzle),
  };
}

export function getDailyCrosswordDifficulty(dateString: string): Difficulty {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash;
  }
  const seed = Math.abs(hash);
  return BASE_PUZZLES[seed % BASE_PUZZLES.length].difficulty;
}

export function isCrosswordSolved(puzzle: CrosswordPuzzle): boolean {
  for (const row of puzzle.grid) {
    for (const cell of row) {
      if (!cell.isBlock) {
        if (!cell.userLetter || cell.userLetter.toUpperCase() !== cell.letter?.toUpperCase()) {
          return false;
        }
      }
    }
  }
  return true;
}

export function getIncorrectCells(puzzle: CrosswordPuzzle): Set<string> {
  const incorrect = new Set<string>();
  
  for (const row of puzzle.grid) {
    for (const cell of row) {
      if (!cell.isBlock && cell.userLetter) {
        if (cell.userLetter.toUpperCase() !== cell.letter?.toUpperCase()) {
          incorrect.add(`${cell.row}-${cell.col}`);
        }
      }
    }
  }
  
  return incorrect;
}

export function getCellsForClue(puzzle: CrosswordPuzzle, clue: CrosswordClue): CrosswordCell[] {
  const cells: CrosswordCell[] = [];
  for (let i = 0; i < clue.length; i++) {
    const row = clue.direction === 'down' ? clue.row + i : clue.row;
    const col = clue.direction === 'across' ? clue.col + i : clue.col;
    if (row < puzzle.height && col < puzzle.width) {
      cells.push(puzzle.grid[row][col]);
    }
  }
  return cells;
}

export function findClueForCell(
  puzzle: CrosswordPuzzle, 
  row: number, 
  col: number, 
  preferredDirection?: 'across' | 'down'
): CrosswordClue | null {
  const matchingClues = puzzle.clues.filter(clue => {
    for (let i = 0; i < clue.length; i++) {
      const clueRow = clue.direction === 'down' ? clue.row + i : clue.row;
      const clueCol = clue.direction === 'across' ? clue.col + i : clue.col;
      if (clueRow === row && clueCol === col) {
        return true;
      }
    }
    return false;
  });

  if (matchingClues.length === 0) return null;
  
  if (preferredDirection) {
    const preferred = matchingClues.find(c => c.direction === preferredDirection);
    if (preferred) return preferred;
  }
  
  return matchingClues[0];
}

export function clonePuzzle(puzzle: CrosswordPuzzle): CrosswordPuzzle {
  return {
    ...puzzle,
    grid: puzzle.grid.map(row => row.map(cell => ({ ...cell }))),
  };
}
