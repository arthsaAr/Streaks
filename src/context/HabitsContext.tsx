import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadHabits, saveHabits } from "../lib/storage";
import { Habit } from "../lib/types";

type HabitsContextType = {
  habits: Habit[];
  loading: boolean;
  addHabit: (name: string, note: string, startTimestamp: number) => Promise<void>;
  resetHabit: (id: string) => Promise<void>;
  setStartTime: (id: string, timestamp: number) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  getHabit: (id: string) => Habit | undefined;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits().then((h) => {
      setHabits(h);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: Habit[]) => {
    setHabits(next);
    await saveHabits(next);
  }, []);

  const addHabit = useCallback(
    async (name: string, note: string, startTimestamp: number) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        note,
        startTimestamp,
        pastStreaks: [],
      };
      await persist([newHabit, ...habits]);
    },
    [habits, persist]
  );

  const resetHabit = useCallback(
    async (id: string) => {
      const now = Date.now();
      const next = habits.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              startTimestamp: now,
              pastStreaks: [{ start: h.startTimestamp, end: now }, ...h.pastStreaks],
            }
      );
      await persist(next);
    },
    [habits, persist]
  );

  const setStartTime = useCallback(
    async (id: string, timestamp: number) => {
      const next = habits.map((h) => (h.id === id ? { ...h, startTimestamp: timestamp } : h));
      await persist(next);
    },
    [habits, persist]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      await persist(habits.filter((h) => h.id !== id));
    },
    [habits, persist]
  );

  const getHabit = useCallback((id: string) => habits.find((h) => h.id === id), [habits]);

  return (
    <HabitsContext.Provider
      value={{ habits, loading, addHabit, resetHabit, setStartTime, deleteHabit, getHabit }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}