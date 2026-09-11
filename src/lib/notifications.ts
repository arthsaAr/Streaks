import { Habit } from "./types";

let Notifications: typeof import("expo-notifications") | null = null;

try {
  Notifications = require("expo-notifications");
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn("Notifications unavailable in this environment:", e);
}

export async function requestNotificationPermission() {
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.warn("Failed to request notification permission", e);
    return false;
  }
}

const MILESTONE_DAYS = [1, 3, 7, 14, 30, 60, 90];

export async function cancelMilestoneNotifications(habitId: string) {
  if (!Notifications) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter((n) => n.identifier.startsWith(`${habitId}-`));
    await Promise.all(
      toCancel.map((n) => Notifications!.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (e) {
    console.warn("Failed to cancel notifications", e);
  }
}

export async function scheduleMilestoneNotifications(habit: Habit) {
  if (!Notifications) return;
  try {
    await cancelMilestoneNotifications(habit.id);
    for (const days of MILESTONE_DAYS) {
      const triggerDate = new Date(habit.startTimestamp + days * 86400000);
      if (triggerDate.getTime() <= Date.now()) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: `${habit.id}-${days}`,
        content: {
          title: `${days} day${days === 1 ? "" : "s"} streak! 🔥`,
          body: `You've kept up "${habit.name}" for ${days} day${days === 1 ? "" : "s"}. Keep going.`,
        },
        trigger: { date: triggerDate } as any,
      });
    }
  } catch (e) {
    console.warn("Failed to schedule notifications", e);
  }
}