import { useSyncExternalStore } from "react";

// One shared one-second clock for countdowns. During server rendering and hydration it returns
// null, so components render the server-computed values first and switch to live time afterwards
// without a hydration mismatch.
const listeners = new Set<() => void>();
let currentTime = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    currentTime = Date.now();
    timer = setInterval(() => {
      currentTime = Date.now();
      listeners.forEach((notify) => notify());
    }, 1000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => currentTime,
    () => null,
  );
}
