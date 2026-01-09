import { ArrowRight, CreditCard, BarChart3, Wand2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center overflow-hidden bg-neutral-950">
      <div className="mb-8 mt-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs md:text-sm font-medium text-neutral-400 backdrop-blur-xl hover:bg-white/10 hover:text-white transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">v1.3 Beta</span>
        </span>
      </div>

      <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-6 max-w-6xl leading-[1.05]">
        Твій Threads <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-slate-300 to-white animate-gradient-x pb-2">
          роздає базу
        </span>
      </h1>

      <p className="text-xs md:text-xl text-neutral-500 mb-8 max-w-2xl leading-relaxed">
        Кидай нік — отримуй діагноз. Дізнайся, який в тебе реально вайб: ти
        база, крінж чи головний душніла стрічки. Жодної нудної статистики,
        тільки чистий фан і факти.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:w-auto my-8">
        <Button href="/stats">
          <BarChart3 className="w-5 h-5 text-slate-800" />
          <span>Аналіз профілю</span>
        </Button>

        <Button variant="secondary" href="/tools">
          <Wand2 className="w-5 h-5 group-hover:text-slate-400 transition-colors" />
          <span>Згенерувати</span>
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6 mt-6">
        <div className="flex items-center gap-4 opacity-30">
          <div className="h-[1px] w-12 bg-white" />
          <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">
            ЗОНА ПІДТРИМКИ
          </span>
          <div className="h-[1px] w-12 bg-white" />
        </div>

        <p className="text-neutral-500 text-xs md:text-sm max-w-lg font-mono">
          <span className="text-slate-300 font-bold">⚠️ Увага:</span> Цей код
          працює на ненависті до русні.
          <br />
          Підтримай розробника, щоб фікси виходили частіше!
        </p>

        <a
          href={SITE_CONFIG.links.donate}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full sm:w-auto flex items-center justify-center gap-4 px-8 py-4 bg-[#0a0a0a] text-neutral-300 border border-neutral-800 hover:border-slate-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] hover:shadow-[4px_4px_0px_0px_#64748b] active:translate-y-1 active:shadow-none rounded-none"
        >
          <CreditCard className="w-5 h-5 group-hover:rotate-12 group-hover:text-slate-400 transition-all" />

          <div className="text-left leading-none">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 group-hover:text-slate-400">
              Monobank Jar
            </p>
            <p className="font-bold uppercase tracking-wider text-sm">
              Закинути на каву ☕️
            </p>
          </div>

          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
        </a>

        <p className="text-[10px] text-neutral-700 font-mono uppercase tracking-widest">
          55% донатів йдуть на корм Мурзіку
          <br />
          30% донатів йдуть на ЗСУ
          <br />
          15% донатів йдуть на каву
        </p>
      </div>
    </div>
  );
}
