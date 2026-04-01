export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'custom';
  customDays?: number[]; // 0-6 for Sun-Sat
  color: string;
  icon: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  completedDates: string[]; // Array of YYYY-MM-DD
  createdAt: string;
}

export type LevelInfo = {
  level: number;
  name: string;
  minXp: number;
};

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Beginner', minXp: 0 },
  { level: 2, name: 'Novice', minXp: 500 },
  { level: 3, name: 'Intermediate', minXp: 1500 },
  { level: 4, name: 'Advanced', minXp: 3000 },
  { level: 5, name: 'Pro', minXp: 5000 },
  { level: 6, name: 'Master', minXp: 10000 },
];

export function getLevelFromXp(xp: number): LevelInfo {
  return [...LEVELS].reverse().find((l) => xp >= l.minXp) || LEVELS[0];
}
