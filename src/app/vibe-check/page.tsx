"use client";

import { SITE_CONFIG, BLACKLIST, RECEIPT_COLORS } from "@/lib/constants";
import {
  LOADING_PHRASES,
  ARCHETYPES_LIST,
  SUPERPOWERS_LIST,
  ROASTS_LIST,
} from "@/lib/content";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { useState, useRef, useCallback, useEffect } from "react";
import { toBlob } from "html-to-image";
import Barcode from "react-barcode";
import {
  Share2,
  RefreshCw,
  AtSign,
  Coffee,
  Receipt,
  TriangleAlert,
} from "lucide-react";
import { CatSupportModal } from "@/components/ui/CatSupportModal";

interface VibeStats {
  toxicity: number;
  ego: number;
  boringness: number;
}

interface VibeResult {
  archetype: string;
  superpower: string;
  stats: VibeStats;
  roast: string;
  avatar?: string;
}

const generateVibe = (
  username: string,
  posts: string[],
  avatar?: string
): VibeResult => {
  const textSeed = posts.length > 0 ? posts.join("").length : username.length;
  const nameSeed = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = nameSeed + textSeed;

  return {
    archetype: ARCHETYPES_LIST[seed % ARCHETYPES_LIST.length],
    superpower: SUPERPOWERS_LIST[seed % SUPERPOWERS_LIST.length],
    stats: {
      toxicity: (seed * 13) % 100,
      ego: (seed * 7) % 100,
      boringness: (seed * 23) % 100,
    },
    roast: ROASTS_LIST[seed % ROASTS_LIST.length],
    avatar: avatar,
  };
};

