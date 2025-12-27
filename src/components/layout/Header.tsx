import Link from "next/link";
import { Github, BarChart3, Smile, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity"
        >
          <span className="bg-black text-white px-2 py-0.5 rounded-md">
            TRDS
          </span>
        </Link>

        {/* Навігація (ховається на мобільних) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            href="/stats"
            className="flex items-center gap-2 hover:text-black transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Статистика
          </Link>
          <Link
            href="/memes"
            className="flex items-center gap-2 hover:text-black transition-colors"
          >
            <Smile className="w-4 h-4" />
            Мемогенератор
          </Link>
        </nav>

        {/* Кнопки праворуч */}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/TVІЙ_НІКНЕЙМ/trds" // Заміни на свій лінк
            target="_blank"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </Link>

          {/* Мобільна кнопка меню (поки що просто іконка) */}
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
