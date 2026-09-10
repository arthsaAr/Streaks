export type PastStreak = {
  start: number;
  end: number;
};

export type Habit = {
  id: string;
  name: string;
  note?: string;
  startTimestamp: number;
  pastStreaks: PastStreak[];
};