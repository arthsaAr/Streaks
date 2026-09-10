import { Stack } from "expo-router";
import { HabitsProvider } from "../context/HabitsContext";
import "../global.css";

export default function RootLayout() {
  return (
    <HabitsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HabitsProvider>
  );
}