export default function VibeCheckPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [_, setLoadingStep] = useState("");
  const [result, setResult] = useState<VibeResult | null>(null);
  const [userLocation, setUserLocation] = useState("Локація визначається...");
  const [errorMsg, setErrorMsg] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [receiptBg, setReceiptBg] = useState(RECEIPT_COLORS[0].hex);

  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // localityLanguage=uk змушує віддавати назви українською
        const res = await fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=uk"
        );
        const data = await res.json();

        // У них структура трохи інша: city / locality
        const city = data.city || data.locality || "";
        const country = data.countryName || "";

        if (city && country) {
          setUserLocation(`${city}, ${country}`);
        }
      } catch (e) {
        setUserLocation("Україна (Інтернет)");
      }
    };
    fetchLocation();
  }, []);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim().toLowerCase();
    if (!cleanNick) return showError("А кому ми чек друкувати будемо? Собі?");

    if (BLACKLIST.some((banned) => cleanNick.includes(banned))) {
      setIsBanned(true);
      return;
    }

    setLoading(true);
    setResult(null);

    let stepIndex = 0;
    setLoadingStep(LOADING_PHRASES[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < LOADING_PHRASES.length) {
        setLoadingStep(LOADING_PHRASES[stepIndex]);
      }
    }, 800);

    try {
      const responsePromise = fetch("/api/get-threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanNick }),
      });

      const [response] = await Promise.all([
        responsePromise,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      if (!response.ok) {
        clearInterval(interval);
        setLoading(false);
        setLoadingStep("");

        let message = "";

        switch (response.status) {
          case 404:
            message = "Це твій уявний друг? Threads про нього не чув.";
            break;
          case 403:
            message = "Ого, які ми загадкові. Профіль закритий, кіна не буде.";
            break;
          case 422:
            message = "Це акаунт для сталкінгу колишніх? Де пости, алло?";
            break;
          case 500:
          default:
            message = "Щось Threads тупить. Спробуй пізніше.";
            break;
        }

        showError(message);
        return;
      }

      const data = await response.json();

      const postsData = data.posts || [];
      const avatarData = data.user?.avatar || null;

      clearInterval(interval);
      setLoadingStep("Фіналізуємо чек...");

      const aiResult = generateVibe(cleanNick, postsData, avatarData);
      setResult(aiResult);
    } catch (error) {
      console.warn("Global Error (Network etc)", error);
      clearInterval(interval);

      setLoading(false);
      showError("Немає з'єднання з сервером 😢");
    } finally {
      if (!result) setLoading(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setUsername("");
    setReceiptBg(RECEIPT_COLORS[0].hex);
  };

  const handleShare = useCallback(async () => {
    if (!receiptRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const blob = await toBlob(receiptRef.current, {
        cacheBust: true,
        backgroundColor: "transparent",
        skipFonts: true,
        filter: (node) => node.tagName !== "LINK",
        style: { padding: "20px" },
        pixelRatio: 2,
      });

      if (!blob) throw new Error("Не вдалося створити файл");

      const file = new File([blob], `vibe-${username.replace("@", "")}.png`, {
        type: "image/png",
      });

      const shareData = {
        title: "Threads Vibe Check",
        text: `Заціни мій вайб-чек у Threads 🧾✨\nЗробити собі: https://trds.fun/vibe-check`,
        files: [file],
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        const link = document.createElement("a");
        link.download = `vibe-${username.replace("@", "")}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        showError("Не вдалося поділитись 😢");
      }
    } finally {
      setIsSaving(false);
    }
  }, [receiptRef, username, isSaving]);

  // --- RENDER ---
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-slate-500/30 overflow-x-hidden font-mono">
      {/* 🔥 ГЛОБАЛЬНИЙ БЛОК ПОМИЛКИ (ВСТАВЛЕНО ТУТ) */}
      {errorMsg && (
        <div className="fixed top-16 left-0 max-w-200 w-full px-4 z-50 animate-bounce pointer-events-auto">
          <div className="w-full flex items-center justify-center gap-2 bg-[#ff4b4b] text-white py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
            {/* Іконка */}
            <TriangleAlert className="w-5 h-5 stroke-[2]" />

            {/* Текст */}
            <span className="font-mono font-bold uppercase tracking-tight text-xs md:text-sm leading-tight drop-shadow-sm text-center">
              {errorMsg}
            </span>
          </div>
        </div>
      )}

      {/* 3. Контент */}
      <main className="container mx-auto py-8 max-w-2xl min-h-screen flex flex-col items-center relative z-10">
        {isBanned && <BannedOverlay />}
        {loading && <CatSupportModal />}

        {!result ? (
          /* INPUT MODE */
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center justify-center p-3 bg-neutral-900 border border-neutral-800 rounded-full">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>

            <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
              Чек твого{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-white">
                Тредсу
              </span>
            </h1>

            <p className="text-neutral-500 text-sm mb-12 max-w-md font-mono">
              Аналізуємо рівень токсичності, его, душності, ниття та успішного
              успіху.
              <br />
              Ваша мама каже, що ви класний, а ми скажемо правду.
            </p>

            <div className="w-full max-w-sm space-y-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors">
                  <AtSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-slate-500 transition-all text-lg font-bold uppercase font-mono shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] focus:shadow-[4px_4px_0px_0px_#64748b]"
                  placeholder="USERNAME"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="font-display w-full py-4 bg-white text-black border-2 border-white font-bold uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_#64748b] hover:bg-neutral-200 hover:shadow-[2px_2px_0px_0px_#64748b] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Роздрукувати чек
              </button>
            </div>
          </div>
        ) : (
          /* RESULT MODE */
          <div className="flex flex-col items-center animate-slide-up">
            {/* Controls (Colors) */}
            <div className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">
              Вибери тему:
            </div>
            <div className="flex gap-4 mb-8">
              {RECEIPT_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setReceiptBg(color.hex)}
                  className={`w-8 h-8 border-2 transition-all duration-200 hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ${
                    receiptBg === color.hex
                      ? "border-white scale-110"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            {/* --- RECEIPT AREA --- */}
            <div className="relative w-full max-w-[380px] perspective-1000 mb-8">
              <div
                ref={receiptRef}
                className="w-full bg-transparent flex justify-center p-1"
              >
                <div
                  className="w-full px-4 py-4 shadow-2xl relative text-black transition-colors duration-500 ease-in-out"
                  style={{ backgroundColor: receiptBg }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-4 -mt-2 rotate-180 transition-all duration-500 ease-in-out"
                    style={{
                      backgroundImage: `radial-gradient(circle, transparent 50%, ${receiptBg} 50%)`,
                      backgroundSize: "16px 16px",
                    }}
                  ></div>

                  {/* HEADER */}
                  <div className="text-center border-b-2 border-dashed border-black/20 pb-2 mb-2">
                    {result.avatar ? (
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full border-1 border-black overflow-hidden bg-white relative z-10">
                        <img
                          src={result.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center text-4xl border-2 border-black rounded-full bg-white/50">
                        👤
                      </div>
                    )}

                    <p className="text-xs text-gray-700 mt-1 font-semibold">
                      {userLocation}
                    </p>
                    <p className="text-xs text-gray-700">
                      {new Date().toLocaleDateString("uk-UA")} •{" "}
                      {new Date().toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm font-bold mt-2 break-all">
                      Клієнт: @{username.replace("@", "")}
                    </p>
                  </div>

                  {/* STATS */}
                  <div className="space-y-3 mb-2 text-sm uppercase font-bold">
                    <div className="flex justify-between items-start gap-2">
                      <span>АРХЕТИП:</span>
                      <span className="text-right leading-tight text-[#6b21a8] break-words">
                        {result.archetype}
                      </span>
                    </div>
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span>ТОКСИЧНІСТЬ</span>
                        <span>₴{result.stats.toxicity}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>РІВЕНЬ ЕГО</span>
                        <span>₴{result.stats.ego}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ДУШНІСТЬ</span>
                        <span>₴{result.stats.boringness}.50</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-b-2 border-dashed border-black/20 mb-4"></div>

                  {/* DETAILS */}
                  <div className="mb-4">
                    <p className="text-xs font-bold mb-1 text-gray-700">
                      СУПЕРСИЛА:
                    </p>
                    <p className="text-sm leading-tight lowercase first-letter:uppercase font-medium">
                      "{result.superpower}"
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold mb-1 text-gray-700">
                      ВЕРДИКТ:
                    </p>
                    <p className="text-sm bg-black text-white p-2 inline-block -rotate-1 font-sans leading-tight shadow-md">
                      {result.roast}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="flex flex-col items-center justify-center overflow-hidden">
                    <div className="scale-y-125 opacity-90 mix-blend-multiply">
                      <Barcode
                        value={`CHECK${new Date().getFullYear()}${
                          result.stats.toxicity
                        }`}
                        width={1.5}
                        height={40}
                        format="CODE128"
                        displayValue={false}
                        background="transparent"
                        lineColor="#000000"
                      />
                    </div>
                    <p className="text-xs font-bold uppercase text-gray-600">
                      Товар поверненню не підлягає
                    </p>
                    <p className="text-[10px] text-gray-400 mt-3">
                      generated by {SITE_CONFIG.url}
                    </p>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 w-full h-4 -mb-2 transition-all duration-500"
                    style={{
                      backgroundImage: `radial-gradient(circle, transparent 50%, ${receiptBg} 50%)`,
                      backgroundSize: "16px 16px",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-[380px] grid grid-cols-2 gap-4">
              <button
                onClick={handleShare}
                disabled={isSaving}
                className="col-span-2 group relative flex items-center justify-center gap-3 w-full py-4 bg-white text-black border-2 border-white font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_#64748b] hover:bg-neutral-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#64748b] transition-all"
              >
                {isSaving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                <span>{isSaving ? "Saving..." : "Share Receipt"}</span>
              </button>

              <button
                onClick={resetApp}
                className="flex items-center justify-center gap-2 py-3 bg-black text-neutral-400 border border-neutral-800 hover:text-white hover:border-white transition-all uppercase text-xs font-bold tracking-widest"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <a
                href={SITE_CONFIG.links.donate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-black text-neutral-400 border border-neutral-800 hover:text-white hover:border-white transition-all uppercase text-xs font-bold tracking-widest"
              >
                <Coffee className="w-4 h-4" />
                <span>Donate</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
