import { Text, View } from "react-native";
import { getOverallTier } from "../lib/levels";
import { getElapsed } from "../lib/time";
import { Habit } from "../lib/types";

export function OverallRankCard({ habits }: { habits: Habit[] }) {
  if (habits.length === 0) return null;

  const daysList = habits.map((h) => getElapsed(h.startTimestamp).days);
  const overall = getOverallTier(daysList);
  if (!overall) return null;

  return (
    <View className="bg-[#1c1c1e] rounded-2xl p-5 mb-4 border border-amber-500/20">
      <Text className="text-gray-500 text-xs tracking-wide">OVERALL STANDING</Text>
      <Text className="text-amber-500 text-2xl font-bold mt-1">{overall.label}</Text>
      <Text className="text-gray-500 text-xs mt-1">
        Based on {habits.length} habit{habits.length === 1 ? "" : "s"}
      </Text>
    </View>
  );
}