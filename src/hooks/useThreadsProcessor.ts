import { useState } from "react";
import { BLACKLIST } from "@/lib/constants";

interface UseThreadsProcessorProps {
  showError: (msg: string) => void;
  setIsBanned?: (state: boolean) => void;
}

export const useThreadsProcessor = ({
  showError,
  setIsBanned,
}: UseThreadsProcessorProps) => {
  const [loading, setLoading] = useState(false);

  const processUser = async (
    username: string,
    onSuccess: (data: any, cleanNick: string) => Promise<void> | void
  ) => {
    const cleanNick = username.replace("@", "").trim().toLowerCase();

    if (!cleanNick) return showError("А кому ми чек друкувати будемо? Собі?");

    if (BLACKLIST.some((banned) => cleanNick.includes(banned))) {
      if (setIsBanned) setIsBanned(true);
      return;
    }

    setLoading(true);

    try {
      const fetchPromise = fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanNick }),
      });

      const [response] = await Promise.all([
        fetchPromise,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Помилка API");
        return;
      }

      await onSuccess(data, cleanNick);
    } catch (err) {
      showError("Критична помилка сервера.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, processUser };
};
