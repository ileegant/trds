import Link from "next/link";
import { ArrowUpRight, Bomb, Fingerprint } from "lucide-react";

// Масив інструментів (щоб легко додавати нові)
const tools = [
  // {
  //   id: "roast",
  //   title: "Жорстка прожарка",
  //   description:
  //     "AI знищить твоє его за 3 секунди. Тільки для тих, у кого сталеві нерви.",
  //   icon: Flame,
  //   href: "/tools/roast",
  //   tag: "HOT",
  //   tagColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  // },
  // {
  //   id: "stats",
  //   title: "Глибока аналітика",
  //   description:
  //     "Розбір польотів: хто лайкає, хто ігнорить, і чому твої охоплення впали.",
  //   icon: BarChart3,
  //   href: "/tools/stats",
  //   tag: "STABLE",
  //   tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  // },
  // {
  //   id: "memes",
  //   title: "Мем-генератор",
  //   description:
  //     "Перетвори свої нудні пости на мемний контент. Автоматична підстановка тексту.",
  //   icon: Sparkles,
  //   href: "/tools/memes",
  //   tag: "AI V2",
  //   tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  // },
  // {
  //   id: "ghosts",
  //   title: "Детектор привидів",
  //   description:
  //     "Знайти тих, хто підписався, але ніколи не лайкає. Час для чистки.",
  //   icon: Ghost,
  //   href: "/tools/ghosts",
  //   tag: null,
  // },
  {
    id: "vibe",
    title: "Vibe Check",
    description:
      "Який колір твоєї аури в Threads? Токсичний зелений чи депресивний сірий?",
    icon: Fingerprint,
    href: "/vibe-check",
    tag: "NEW",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  // {
  //   id: "reply",
  //   title: "Auto-Reply Bot",
  //   description:
  //     "Генерує дотепні відповіді хейтерам, щоб ти не витрачав свій час.",
  //   icon: Bot,
  //   href: "/tools/reply",
  //   tag: "BETA",
  //   tagColor: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  // },
];

export default function BrowsePage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-slate-500/30 overflow-x-hidden">
      {/* --- Фонові ефекти (Nardo Mist) --- */}
      <div className="fixed top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.04] blur-[100px] bg-slate-500 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] opacity-[0.03] blur-[120px] bg-slate-700 pointer-events-none" />

      <main className="container mx-auto px-4 py-20 max-w-7xl">
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            Обери свій <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-slate-200 to-white">
              інструмент
            </span>
          </h1>

          <p className="text-neutral-500 text-xs md:text-lg max-w-2xl font-mono leading-relaxed">
            Кожен модуль — це окремий скрипт для прокачки твого профілю. Обирай
            з розумом, використовуй з обережністю.
          </p>
        </div>

        {/* 2. GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col h-full bg-black border border-neutral-800 p-8 transition-all duration-300
                         hover:-translate-y-1 hover:border-slate-500 hover:shadow-[8px_8px_0px_0px_#64748b]"
            >
              {/* Верхня частина картки */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-neutral-900 border border-neutral-800 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <tool.icon className="w-6 h-6" />
                </div>

                {/* Бейджик (якщо є) */}
                {tool.tag && (
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${tool.tagColor}`}
                  >
                    {tool.tag}
                  </span>
                )}
              </div>

              {/* Тексти */}
              <h3 className="text-xl font-bold uppercase tracking-wide mb-3 group-hover:text-slate-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-neutral-500 font-mono leading-relaxed mb-8 flex-grow">
                {tool.description}
              </p>

              {/* Кнопка всередині картки */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white mt-auto">
                <span className="group-hover:underline decoration-2 underline-offset-4 decoration-slate-500">
                  Запустити модуль
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>

              {/* Декоративний кутик */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          {/* Картка-заглушка "Coming Soon" */}
          <div className="relative flex flex-col items-center justify-center h-full min-h-[250px] border border-dashed border-neutral-800 bg-transparent p-8 opacity-50 cursor-not-allowed">
            <Bomb className="w-8 h-8 text-neutral-700 mb-4" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-600">
              Секретний Модуль
            </span>
            <span className="text-xs text-neutral-700 mt-1">Скоро Буде...</span>
          </div>
        </div>

        {/* 3. FOOTER INFO */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-neutral-900 pt-8 text-neutral-600 text-xs font-mono uppercase tracking-wider">
          <span>
            System Status: <span className="text-emerald-500">Operational</span>
          </span>
          <span className="mt-2 md:mt-0">v1.0 Beta / Build 2024</span>
        </div>
      </main>
    </div>
  );
}
