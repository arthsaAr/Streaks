import { router } from "expo-router";
import { FlatList, Pressable, Share, Text, View } from "react-native";
import { HabitCard } from "../components/HabitCard";
import { OverallRankCard } from "../components/OverallRankCard";
import { useHabits } from "../context/HabitsContext";

export default function Index() {
  const { habits, loading } = useHabits();

  const handleExport = async () => {
    try {
      await Share.share({
        message: JSON.stringify(habits, null, 2),
        title: "Streaks backup",
      });
    } catch (e) {
      console.error("Export failed", e);
    }
  };

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
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-gray-500">
          {habits.length} habit{habits.length === 1 ? "" : "s"} tracked
        </Text>
        {habits.length > 0 && (
          <Pressable onPress={handleExport}>
            <Text className="text-gray-500 text-xs underline">Export data</Text>
          </Pressable>
        )}
      </View>

      {!loading && habits.length === 0 && (
        <View className="mt-16 items-center">
          <Text className="text-gray-400 text-base mb-2">No habits yet</Text>
          <Text className="text-gray-600 text-sm text-center px-8">
            Tap + to start your first streak — track anything you're building or letting go of.
          </Text>
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        ListHeaderComponent={habits.length > 0 ? <OverallRankCard habits={habits} /> : null}
        renderItem={({ item }) => <HabitCard habit={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}