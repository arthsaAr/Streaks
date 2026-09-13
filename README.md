# Streaks

A minimal, no-clutter habit and streak tracker for Android. Track how long you've stuck with (or stayed away from) anything — built as a multi-habit alternative to single-purpose streak timers.

![Platform](https://img.shields.io/badge/platform-Android-3DDC84)
![Expo](https://img.shields.io/badge/built%20with-Expo-000020)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Multiple habits, one app** — track as many streaks as you want (quitting something, building a routine, anything time-based)
- **Accurate even when your phone is off** — no live background timer running down your battery. Each habit just stores a start timestamp; elapsed time is calculated on demand, so it's always correct regardless of reboots, force-closes, or airplane mode
- **Milestone notifications** — get notified at 1, 3, 7, 14, 30, 60, and 90 days
- **Tier / ranking system** — each habit progresses through named tiers (Starting Out → Legend) based on days elapsed, plus an overall standing across all your habits
- **Reset with history** — resetting a streak archives it to a "past streaks" log instead of just wiping it
- **Custom start time** — already started before installing the app? Backdate the start time instead of losing progress
- **Edit habits** — update name/note anytime
- **Export data** — back up all your habits as JSON via the native share sheet
- **Fully local & private** — no account, no backend, no data leaves your device

## Tech Stack

- [Expo](https://expo.dev) / React Native
- [Expo Router](https://docs.expo.dev/router/introduction/) — file-based navigation
- [NativeWind](https://www.nativewind.dev/) — Tailwind CSS for React Native
- `@react-native-async-storage/async-storage` — local persistence
- `expo-notifications` — local milestone notifications
- `@react-native-community/datetimepicker` — custom start time selection
- TypeScript

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx          # Root layout, wraps app in HabitsProvider
│   ├── index.tsx             # Home screen — habit list + overall ranking
│   ├── new.tsx                # Add new habit
│   └── habit/
│       ├── [id].tsx            # Habit detail — timer, actions, past streaks
│       └── edit.tsx             # Edit habit name/note
├── components/
│   ├── HabitCard.tsx          # Habit list card
│   ├── OverallRankCard.tsx     # Overall standing summary
│   └── DateTimeField.tsx       # Date/time picker input
├── context/
│   └── HabitsContext.tsx      # All habit state + storage logic
├── lib/
│   ├── types.ts                # Habit / PastStreak types
│   ├── storage.ts              # AsyncStorage read/write
│   ├── time.ts                 # Elapsed time math + formatting
│   ├── useElapsed.ts           # Live-updating elapsed time hook
│   ├── levels.ts                # Tier/ranking logic
│   └── notifications.ts         # Milestone notification scheduling
└── global.css                  # Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- [Expo Go](https://expo.dev/go) app on your Android device, for local development
- An [Expo account](https://expo.dev/signup) (free) if you plan to build with EAS

### Installation

```bash
git clone https://github.com/<your-username>/streaks.git
cd streaks
npm install
```

### Run locally

```bash
npx expo start -c
```

Scan the QR code with the Expo Go app on your Android device.

## How the timer works

Instead of running a live countdown/countup process in the background (which Android would kill and which would drain battery), each habit stores a single `startTimestamp`. Elapsed time is simply:

```ts
elapsed = Date.now() - startTimestamp
```

recalculated every time the app is opened or the screen re-renders. This makes tracking perfectly accurate across reboots, force-closes, and even days without opening the app — with zero background battery cost.

## Building for production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

See [Expo's Android deployment docs](https://docs.expo.dev/deploy/build-project/) for the full submission flow to Google Play.

## Roadmap

- [ ] Home screen widget
- [ ] Dedicated stats screen (longest streak, average, total resets)
- [ ] Light theme toggle
- [ ] iOS support

## Contributing

Issues and pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
