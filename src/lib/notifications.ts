import * as Notifications from "expo-notifications";
import { Habit } from "./types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

const MILESTONE_DAYS = [1, 3, 7, 14, 30, 60, 90];

export async function cancelMilestoneNotifications(habitId: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter((n) => n.identifier.startsWith(`${habitId}-`));
  await Promise.all(
    toCancel.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

export async function scheduleMilestoneNotifications(habit: Habit) {
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
      trigger: { date: triggerDate } as Notifications.DateTriggerInput,
    });
  }
}