import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useHabits } from "../../context/HabitsContext";

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, updateHabit } = useHabits();
  const habit = getHabit(id as string);

  const [name, setName] = useState(habit?.name ?? "");
  const [note, setNote] = useState(habit?.note ?? "");

  if (!habit) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <Text className="text-gray-500">Habit not found</Text>
      </View>
    );
  }

  const canSubmit = name.trim().length > 0;

  const handleSave = async () => {
    if (!canSubmit) return;
    await updateHabit(habit.id, name.trim(), note.trim());
    router.back();
  };

  return (
    <View className="flex-1 bg-[#121212] px-5 pt-16">
      <View className="flex-row items-center mb-8">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#1c1c1e] items-center justify-center mr-3"
        >
          <Text className="text-white text-lg">‹</Text>
        </Pressable>
        <Text className="text-white text-xl font-bold">Edit habit</Text>
      </View>

      <Text className="text-gray-500 text-xs mb-2 tracking-wide">HABIT NAME</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholderTextColor="#555"
        className="border border-amber-500/60 rounded-xl px-4 py-3 text-white mb-6"
      />

      <Text className="text-gray-500 text-xs mb-2 tracking-wide">NOTE — OPTIONAL</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholderTextColor="#555"
        className="border border-[#2c2c2e] rounded-xl px-4 py-3 text-white mb-6"
      />

      <View className="flex-1" />

      <Pressable
        onPress={handleSave}
        disabled={!canSubmit}
        className={`rounded-xl py-4 items-center mb-10 ${canSubmit ? "bg-amber-500" : "bg-[#1c1c1e]"}`}
      >
        <Text className={canSubmit ? "text-black font-semibold" : "text-gray-600"}>
          Save changes
        </Text>
      </Pressable>
    </View>
  );
}