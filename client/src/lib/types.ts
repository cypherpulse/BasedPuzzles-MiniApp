export type PuzzleMode = 'sudoku' | 'crossword';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'playing' | 'solved';
export type ChallengeType = 'practice' | 'daily';

export interface SudokuCell {
  value: number | null;
  row: number;
  col: number;
  readonly: boolean;
}

export type SudokuBoard = SudokuCell[][];

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string | null;
  userLetter: string | null;
  isBlock: boolean;
  number?: number;
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  length: number;
  prompt: string;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  width: number;
  height: number;
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
  difficulty: Difficulty;
}

export interface ModeStats {
  gamesCompleted: number;
  bestTimeSeconds?: number;
  totalPuzzlesStarted: number;
}

export interface PlayerStats {
  sudoku: ModeStats;
  crossword: ModeStats;
  streakDays: number;
  lastPlayedDate?: string;
  playerName?: string;
}

export type LeaderboardMode = 'sudoku' | 'crossword';

export interface LeaderboardEntry {
  id: string;
  mode: LeaderboardMode;
  playerName: string;
  difficulty: Difficulty;
  timeSeconds: number;
  completedAt: number;
  challengeType?: ChallengeType;
  assisted?: boolean;
}

export interface DailyStats {
  sudokuCompleted: boolean;
  crosswordCompleted: boolean;
  sudokuTime?: number;
  crosswordTime?: number;
  date: string;
}

export function getPlayerTitle(stats: PlayerStats): string {
  const total = stats.sudoku.gamesCompleted + stats.crossword.gamesCompleted;
  if (total >= 50) return 'Base OG';
  if (total >= 25) return 'Base Grinder';
  if (total >= 10) return 'Base Explorer';
  if (total >= 5) return 'Base Rookie';
  return 'Base Beginner';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function getDailyPuzzleSeed(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
