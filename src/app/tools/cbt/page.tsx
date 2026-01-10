"use client";

import { BLACKLIST } from "@/lib/constants";
import { SUPERPOWERS_LIST } from "@/data/content";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { useState, useRef } from "react";
import {
  Siren,
  Fingerprint,
  FileWarning,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { CatSupportModal } from "@/components/ui/CatSupportModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import {
  THREATS,
  CBT_STATUSES,
  postRoasts,
  THREADS_ARCHETYPES,
} from "@/data/content";
import { cleanThreadsPost } from "@/lib/cleaners";
import { useSmartShare } from "@/hooks/useSmartShare";
import { useUserLocation } from "@/hooks/useUserLocation";
import { ActionButtons } from "@/components/tools/ActionButtons";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { SearchMode } from "@/components/tools/SearchMode";

interface CBTStats {
  threatLevel: string; // Замість toxicity
  threatScore: number;
  status: string; // Замість ego
  location: string;
}

interface EvidenceItem {
  id: number;
  text: string;
  date: string;
  note: string;
}

interface CBTResult {
  nickname: string;
  archetype: string; // "Вердикт"
  superpower: string; // "Стаття звинувачення"
  stats: CBTStats;
  roast: string; // "Вирок"
  avatar?: string;
  evidence: EvidenceItem[];
}

const generateCBT = (
  username: string,
  posts: string[],
  avatar?: string,
  location?: string
): CBTResult => {
  const textSeed = posts.length > 0 ? posts.join("").length : username.length;
  const nameSeed = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = nameSeed + textSeed;

  // Генеруємо "Докази" з постів (або фейкові, якщо постів мало)
  const evidenceList: EvidenceItem[] = posts.slice(0, 3).map((post, i) => ({
    id: i,
    text: post.length > 100 ? post.substring(0, 100) + "..." : post,
    date: new Date(Date.now() - i * 86400000 * (seed % 5)).toLocaleDateString(),
    note: ["ПІДОЗРІЛО", "ЗРАДА", "КРІНЖ", "ІПСО"][seed % 4],
  }));

  // Якщо постів немає, додаємо заглушку
  if (evidenceList.length === 0) {
    evidenceList.push({
      id: 99,
      text: "Активність прихована. Підозрюваний використовує VPN або режим інкогніто.",
      date: "СЬОГОДНІ",
      note: "НЕВІДОМО",
    });
  }

  const threatScores = Object.keys(THREATS).map(Number); // [5, 20, 40, 60, 80, 95, 100]
  const score = threatScores[seed % threatScores.length]; // Беремо конкретне число зі списку
  const label = THREATS[score as keyof typeof THREATS]; // Беремо відповідний текст

  return {
    nickname: username,
    archetype: THREADS_ARCHETYPES[seed % THREADS_ARCHETYPES.length], // Використовуємо як головний "Типаж"
    superpower: SUPERPOWERS_LIST[seed % SUPERPOWERS_LIST.length], // Використовуємо як "Особливу прикмету"
    stats: {
      threatLevel: label,
      threatScore: score,
      status: CBT_STATUSES[seed % CBT_STATUSES.length],
      location: location || "Невідома локація",
    },
    roast: postRoasts[seed % postRoasts.length], // Вирок
    avatar: avatar,
    evidence: evidenceList,
  };
};

