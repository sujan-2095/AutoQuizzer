import { useState, useEffect, useRef, useCallback } from 'react';

export const useQuizStopwatch = (isActive: boolean) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      setSeconds(0);
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  return seconds;
};

export const useQuizCountdown = (
  initialSeconds: number | null,
  onExpire?: () => void
) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        }
        clearInterval(timerId);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = useCallback((secs: number | null): string => {
    if (secs === null) return '';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  }, []);

  return { timeLeft, formatTime };
};
