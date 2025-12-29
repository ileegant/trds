"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toBlob } from "html-to-image";
import Barcode from "react-barcode";
import {
  Share2,
  RefreshCw,
  AtSign,
  Lock,
  Frown,
  Coffee,
  Receipt,
  TriangleAlert,
} from "lucide-react";

// --- КОНСТАНТИ ТА ЛОГІКА (ТВОЯ БАЗА) ---
const DONATE_LINK = "https://send.monobank.ua/jar/3Koj5bwvda";

const BLACKLIST = [
  "russia",
  "putin",
  "moscow",
  "rusnya",
  "brattkka",
  "glosssex",
  "drvlska",
];

const LOADING_PHRASES = [
  "🍜 Заварюю Мівіну (без сосисок)...",
  "💸 Перевіряю баланс картки (там 0)...",
  "💣 Рахую, скільки русні здохло сьогодні...",
  "🔌 Шукаю павербанк, бо світло блимає...",
  "🇺🇦 Вмикаю режим 'Лютий Українець'...",
  "📡 Сканую твій профіль на крінж...",
  "🫡 Майже готово, готуй донат...",
];

const RECEIPT_COLORS = [
  { hex: "#ffffff", name: "Classic White" },
  { hex: "#F4FF5F", name: "Acid Yellow" },
  { hex: "#FF9EAA", name: "Punk Pink" },
  { hex: "#A0E9FF", name: "Electric Blue" },
  { hex: "#C7F9CC", name: "Mint Fresh" },
];

const ARCHETYPES_LIST = [
  "Генерал Диванних Військ 🛋️",
  "Душніла 80 lvl 🤓",
  "Інфлюенсер без аудиторії 🤳",
  "Експерт з усього 🎓",
  "Людина-Зрада 😡",
  "Котик-Вуркотик 😻",
  "Королева драми 🎭",
  "Поліція моралі 👮‍♂️",
  "Адепт кави 3-ї хвилі ☕",
  "Мамин айтішник 💻",
  "Свідок ІПСО 🕵️‍♂️",
  "Психолог з ТікТоку 🧠",
  "Воїн світла і добра ✨",
  "Токсичний колишній 💔",
  "Міський божевільний 🤪",
  "Крипто-мільйонер (в мінусі) 📉",
  "Амбасадор вигорання 🔋",
  "Експерт з геополітики 🌍",
  "Заслужений хейтер 🤬",
  "Інста-шаманка 🔮",
  "Львівський батяр 🎩",
  "Київський сноб 🏙️",
  "Одеситка з характером ⚓",
  "Зумер на пенсії 👴",
  "Людина-мем 😂",
  "Головний по тарілочках 🍽️",
  "Ревізор твоїх сторіз 🧐",
  "Філософ о 3-й ночі 🌙",
  "Колекціонер тривог 🚨",
  "Залежний від новин 📺",
  "Король крінжа 👑",
  "Адепт успішного успіху 🚀",
  "Голос нації 🇺🇦",
  "Професійний потерпілий 🤕",
  "Власник думки, яку ніхто не питав 🗣️",
  "Детектив по лайках 🔍",
  "Архітектор повітряних замків 🏰",
  "Володар чорного поясу з сарказму 🥋",
  "Останній романтик Інтернету 🌹",
  "Генератор випадкових фактів 📚",
  "Той, хто завжди правий ☝️",
  "Людина-оркестр 🎺",
  "Блогер-початківець (10 років) 📹",
  "Експерт з стосунків (розлучений) 💔",
  "Фешн-ікона з секонду 👗",
  "Сомельє з АТБ 🍷",
  "Майстер спорту з прокрастинації 🛌",
  "Гуру продуктивності 📅",
  "Внутрішній емігрант 🧳",
  "Патріот на відстані 🔭",
  "Людина-катастрофа 🌪️",
  "Надто серйозний фейс 🗿",
  "Королева пасивної агресії 💅",
  "Стендапер без жартів 🎤",
  "Таролог 5-го розряду 🃏",
  "Нутриціолог-самоучка 🥦",
  "Свідок плоскої землі 🌎",
  "Людина-вікіпедія 📖",
  "Хранитель чужих секретів 🤫",
  "Головний душніла району 🌬️",
];

