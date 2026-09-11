export const TIERS = [
  { minDays: 0, label: "Starting Out" },
  { minDays: 1, label: "Building Momentum" },
  { minDays: 3, label: "Finding Rhythm" },
  { minDays: 7, label: "Gaining Strength" },
  { minDays: 14, label: "Committed" },
  { minDays: 30, label: "Resilient" },
  { minDays: 60, label: "Unstoppable" },
  { minDays: 90, label: "Legend" },
];

export function getTierIndex(days: number) {
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (days >= t.minDays) idx = i;
  });
  return idx;
}

export function getTier(days: number) {
  return TIERS[getTierIndex(days)];
}

export function getOverallTier(daysList: number[]) {
  if (daysList.length === 0) return null;
  const avgIdx = daysList.reduce((sum, d) => sum + getTierIndex(d), 0) / daysList.length;
  return TIERS[Math.round(avgIdx)];
}