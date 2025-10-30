import { useEffect, useRef, useState } from 'react';

/**
 * Throttles a value so it only updates at most once per specified delay
 * @param value - The value to throttle
 * @param delay - Minimum time in milliseconds between updates
 * @returns The throttled value
 */
export const useThrottledValue = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= delay) {
      // Enough time has passed, update immediately
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      // Schedule an update for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, delay - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
};