const SUPERPOWERS_LIST = [
  "Вміє знайти зраду навіть у ранковій каві з молоком.",
  "Пише треди, які ніхто не дочитує до кінця.",
  "Збирає лайки, як покемонів (але рідкісних немає).",
  "Може образитись на смайлик 🙂.",
  "Генерує контент швидше, ніж думає.",
  "Знає, як краще керувати країною, сидячи на унітазі.",
  "Бачить ІПСО у прогнозі погоди.",
  "Вміє ігнорувати реальність професійно.",
  "Робить скріншоти швидше за світло.",
  "Має чорний пояс з пасивної агресії.",
  "Може посваритися з дзеркалом і програти.",
  "Знає все про всіх, але нічого корисного.",
  "Перетворює будь-яку розмову на суперечку.",
  "Визначає діагнози по аватарці.",
  "Блокує людей швидше, ніж кліпає.",
  "Вміє нити трьома мовами одночасно.",
  "Знаходить помилки в меню ресторанів.",
  "Пам'ятає, хто що лайкнув у 2017 році.",
  "Може написати поему про відключення світла.",
  "Вважає, що Земля крутиться навколо його его.",
  "Створює проблеми там, де їх не було.",
  "Має алергію на чужу думку.",
  "Читає думки (але неправильно).",
  "Професійно вигорає по п'ятницях.",
  "Закохується в аватарки.",
  "Робить висновки космічного масштабу з нічого.",
  "Вміє мовчати так, що всім стає соромно.",
  "Знає рецепт щастя, але нікому не каже.",
  "Перетворює воду на вино (метафорично).",
  "Має суперздатність спати 12 годин і не висипатися.",
  "Відчуває вайб через екран.",
  "Може пояснити квантову фізику на пальцях (неправильно).",
  "Завжди знає, де дешевше, але купує дорого.",
  "Вміє бути онлайн і не відписувати тижнями.",
  "Створює драми на рівному місці.",
  "Має вбудований детектор брехні (зламаний).",
  "П'є каву літрами, щоб відчувати хоч щось.",
  "Завжди має «геніальну» ідею для стартапу.",
  "Вміє зіпсувати настрій одним повідомленням.",
  "Бачить майбутнє, і воно йому не подобається.",
  "Може знайти вихід, але шукає вхід.",
  "Вміє говорити «ні» можливостям.",
  "Має талант спізнюватися на онлайн-зустрічі.",
  "Завжди знає, як краще (ні).",
  "Вміє роздути з мухи слона і осідлати його.",
  "Має диплом з диванної аналітики.",
  "Пише коментарі, за які потім соромно.",
  "Вміє закохати в себе і зникнути.",
  "Знає 100 способів образитись.",
  "Має суперсилу притягувати дивних людей.",
];

