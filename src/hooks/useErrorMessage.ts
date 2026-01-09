import { useState, useRef, useCallback, useEffect } from "react";

export const useErrorMessage = (defaultDuration = 3000) => {
  const [error, setError] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showError = useCallback((msg: string, duration?: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setError(msg);

    timerRef.current = setTimeout(() => {
      setError("");
    }, duration || defaultDuration);
  }, [defaultDuration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { error, showError, setError };
};