export interface User {
  id: string;
  email: string;
  username?: string;
  character: Character;
  preferences: UserPreferences;
  createdAt: string;
  personality: string;
  hydrationStreak?: number;
  lastHydrationAck: Date | null;
  hydrationTodayLitres?: number; // litres recorded today
  dailyHydrationGoal?: number;   // goal in litres (e.g. 2.0)
  lastHydrationGoalCompleted?: Date | null; // when the goal was last met
}

export interface Character {
  name: string;
  avatar: AvatarType;
  theme: ThemeColor;
  level: number;
  xp: number;
  totalXP: number;
  rank: Rank;
}

export type AvatarType = 'warrior' | 'mage' | 'assassin' | 'archer' | 'knight' | 'berserker';
export type ThemeColor = 'blue' | 'purple' | 'red' | 'gold' | 'green';
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
export type TaskType = 'easy' | 'medium' | 'hard';
export type TaskCategory = 'health' | 'work' | 'learning' | 'social' | 'creative' | 'other';

export interface UserPreferences {
  notifications: boolean;
  soundEffects: boolean;
  penalties: boolean;
  darkMode: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  type: TaskType;
  goal: number;
  progress: number;
  points: number;
  category: TaskCategory;
  date: string;
  completed: boolean;
  streak: number;
  createdAt: string;
}

export interface DailyEntry {
  id: string;
  userId: string;
  date: string;
  tasks: Task[];
  notes: string;
  mood: string;
  memories: string;
  completionRate: number;
  pointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  tasks: Task[];
  timeRemaining: number; // in seconds
  rewardPoints: number;
  completed: boolean;
}

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  percentage: number;
}

export const XP_REQUIREMENTS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5500,
  9: 8000,
  10: 11000,
};

export const RANK_THRESHOLDS: Record<Rank, number> = {
  E: 0,
  D: 1000,
  C: 5000,
  B: 10000,
  A: 25000,
  S: 50000,
  SS: 100000,
  SSS: 200000,
};

export const TASK_POINTS: Record<TaskType, { min: number; max: number }> = {
  easy: { min: 10, max: 50 },
  medium: { min: 50, max: 100 },
  hard: { min: 100, max: 200 },
};

export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  if (XP_REQUIREMENTS[level]) return XP_REQUIREMENTS[level];
  
  // Exponential scaling for levels beyond 10
  const baseXP = 11000;
  const multiplier = Math.pow(1.5, level - 10);
  return Math.floor(baseXP * multiplier);
}

export function getRankFromXP(xp: number): Rank {
  if (xp >= RANK_THRESHOLDS.SSS) return 'SSS';
  if (xp >= RANK_THRESHOLDS.SS) return 'SS';
  if (xp >= RANK_THRESHOLDS.S) return 'S';
  if (xp >= RANK_THRESHOLDS.A) return 'A';
  if (xp >= RANK_THRESHOLDS.B) return 'B';
  if (xp >= RANK_THRESHOLDS.C) return 'C';
  if (xp >= RANK_THRESHOLDS.D) return 'D';
  return 'E';
}

export function calculateLevelProgress(xp: number, level: number): LevelProgress {
  const xpForCurrentLevel = calculateXPForLevel(level);
  const xpForNextLevel = calculateXPForLevel(level + 1);
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const percentage = Math.min(100, (xpInCurrentLevel / xpNeeded) * 100);

  return {
    currentLevel: level,
    currentXP: xpInCurrentLevel,
    xpForNextLevel: xpNeeded,
    percentage,
  };
}

