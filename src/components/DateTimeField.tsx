import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Platform, Pressable, Text } from "react-native";
import { formatDateTime } from "../lib/time";

export function DateTimeField({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const openPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        mode: "date",
        onChange: (event, selectedDate) => {
          if (event.type !== "set" || !selectedDate) return;
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: "time",
            onChange: (event2, selectedTime) => {
              if (event2.type !== "set" || !selectedTime) return;
              const combined = new Date(selectedDate);
              combined.setHours(selectedTime.getHours(), selectedTime.getMinutes());
              onChange(combined);
            },
          });
        },
      });
    }
    // iOS: could render an inline <DateTimePicker mode="datetime" display="inline" />
    // skipping for now since target platform is Android
  };

  return (
    <Pressable
      onPress={openPicker}
      className="border border-[#2c2c2e] rounded-xl px-4 py-3 flex-row justify-between items-center"
    >
      <Text className="text-amber-500">{formatDateTime(value)}</Text>
      <Text className="text-gray-500">📅</Text>
    </Pressable>
  );
}