import { TriangleAlert, Frown, Lock } from "lucide-react"; // Не забудь імпорти

export default function BannedOverlay() {
  return (
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
  );
}
