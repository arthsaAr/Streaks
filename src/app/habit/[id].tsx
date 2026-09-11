import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { DateTimeField } from "../../components/DateTimeField";
import { useHabits } from "../../context/HabitsContext";
import { formatDuration } from "../../lib/time";
import { useElapsed } from "../../lib/useElapsed";

type Mode = "idle" | "settingStart" | "confirmingReset" | "confirmingDelete";

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, resetHabit, deleteHabit, setStartTime } = useHabits();
  const habit = getHabit(id as string);
  const { height } = useWindowDimensions();

  const [mode, setMode] = useState<Mode>("idle");
  const [pendingDate, setPendingDate] = useState(new Date());

  const { days, hours, minutes, seconds, totalHours, totalMinutes } = useElapsed(
    habit?.startTimestamp ?? Date.now()
  );

  if (!habit) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <Text className="text-gray-500">Habit not found</Text>
      </View>
    );
  }

  const openSetStart = () => {
    setPendingDate(new Date(habit.startTimestamp));
    setMode("settingStart");
  };

  const applyStartTime = async () => {
    await setStartTime(habit.id, pendingDate.getTime());
    setMode("idle");
  };

  const confirmReset = async () => {
    await resetHabit(habit.id);
    setMode("idle");
  };

  const confirmDelete = async () => {
    await deleteHabit(habit.id);
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-[#121212]" showsVerticalScrollIndicator={false}>
      {/* Hero section — fills the screen, only header + timer visible before scrolling */}
      <View style={{ minHeight: height + 80 }} className="px-5 pt-16">
        <View className="flex-row items-center mb-1">
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-[#1c1c1e] items-center justify-center mr-3"
          >
            <Text className="text-white text-lg">‹</Text>
          </Pressable>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-xl font-bold">{habit.name}</Text>
              <Pressable onPress={() => router.push(`/habit/edit?id=${habit.id}`)} className="px-2">
                <Text className="text-gray-500 text-xs">Edit</Text>
              </Pressable>
            </View>
            {habit.note ? <Text className="text-gray-500 text-xs mt-1">{habit.note}</Text> : null}
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="flex-row items-end">
            <Text className="text-amber-500 text-6xl font-bold">{days}</Text>
            <Text className="text-gray-500 text-2xl mb-1 mr-3">d</Text>
            <Text className="text-amber-500 text-6xl font-bold">
              {hours.toString().padStart(2, "0")}
            </Text>
            <Text className="text-gray-500 text-2xl mb-1">h</Text>
          </View>
          <Text className="text-gray-500 text-sm mt-2">
            {minutes}m {seconds}s
          </Text>

          <View className="flex-row justify-between w-full mt-10 px-4">
            <View className="items-center flex-1">
              <Text className="text-white text-lg font-semibold">{days}</Text>
              <Text className="text-gray-500 text-xs mt-1">DAYS</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-lg font-semibold">{totalHours}</Text>
              <Text className="text-gray-500 text-xs mt-1">HOURS</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-lg font-semibold">{totalMinutes}</Text>
              <Text className="text-gray-500 text-xs mt-1">MINUTES</Text>
            </View>
          </View>

          <View className="flex-row w-full mt-6 h-px">
            <View className="w-1/4 bg-amber-500 h-px" />
            <View className="flex-1 bg-[#2c2c2e] h-px" />
          </View>

          <Text className="text-gray-600 text-lg mt-6">⌄</Text>
        </View>
      </View>

      {/* Actions section — only reached by scrolling */}
      <View className="px-5 pb-16">
        <Text className="text-gray-500 text-xs mb-3 tracking-wide">ACTIONS</Text>

        {mode === "settingStart" ? (
          <View className="mb-3">
            <Pressable onPress={() => setMode("idle")} className="bg-[#1c1c1e] rounded-xl py-4 items-center mb-3">
              <Text className="text-gray-400">Cancel</Text>
            </Pressable>
            <View className="mb-3">
              <DateTimeField value={pendingDate} onChange={setPendingDate} />
            </View>
            <Pressable onPress={applyStartTime} className="bg-amber-500 rounded-xl py-4 items-center">
              <Text className="text-black font-semibold">Apply</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={openSetStart} className="bg-[#1c1c1e] rounded-xl py-4 items-center mb-3">
            <Text className="text-gray-300">Set start time</Text>
          </Pressable>
        )}

        {mode === "confirmingReset" ? (
          <View className="bg-[#1c1c1e] rounded-xl px-4 py-4 mb-8">
            <Text className="text-gray-300 text-center mb-4">Reset this streak to zero?</Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setMode("idle")}
                className="flex-1 bg-[#2c2c2e] rounded-xl py-3 items-center"
              >
                <Text className="text-gray-300">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmReset}
                className="flex-1 bg-amber-900 rounded-xl py-3 items-center"
              >
                <Text className="text-amber-500 font-semibold">Reset</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setMode("confirmingReset")}
            className="bg-[#1c1c1e] rounded-xl py-4 items-center mb-8"
          >
            <Text className="text-amber-500">Reset streak</Text>
          </Pressable>
        )}

        {habit.pastStreaks.length > 0 && (
          <>
            <Text className="text-gray-500 text-xs mb-3 tracking-wide">PAST STREAKS</Text>
            {habit.pastStreaks.map((s, i) => (
              <View
                key={i}
                className="bg-[#1c1c1e] rounded-xl px-4 py-4 mb-3 flex-row justify-between items-center"
              >
                <Text className="text-gray-400 text-xs">
                  {new Date(s.start).toLocaleDateString()} — {new Date(s.end).toLocaleDateString()}
                </Text>
                <Text className="text-gray-300 text-sm">{formatDuration(s.end - s.start)}</Text>
              </View>
            ))}
            <View className="h-6" />
          </>
        )}

        <Text className="text-gray-500 text-xs mb-3 tracking-wide">DANGER ZONE</Text>
        {mode === "confirmingDelete" ? (
          <View className="bg-[#1c1c1e] rounded-xl px-4 py-4">
            <Text className="text-red-400 text-center mb-4">
              Delete "{habit.name}" and all its history?
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setMode("idle")}
                className="flex-1 bg-[#2c2c2e] rounded-xl py-3 items-center"
              >
                <Text className="text-gray-300">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                className="flex-1 bg-red-950 rounded-xl py-3 items-center"
              >
                <Text className="text-red-500 font-semibold">Delete</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setMode("confirmingDelete")}
            className="bg-[#1c1c1e] rounded-xl py-4 items-center"
          >
            <Text className="text-red-500">Delete habit</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}