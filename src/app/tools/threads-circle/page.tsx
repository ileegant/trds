"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import ThreadsCanvasGenerator from "@/components/ui/ThreadsCanvasGenerator";
import { CatSupportModal } from "@/components/ui/CatSupportModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { analyzeUserNetwork } from "@/lib/threads-analysis";
import { BLACKLIST } from "@/lib/constants";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { SearchMode } from "@/components/tools/SearchMode";

export default function ThreadsCirclePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const { error, showError } = useErrorMessage();
  // Data State
  const [owner, setOwner] = useState<any>(null);
  const [tier1, setTier1] = useState<any[]>([]);
  const [tier2, setTier2] = useState<any[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // --- MAIN HANDLER ---
  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim().toLowerCase();

    if (!cleanNick) {
      return showError("Введи нікнейм, екстрасенси у відпустці.");
    }

    if (BLACKLIST.some((banned) => cleanNick.includes(banned))) {
      setIsBanned(true);
      return;
    }

    setLoading(true);
    setOwner(null);
    setTier1([]);
    setTier2([]);
    setDataReady(false);

    try {
      // 1. Робимо запит на НАШ API (який ми створили на попередньому кроці)
      const responsePromise = fetch("/api/get-threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanNick }),
      });

      const [response] = await Promise.all([
        responsePromise,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      const data = await response.json();

      if (!response.ok) {
        // Обробка помилок від сервера
        if (data.error === "USER_NOT_FOUND")
          throw new Error("Користувача не знайдено.");
        if (data.error === "PRIVATE_PROFILE")
          throw new Error("Профіль закритий. Я не бачу пости.");
        if (data.error === "NO_REPLIES")
          throw new Error("У профілі немає активності (реплаїв).");
        throw new Error(data.error || "Помилка сервера");
      }

      const postsData = data.posts || [];
      const repliesData = data.replies || [];

      const result = await analyzeUserNetwork(postsData, repliesData);

      // 2. Якщо все ок, сервер вже повернув структуровані дані
      // { owner, tier1, tier2 } з готовими Base64 картинками
      setOwner(result.owner);
      setTier1(result.topConnections);
      setTier2(result.otherConnections);

      setDataReady(true);
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Щось пішло не так. Спробуй ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-green-500/30 overflow-x-hidden font-mono">
      {error && <ErrorAlert message={error} />}
      {loading && <CatSupportModal />}

      <main className="container mx-auto py-12 max-w-3xl min-h-screen flex flex-col items-center relative z-10 px-4">
        {isBanned && <BannedOverlay />}

        {!dataReady ? (
          <SearchMode
            username={username}
            setUsername={setUsername}
            onGenerate={handleGenerate}
            icon={<Users className="w-full h-full" />}
            title={
              <>
                Твоє Тредс{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-600">
                  Оточення
                </span>
              </>
            }
            description={
              <>
                [SYSTEM]: Scanning social bubble protocol... <br />
                Введи нікнейм, щоб згенерувати карту взаємодій.
              </>
            }
            buttonText="ЗАПУСТИТИ АНАЛІЗ"
          />
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full flex justify-center pb-20">
              {owner && (
                <ThreadsCanvasGenerator
                  owner={owner}
                  tier1={tier1}
                  tier2={tier2}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