const ROASTS_LIST = [
  "Тобі терміново треба вийти на вулицю і поторкати траву.",
  "Видаліть акаунт, поки це не зробив Марк Цукерберг.",
  "Твій вайб — це як піца з ананасами: на любителя.",
  "Менше тексту, більше мемів. Будь ласка.",
  "Ти серйозно це запостив? Я навіть як ШІ в шоці.",
  "Здається, тебе вкусив радіоактивний душніла.",
  "Твій екранний час лякає навіть твій телефон.",
  "Це не блог, це крик про допомогу.",
  "Твої думки глибокі, як калюжа в асфальті.",
  "Іноді краще жувати, ніж постити.",
  "Тобі платять за токсичність, чи це волонтерство?",
  "Твоє его не влазить у цей чек.",
  "Якби нудота була людиною, це був би ти.",
  "Тобі треба не лайки, а обійми.",
  "Знайди роботу, серйозно.",
  "Типу, ти реально так думаєш?",
  "Твої сторіз дивляться тільки вороги.",
  "Вимкни телефон і вийди в реальність.",
  "Твій контент — це найкраще снодійне.",
  "Навіть ChatGPT відмовляється це аналізувати.",
  "Ти занадто складний для цього світу (ні).",
  "Твій гумор застряг у 2012 році.",
  "Перестань бути таким серйозним, це Тредс.",
  "Тобі потрібен детокс від самого себе.",
  "Твої пости — це злочин проти логіки.",
  "Досить грати в експерта, всі знають правду.",
  "Ти пишеш так, ніби тобі платять за знаки.",
  "Твій профіль — це музей нереалізованих амбіцій.",
  "Заспокойся, ніхто не хоче вкрасти твої ідеї.",
  "Тобі треба медаль за занудство.",
  "Твій вайб — 'понеділок ранок'.",
  "Досить репостити крінж.",
  "Ти — причина, чому інопланетяни з нами не говорять.",
  "Твоя самооцінка вища за курс долара.",
  "Це не 'особистий бренд', це просто ниття.",
  "Тобі треба випити води і поспати.",
  "Ти геній, але тільки у своїй голові.",
  "Твій контент сухий, як курка в їдальні.",
  "Зроби паузу, з'їж Твікс (і мовчи).",
  "Ти надто стараєшся сподобатись.",
  "Твої жарти потребують пояснювальної бригади.",
  "Ти — людина-спам.",
  "Твій профіль викликає сонливість.",
  "Досить вдавати, що ти живеш 'краще життя'.",
  "Ти пишеш, а соромно мені.",
  "Тобі терміново потрібен реальний друг.",
  "Твій вайб — 'душний офіс'.",
  "Перестань шукати сенс там, де його немає.",
  "Ти — ходячий червоний прапорець 🚩.",
  "Іди обійми маму.",
];

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
  // State
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

  // Initial Data Fetch
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("API Limit");
        const data = await res.json();
        if (data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
        } else {
          throw new Error("No city data");
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

  // HANDLERS
  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim();
    if (!cleanNick) return showError("А кому ми чек друкувати будемо? Собі?");

    if (BLACKLIST.some((banned) => cleanNick.toLowerCase().includes(banned))) {
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
        new Promise((resolve) => setTimeout(resolve, 3000)), // Трохи пришвидшив для UX
      ]);

      const data = await response.json();
      const postsData = data.posts || [];
      const avatarData = data.avatar || null;

      clearInterval(interval);
      setLoadingStep("Фіналізуємо чек...");

      const aiResult = generateVibe(cleanNick, postsData, avatarData);
      setResult(aiResult);
    } catch (error) {
      console.warn("API Error, generating locally");
      clearInterval(interval);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const aiResult = generateVibe(cleanNick, [], undefined);
      setResult(aiResult);
    } finally {
      setLoading(false);
      setLoadingStep("");
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
        <div className="fixed top-16 left-0 w-full px-4 z-50 animate-bounce pointer-events-auto">
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
      <main className="container mx-auto px-4 py-8 max-w-2xl min-h-screen flex flex-col items-center relative z-10">
        {/* BAN SCREEN */}
        {isBanned && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center w-full h-full px-4 text-center overflow-hidden bg-neutral-950 selection:bg-red-500/30 font-sans">
            {/* 1. ФОНОВІ ЕФЕКТИ (Шум + Глоу) */}
            <div className="fixed top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.15] blur-[100px] bg-red-900 rounded-full pointer-events-none animate-pulse" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 pointer-events-none mix-blend-soft-light"></div>

            {/* 2. БЕЙДЖ ПОМИЛКИ */}
            <div className="mb-6 animate-bounce">
              <span className="inline-flex items-center gap-2 rounded-none border border-red-600/40 bg-red-900/10 px-4 py-1.5 text-xs font-mono text-red-500 backdrop-blur-md uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <TriangleAlert className="w-3.5 h-3.5" />
                <span>System Overload</span>
              </span>
            </div>

            {/* 3. ГОЛОВНИЙ ЗАГОЛОВОК (Глітч-ефект) */}
            <h1 className="relative font-display text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-[0.85] select-none">
              {/* Червоний шар */}
              <span className="absolute top-0 left-0 text-red-600 mix-blend-screen blur-[2px] -translate-x-1 animate-pulse opacity-70">
                ЙДИ
                <br />
                НАХУЙ
              </span>

              {/* Синій шар */}
              <span className="absolute top-0 left-0 text-blue-600 mix-blend-screen blur-[2px] translate-x-1 animate-pulse delay-75 opacity-70">
                ЙДИ
                <br />
                НАХУЙ
              </span>

              {/* Основний текст */}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600 z-10">
                ЙДИ
                <br />
                НАХУЙ
              </span>
            </h1>

            {/* 4. ТОКСИЧНИЙ ОПИС */}
            <h2 className="font-display mt-6 text-xl md:text-3xl font-bold text-red-500 uppercase tracking-widest bg-red-500/5 px-4 py-1">
              ДОСТУП ЗАБЛОКОВАНО
            </h2>

            <div className="mt-6 space-y-4 max-w-lg mx-auto font-mono text-sm md:text-base leading-relaxed text-neutral-400">
              <p>
                Система зафіксувала критичне{" "}
                <span className="text-white font-bold underline decoration-red-500 decoration-wavy">
                  ПЕРЕВИЩЕННЯ ТОННАЖУ
                </span>
                .
              </p>
              <p>
                Наш сервер не гумовий, і твоя широка кістка тут не пролізе. Вхід
                дозволено тільки ельфійкам до{" "}
                <span className="text-red-400 font-bold border border-red-500/30 px-1">
                  70 кг
                </span>
                .
              </p>
              <p className="text-xs text-neutral-600 uppercase tracking-widest mt-4">
                * Йди поприсідай, чи що *
              </p>
            </div>

            {/* 5. КНОПКА (Neo-Brutalism стиль) */}
            <div className="mt-12">
              <button
                onClick={() =>
                  (window.location.href =
                    "https://www.meme-arsenal.com/memes/393326927f757e07d786936ad5d1f35e.jpg")
                }
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-black border-2 border-white font-display font-black uppercase tracking-wider text-lg shadow-[6px_6px_0px_0px_#dc2626] hover:bg-neutral-200 hover:shadow-[3px_3px_0px_0px_#dc2626] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <Frown className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Піти поплакати</span>
              </button>
            </div>

            {/* 6. ФУТЕР */}
            <div className="absolute bottom-6 flex items-center gap-3 text-neutral-800 text-[10px] uppercase tracking-[0.3em] font-mono">
              <Lock className="w-3 h-3" />
              <span>Face Control Failed</span>
              <Lock className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* LOADING MODAL */}
        {loading && (
          <div className="fixed inset-0 z-[9999] bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-black border border-neutral-700 p-8 shadow-[10px_10px_0px_0px_#171717] relative">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl drop-shadow-2xl">
                <img
                  src="/cat.png"
                  alt="Cat"
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="mt-12 space-y-6">
                <div className="space-y-3 mb-8 text-left border-l-2 border-white/20 pl-4 py-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                    <span>СИСТЕМА:</span>
                    <span className="text-white animate-pulse">
                      ОБРОБЛЯЄ...
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                    <span>ГОЛОД КОТА:</span>
                    <span className="text-red-500 font-bold">
                      КРИТИЧНИЙ (99%) ⚠️
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-tight">
                    Розробник працює за їжу. Котик теж.
                  </p>
                </div>

                <a
                  href={DONATE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors border-2 border-transparent"
                >
                  <Coffee className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                  <span>НА КОРМ КОТИКУ</span>
                </a>
                <p className="text-[10px] text-center text-neutral-600 uppercase">
                  MONOBANK БАНКА
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN UI --- */}
        {!result ? (
          /* INPUT MODE */
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center justify-center p-3 bg-neutral-900 border border-neutral-800 rounded-full">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>

            <h1 className="font-display text-4xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
              Чек твого{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-white">
                Тредсу
              </span>
            </h1>

            <p className="text-neutral-500 text-sm md:text-lg mb-12 max-w-md font-mono">
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
                  onChange={(e) => setUsername(e.target.value)}
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
                  className="w-full p-6 shadow-2xl relative text-black transition-colors duration-500 ease-in-out"
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
                  <div className="text-center border-b-2 border-dashed border-black/20 pb-4 mb-4">
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
                      📍 {userLocation}
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
                  <div className="space-y-3 mb-6 text-sm uppercase font-bold">
                    <div className="flex justify-between items-start gap-2">
                      <span>АРХЕТИП:</span>
                      <span className="text-right leading-tight text-[#6b21a8] break-words">
                        {result.archetype}
                      </span>
                    </div>
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
                  <div className="mb-6">
                    <p className="text-xs font-bold mb-1 text-gray-700">
                      ВЕРДИКТ:
                    </p>
                    <p className="text-sm bg-black text-white p-2 inline-block -rotate-1 font-sans leading-tight shadow-md">
                      {result.roast}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="flex flex-col items-center justify-center space-y-2 overflow-hidden pb-2">
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
                    <p className="text-xs font-bold uppercase mt-3 text-gray-600">
                      Товар поверненню не підлягає
                    </p>
                    <p className="text-[10px] text-gray-400">
                      generated by trds.fun
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
                href={DONATE_LINK}
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
