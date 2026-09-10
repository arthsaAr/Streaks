import { useEffect, useState } from "react";
import { getElapsed } from "./time";

export function useElapsed(startTimestamp: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return getElapsed(startTimestamp, now);
}