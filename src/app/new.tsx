import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { DateTimeField } from "../components/DateTimeField";
import { useHabits } from "../context/HabitsContext";

export default function NewHabit() {
  const { addHabit } = useHabits();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [customStart, setCustomStart] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const canSubmit = name.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const ts = customStart ? startDate.getTime() : Date.now();
    await addHabit(name.trim(), note.trim(), ts);
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
        <Text className="text-white text-xl font-bold">New habit</Text>
      </View>

      <Text className="text-gray-500 text-xs mb-2 tracking-wide">HABIT NAME</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. No caffeine"
        placeholderTextColor="#555"
        className="border border-amber-500/60 rounded-xl px-4 py-3 text-white mb-6"
      />

      <Text className="text-gray-500 text-xs mb-2 tracking-wide">NOTE — OPTIONAL</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="A short reminder to yourself"
        placeholderTextColor="#555"
        className="border border-[#2c2c2e] rounded-xl px-4 py-3 text-white mb-6"
      />

      <View className="bg-[#1c1c1e] rounded-xl px-4 py-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-white">Custom start time</Text>
            <Text className="text-gray-500 text-xs mt-1">Already started this streak?</Text>
          </View>
          <Switch
            value={customStart}
            onValueChange={setCustomStart}
            trackColor={{ false: "#3a3a3c", true: "#F5A623" }}
            thumbColor="#ffffff"
          />
        </View>

        {customStart && (
          <View className="mt-4">
            <DateTimeField value={startDate} onChange={setStartDate} />
          </View>
        )}
      </View>

      <View className="flex-1" />

      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        className={`rounded-xl py-4 items-center mb-10 ${canSubmit ? "bg-amber-500" : "bg-[#1c1c1e]"}`}
      >
        <Text className={canSubmit ? "text-black font-semibold" : "text-gray-600"}>
          Start tracking
        </Text>
      </Pressable>
    </View>
  );
}