import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { HabitCard } from "../components/HabitCard";
import { useHabits } from "../context/HabitsContext";

export default function Index() {
  const { habits, loading } = useHabits();

  return (
    <View className="flex-1 bg-[#121212] px-5 pt-16">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white text-3xl font-bold">Streaks</Text>
        <Pressable
          onPress={() => router.push("/new")}
          className="w-11 h-11 rounded-full bg-amber-500 items-center justify-center"
        >
          <Text className="text-black text-2xl leading-none">+</Text>
        </Pressable>
      </View>
      <Text className="text-gray-500 mb-6">
        {habits.length} habit{habits.length === 1 ? "" : "s"} tracked
      </Text>

      {!loading && habits.length === 0 && (
        <Text className="text-gray-500 mt-10 text-center">No habits yet. Tap + to add one.</Text>
      )}

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        renderItem={({ item }) => <HabitCard habit={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}