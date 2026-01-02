import Link from "next/link";
import { ArrowUpRight, Bomb } from "lucide-react";
import { TOOLS, TAG_STYLES } from "@/lib/constants";

export default function BrowsePage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-slate-500/30 overflow-x-hidden">
      <main className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-14">
          <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            Обери спосіб<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-slate-200 to-white">
              приниження
            </span>
          </h1>

          <p className="text-neutral-500 text-[10px] md:text-lg max-w-2xl font-mono leading-relaxed">
            Думаєш, твої треди комусь цікаві? Досить жити в ілюзіях. Обирай
            генератор, вводь нік і готуйся плакати. Ми розберемо твій профіль на
            атоми і тикнемо носом у твій крінж. Жодної жалості, тільки сухі
            факти про твою нікчемну медійність.
          </p>
        </div>

        {/* 2. GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col h-full bg-black border border-neutral-800 p-4 transition-all duration-300
                         hover:-translate-y-1 hover:border-slate-500 hover:shadow-[8px_8px_0px_0px_#64748b]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-900 border border-neutral-800 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <tool.icon className="w-6 h-6" />
                </div>

                {tool.tag && (
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${TAG_STYLES[tool.tag]}`}
                  >
                    {tool.tag}
                  </span>
                )}
              </div>

              <h3 className="font-bold uppercase tracking-wide mb-1 group-hover:text-slate-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono leading-relaxed mb-6 flex-grow">
                {tool.description}
              </p>

              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-white mt-auto">
                <span className="group-hover:underline decoration-2 underline-offset-4 decoration-slate-500">
                  Запустити модуль
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>

              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          <div className="relative flex flex-col items-center justify-center h-full min-h-[250px] border border-dashed border-neutral-800 bg-transparent p-4 opacity-50 cursor-not-allowed">
            <Bomb className="w-8 h-8 text-neutral-700 mb-4" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-600">
              Секретний Модуль
            </span>
            <span className="text-xs text-neutral-700 mt-1">Скоро Буде...</span>
          </div>
        </div>
      </main>
    </div>
  );
}
