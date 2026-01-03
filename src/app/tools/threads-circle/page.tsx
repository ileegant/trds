"use client";

import { useState } from "react";
import { AtSign, Users, RefreshCw } from "lucide-react";
import ThreadsCanvasGenerator from "@/components/ui/ThreadsCanvasGenerator";
import { CatSupportModal } from "@/components/ui/CatSupportModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { processThreadsContext } from "@/lib/threads-processor";
import { BLACKLIST, WHITELIST } from "@/lib/constants";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { WhiteListOverlay } from "@/components/ui/WhiteListOverlay";

export default function ThreadsCirclePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [isInWhitelist, setIsInWhitelist] = useState(true);

  // Data State
  const [owner, setOwner] = useState<any>(null);
  const [tier1, setTier1] = useState<any[]>([]);
  const [tier2, setTier2] = useState<any[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // --- HELPERS ---
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const resetState = () => {
    setDataReady(false);
    setOwner(null);
    setTier1([]);
    setTier2([]);
    setUsername("");
  };

  // --- MAIN HANDLER ---
  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim();
    
    if (!cleanNick) {
      return showError("Введи нікнейм, екстрасенси у відпустці.");
    }

    if (BLACKLIST.some((banned) => cleanNick.includes(banned))) {
      setIsBanned(true);
      return;
    }

    if (!WHITELIST.some((whitelist) => cleanNick.includes(whitelist))) {
      setIsInWhitelist(false);
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
        if (data.error === "USER_NOT_FOUND") throw new Error("Користувача не знайдено.");
        if (data.error === "PRIVATE_PROFILE") throw new Error("Профіль закритий. Я не бачу пости.");
        if (data.error === "NO_REPLIES") throw new Error("У профілі немає активності (реплаїв).");
        throw new Error(data.error || "Помилка сервера");
      }

      const postsData = data.posts || [];
      const repliesData = data.replies || [];

      const result = await processThreadsContext(postsData, repliesData);

      // 2. Якщо все ок, сервер вже повернув структуровані дані
      // { owner, tier1, tier2 } з готовими Base64 картинками
      setOwner(result.owner);
      setTier1(result.tier1);
      setTier2(result.tier2);

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
      {/* --- ERROR TOAST --- */}
      {errorMsg && <ErrorAlert message={errorMsg} />}

      {/* --- LOADING MODAL (Показуємо котів, поки сервер думає і вантажить картинки) --- */}
      {loading && <CatSupportModal />}

      <main className="container mx-auto py-12 max-w-3xl min-h-screen flex flex-col items-center relative z-10 px-4">
        {isBanned && <BannedOverlay />}
        {!isInWhitelist && <WhiteListOverlay />}
        
        {!dataReady ? (
          /* --- INPUT MODE --- */
          <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 inline-flex items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-full shadow-2xl">
              <Users className="w-10 h-10 text-green-400" />
            </div>

            <h1 className="font-black text-4xl md:text-7xl uppercase tracking-tighter text-white mb-6 leading-none">
              Твоє Тредс{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Оточення
              </span>
            </h1>

            <p className="text-neutral-400 text-[10px] md:text-sm mb-12 max-w-lg font-mono uppercase tracking-wider leading-relaxed">
              [SYSTEM]: Scanning social bubble protocol... <br />
              Введи нікнейм, щоб згенерувати карту взаємодій.
            </p>

            <div className="w-full max-w-md space-y-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-green-400 transition-colors">
                  <AtSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-neutral-800 text-white placeholder-neutral-700 focus:outline-none focus:border-green-500 transition-all text-lg font-bold uppercase font-mono shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] focus:shadow-[4px_4px_0px_0px_#22c55e]"
                  placeholder="USERNAME"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !username.trim()}
                className="w-full py-4 bg-white text-black border-2 border-white font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_#22c55e] hover:bg-green-400 hover:border-green-400 hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>ЗАПУСТИТИ АНАЛІЗ</span>
              </button>
            </div>
          </div>
        ) : (
          /* --- RESULT MODE --- */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
             
             {/* Кнопка "Спробувати ще" */}
             <div className="w-full flex justify-end mb-4">
                <button 
                  onClick={resetState}
                  className="flex items-center gap-2 text-xs text-neutral-500 hover:text-green-400 transition-colors uppercase tracking-widest"
                >
                  <RefreshCw className="w-4 h-4" />
                  Новий пошук
                </button>
             </div>

            {/* 5. CANVAS GENERATOR */}
            <div className="w-full flex justify-center pb-20">
              {/* Передаємо дані в генератор. Вони вже готові до вживання. */}
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