import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { TAG_STYLES } from "@/lib/constants"; // Перевірте шлях до ваших констант

// Описуємо, як виглядає об'єкт тула
interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tag?: string | null;
}

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col h-full bg-black border border-neutral-800 p-4 transition-all duration-300
                 hover:-translate-y-1 hover:border-slate-500 hover:shadow-[8px_8px_0px_0px_#64748b]"
    >
      <div className="flex justify-between items-start mb-4">
        {/* Іконка */}
        <div className="p-2 bg-neutral-900 border border-neutral-800 group-hover:bg-white group-hover:text-black transition-colors duration-300">
          <tool.icon className="w-6 h-6" />
        </div>

        {/* Тег (якщо є) */}
        {tool.tag && TAG_STYLES[tool.tag] && (
          <span
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${TAG_STYLES[tool.tag]}`}
          >
            {tool.tag}
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h3 className="font-bold uppercase tracking-wide mb-1 group-hover:text-slate-300 transition-colors">
        {tool.title}
      </h3>

      {/* Опис */}
      <p className="text-[10px] text-neutral-500 font-mono leading-relaxed mb-6 flex-grow">
        {tool.description}
      </p>

      {/* Футер картки */}
      <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-white mt-auto">
        <span className="group-hover:underline decoration-2 underline-offset-4 decoration-slate-500">
          Запустити модуль
        </span>
        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>

      {/* Декоративний кутик */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
};