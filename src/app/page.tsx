import Link from "next/link";
import { ArrowRight, CreditCard, BarChart3, Wand2, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center overflow-hidden">
      {/* 1. Верхній бейдж (Тепер помаранчевий вогник) */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs md:text-sm font-medium text-neutral-300 backdrop-blur-xl hover:bg-white/10 hover:text-white transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="tracking-wide">v1.0 Beta</span>
        </span>
      </div>

      {/* 2. ГОЛОВНИЙ ЗАГОЛОВОК */}
      <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-8 max-w-6xl leading-[1.05]">
        Твій Threads <br />
        {/* 👇 НОВА ПАЛІТРА: Помаранчевий градієнт (Вогонь) */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-white animate-gradient-x pb-2">
          на максимум
        </span>
      </h1>

      {/* 3. Опис */}
      <p className="text-m md:text-xl text-neutral-400 mb-12 max-w-2xl leading-relaxed">
        Генератор мемів, глибока аналітика та інструменти для створення
        вірусного контенту.
      </p>

      {/* 4. КНОПКИ EXPLORE (Neo-Brutalism Style) */}
      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-20">
        {/* 👇 Кнопка 1 (Основна): Біла з помаранчевою жорсткою тінню */}
        <Link
          href="/stats"
          className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black border-2 border-white font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#ea580c] hover:bg-gray-100 transition-all active:translate-y-1 active:shadow-none rounded-none"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Аналіз профілю</span>
        </Link>

        {/* 👇 Кнопка 2 (Другорядна): Чорна з білою жорсткою тінню */}
        <Link
          href="/memes"
          className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-black text-white border-2 border-white font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:bg-[#111] hover:shadow-[4px_4px_0px_0px_#ea580c] hover:border-orange-500 transition-all active:translate-y-1 active:shadow-none rounded-none"
        >
          {/* Іконка стає помаранчевою при наведенні */}
          <Wand2 className="w-5 h-5 group-hover:text-orange-500 transition-colors" />
          <span>Створити мем</span>
        </Link>
      </div>

      {/* 5. БЛОК MONOBANK (Neo-Brutalism Style) */}
      <div className="flex flex-col items-center gap-6 mt-12">
        {/* Розділювач */}
        <div className="flex items-center gap-4 opacity-50">
          <div className="h-[2px] w-12 bg-white" />
          <span className="text-orange-500 text-xs font-mono uppercase tracking-widest">
            Donation Area
          </span>
          <div className="h-[2px] w-12 bg-white" />
        </div>

        {/* Мемний заклик */}
        <p className="text-neutral-400 text-sm max-w-md font-mono">
          <span className="text-orange-500 font-bold">⚠️ Увага:</span> Цей код
          працює на каві та ненависті до русні.
          <br />
          Підтримай розробника, щоб фікси виходили частіше!
        </p>

        {/* Кнопка Банки */}
        <a
          href="https://send.monobank.ua/jar/TVOYA_BANKA" // 👈 ТУТ ЛІНК
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full sm:w-auto flex items-center justify-center gap-4 px-8 py-4 bg-[#111] text-white border-2 border-white hover:border-orange-500 hover:text-orange-500 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_0px_#ea580c] active:translate-y-1 active:shadow-none rounded-none"
        >
          {/* Іконка картки */}
          <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />

          <div className="text-left leading-none">
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 group-hover:text-orange-400">
              Monobank Jar
            </p>
            <p className="font-bold uppercase tracking-wider text-sm">
              Закинути на каву ☕️
            </p>
          </div>

          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </a>

        {/* Дрібний підпис */}
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
          100% донатів йдуть на розвиток TRDS 🇺🇦
        </p>
      </div>

      {/* 👇 Фонові ефекти (Помаранчевий туман) */}
      <div className="fixed top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] blur-[120px] bg-orange-600 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 h-[400px] w-full opacity-[0.05] bg-gradient-to-t from-orange-900 to-transparent pointer-events-none" />
    </div>
  );
}
