import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { getTier } from "../lib/levels";
import { Habit } from "../lib/types";
import { useElapsed } from "../lib/useElapsed";

export function HabitCard({ habit }: { habit: Habit }) {
  const { days, hours } = useElapsed(habit.startTimestamp);
  const tier = getTier(days);

  return (
    <Pressable
      onPress={() => router.push(`/habit/${habit.id}`)}
      className="bg-[#1c1c1e] rounded-2xl p-5 mb-4"
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-gray-300 text-base">{habit.name}</Text>
          {habit.note ? <Text className="text-gray-500 text-xs mt-1">{habit.note}</Text> : null}
        </View>
        <View className="w-2 h-2 rounded-full bg-amber-500 mt-1" />
      </View>
      <Text className="text-amber-500 text-4xl font-semibold mt-3">
        {days}d {hours}h
      </Text>
      <Text className="text-gray-500 text-xs mt-2 uppercase tracking-wide">{tier.label}</Text>
    </Pressable>
  );
}