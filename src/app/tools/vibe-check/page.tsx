"use client";

import { BLACKLIST, RECEIPT_COLORS } from "@/lib/constants";
import { ARCHETYPES_LIST, SUPERPOWERS_LIST, ROASTS_LIST } from "@/data/content";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { useState, useRef } from "react";
import Barcode from "react-barcode";
import { Receipt } from "lucide-react";
import { CatSupportModal } from "@/components/ui/CatSupportModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useSmartShare } from "@/hooks/useSmartShare";
import { useUserLocation } from "@/hooks/useUserLocation";
import { ActionButtons } from "@/components/tools/ActionButtons";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { SearchMode } from "@/components/tools/SearchMode";

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
  const [result, setResult] = useState<VibeResult | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [receiptBg, setReceiptBg] = useState(RECEIPT_COLORS[0].hex);
  const { error, showError } = useErrorMessage();

  const userLocation = useUserLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim().toLowerCase();

    if (!cleanNick) return showError("А кому ми чек друкувати будемо? Собі?");

    if (BLACKLIST.some((banned) => cleanNick.includes(banned))) {
      setIsBanned(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const responsePromise = fetch("/api/threads", {
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
        setLoading(false);
        return showError(data.error);
      }

      const postsData = data.posts || [];
      const avatarData = data.user?.avatar || null;

      const result = generateVibe(cleanNick, postsData, avatarData);
      setResult(result);
    } catch (error) {
      setLoading(false);
      showError("Критична помилка сервера.");
    } finally {
      setLoading(false);
    }
  };

  const { handleShare, isSharing } = useSmartShare({
    ref: receiptRef,
    username: username,
    filePrefix: "vibe-check",
    shareData: {
      title: "Threads Vibe Check",
      text: "Заціни мій вайб-чек у Threads 🧾✨\nЗробити собі: https://trds.fun/tools/vibe-check\nХочеш очистити карму? Скинь коту на елітну рибу!🐟👹",
    },
  });

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-slate-500/30 overflow-x-hidden font-mono">
      {error && <ErrorAlert message={error} />}

      <main className="container mx-auto py-8 max-w-2xl min-h-screen flex flex-col items-center relative z-10">
        {isBanned && <BannedOverlay />}
        {loading && <CatSupportModal />}

        {!result ? (
          <SearchMode
            username={username}
            setUsername={(val) => setUsername(val.toLowerCase())}
            onGenerate={handleGenerate}
            icon={<Receipt className="w-full h-full" />}
            title={
              <>
                Чек твого{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-white">
                  Тредсу
                </span>
              </>
            }
            description={
              <>
                Аналізуємо рівень токсичності, его, душності, ниття та успішного
                успіху.
                <br />
                Ваша мама каже, що ви класний, а ми скажемо правду.
              </>
            }
            buttonText="Роздрукувати чек"
          />
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
            <div className="relative w-full max-w-[380px] perspective-1000 mb-6">
              <div
                ref={receiptRef}
                className="w-full bg-black flex justify-center p-1"
              >
                <div
                  className="w-full px-4 py-4 relative text-black"
                  style={{ backgroundColor: receiptBg }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-4 -mt-2"
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
                      generated by trds.fun
                    </p>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 w-full h-4 -mb-2"
                    style={{
                      backgroundImage: `radial-gradient(circle, transparent 50%, ${receiptBg} 50%)`,
                      backgroundSize: "16px 16px",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <ActionButtons handleShare={handleShare} isSharing={isSharing} />
          </div>
        )}
      </main>
    </div>
  );
}