export default function CBTPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CBTResult | null>(null);
  const [isBanned, setIsBanned] = useState(false);

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
      const responsePromise = await fetch("/api/threads", {
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

      const result = generateCBT(
        cleanNick,
        cleanThreadsPost(data.posts) || [],
        data.user?.avatar || null,
        userLocation
      );
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
    filePrefix: "cbt",
    shareData: {
      title: "Досʼє ан мене.",
      text: `Нова база Тредчана в СБТ 📂🕵️\nПеревір себе: https://trds.fun/tools/cbt`,
    },
  });

  const generateCaseID = (name: string) => {
    if (!name) return "X-000";

    const clean = name.replace(/@/g, "").toUpperCase(); // Прибираємо @, робимо капсом
    const first = clean.charAt(0); // Перша буква
    const last = clean.charAt(clean.length - 1); // Остання буква

    // Рахуємо суму ASCII кодів букв (щоб "alex" і "axel" мали різні, але схожі коди)
    // Додаємо множник (i + 1), щоб порядок букв мав значення
    const uniqueCode = clean
      .split("")
      .reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);

    return `${new Date().getFullYear()} / ${first}-${last} / ${uniqueCode}`;
  };

  // --- RENDER ---
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-red-900/30 overflow-x-hidden font-mono flex flex-col items-center">
      {/* Глобальна помилка */}
      {error && <ErrorAlert message={error} />}

      <main className="container mx-auto py-8 max-w-4xl min-h-screen flex flex-col items-center relative z-10">
        {loading && <CatSupportModal />}
        {isBanned && <BannedOverlay />}

        {!result ? (
          <SearchMode
            username={username}
            setUsername={(val) => setUsername(val.toLowerCase())}
            onGenerate={handleGenerate}
            icon={<Siren className="w-full h-full" />}
            title={
              <>
                ОПЕРАТИВНИЙ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-slate-400 to-white">
                  РОЗШУК ФІГУРАНТА
                </span>
              </>
            }
            description="Введіть позивний (нікнейм) об'єкта для перевірки по базах даних та виявлення ознак деструктивної діяльності."
            buttonText="ЗАПИТ ДО АРХІВУ"
            placeholder="ПОЗИВНИЙ"
          />
        ) : (
          /* ================= RESULT MODE (DOSSIER STYLE) ================= */
          <div className="w-full flex flex-col items-center animate-slide-up">
            {/* --- MAIN DOSSIER (REF FOR SCREENSHOT) --- */}
            <div
              className="relative w-full max-w-4xl perspective-1000 mb-8"
              ref={receiptRef}
            >
              <div className="bg-neutral-900 border border-white/10 relative overflow-hidden">
                {/* Folder Header */}
                <div className="bg-white/5 border-b border-white/10 p-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-neutral-800 p-2 rounded-sm border border-white/10">
                      <Siren className="w-4 h-4 md:w-6 md:h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-[8px] text-neutral-500 uppercase tracking-widest">
                        Номер провадження
                      </p>
                      <h2 className="text-sm font-display font-bold text-white tracking-tight">
                        СПРАВА № {generateCaseID(username)}
                      </h2>
                    </div>
                  </div>
                  <div className="font-mono text-[8px] md:text-[10px] text-neutral-400 text-right uppercase flex flex-row md:flex-col justify-end items-center md:items-end gap-2 md:gap-0">
                    <p className="whitespace-nowrap">
                      Дата: {new Date().toLocaleDateString()}
                    </p>

                    <p className="whitespace-nowrap truncate max-w-[150px] md:max-w-none">
                      Локація: {result.stats.location}
                    </p>
                  </div>
                </div>

                <div className="p-2 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {/* --- ЛІВА КОЛОНКА (Аватар + Інфо) --- */}
                  {/* Мобільний: flex-row (в рядок), Десктоп: flex-col (в стовпчик) */}
                  <div className="md:col-span-1 flex flex-row md:flex-col gap-4 md:gap-6 items-start md:items-stretch">
                    {/* БЛОК ФОТО */}
                    {/* Мобільний: ширина 1/3, Десктоп: повна ширина */}
                    <div className="relative w-1/3 md:w-full aspect-square bg-neutral-800 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden shrink-0 group">
                      {/* 1. Спроба показати аватар */}
                      {result.avatar ? (
                        <img
                          src={result.avatar}
                          alt="Suspect"
                          className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 z-0"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            // Якщо помилка завантаження: ховаємо картинку, показуємо заглушку
                            e.currentTarget.style.display = "none";
                            // Знаходимо наступний елемент (заглушку) і показуємо його
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.classList.remove("hidden");
                          }}
                        />
                      ) : null}

                      {/* 3. Декор (Цензура та відбиток) */}
                      <div className="absolute w-full h-4 md:h-5 bg-black/80 flex items-center justify-center z-10">
                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/50 font-mono">
                          Censored
                        </span>
                      </div>
                      <Fingerprint className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 text-white/20 z-20" />

                      {/* Ефект шуму */}
                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none z-10"></div>
                    </div>

                    {/* БЛОК ІНФО */}
                    {/* flex-1 займає весь простір праворуч від фото на телефоні */}
                    <div className="flex-1 space-y-2 md:space-y-4 font-mono text-sm pt-1 md:pt-0">
                      {/* Нікнейм */}
                      <div>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider">
                          Фігурант
                        </p>
                        <div className="relative">
                          <p className="text-white text-xs md:text-lg font-bold bg-white/5 px-2 py-1 border-l-2 border-emerald-500 break-all leading-tight z-10 relative">
                            @{result.nickname}
                          </p>
                        </div>
                      </div>

                      {/* Статус */}
                      <div>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider">
                          Статус
                        </p>
                        <p className="text-yellow-500 font-bold text-[10px] md:text-sm leading-tight">
                          {result.stats.status}
                        </p>
                      </div>

                      {/* Рівень загрози */}
                      <div>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider">
                          Рівень загрози
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-600 via-red-500 to-red-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                              style={{ width: `${result.stats.threatScore}%` }}
                            />
                          </div>
                          <span className="text-red-500 font-bold text-[10px] md:text-xs whitespace-nowrap bg-red-500/10 px-1 rounded">
                            {result.stats.threatLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- ПРАВА КОЛОНКА (Докази + Вирок) --- */}
                  {/* На телефоні йде знизу, на десктопі справа */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    {/* Список доказів */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-white/40 border-b border-white/10 pb-1">
                        <Eye className="w-4 h-4" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">
                          Матеріали (Останні ВИСЕРИ)
                        </h3>
                      </div>
                      {result.evidence.map((item) => (
                        <div
                          key={item.id}
                          className="bg-neutral-950 p-1 border border-neutral-800 hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] text-neutral-500 font-mono">
                              {item.date}
                            </span>
                            <FileWarning className="w-3 h-3 text-neutral-600" />
                          </div>
                          <p className="text-neutral-300 italic text-[10px] mb-1 leading-relaxed">
                            "{item.text}"
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Блок Вироку */}
                    <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-2 relative overflow-hidden mt-auto shadow-inner">
                      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <AlertTriangle className="w-20 h-20" />
                      </div>
                      <h3 className="text-neutral-400 text-[8px] font-bold uppercase tracking-widest mb-2">
                        Офіційний висновок на базі матеріалів.
                      </h3>
                      <h2 className="text-xs md:text-2xl font-black text-white mb-2 uppercase leading-none relative z-10">
                        {result.archetype}
                      </h2>
                      <p className="text-[10px] text-neutral-400 font-mono border-l-2 border-red-500 pl-2 italic relative z-10">
                        {result.roast}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dossier Footer */}
                <div className="bg-neutral-950/50 p-1 border-t border-white/10 flex justify-between items-center">
                  <p className="text-[8px] text-neutral-600 font-mono">
                    АВТОМАТИЧНА ГЕНЕРАЦІЯ. TRDS.FUN
                  </p>
                  <div className="text-[8px] text-neutral-600 font-mono">
                    СЛІДЧИЙ: ileegant
                  </div>
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <ActionButtons handleShare={handleShare} isSharing={isSharing} />
          </div>
        )}
      </main>

      {/* Фонові ефекти (Global) */}
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] opacity-[0.05] blur-[100px] bg-red-900 rounded-full pointer-events-none" />
    </div>
  );
}
