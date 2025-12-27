import Link from "next/link";
import { Github, AtSign } from "lucide-react"; // AtSign схожий на лого Threads, або використаємо SVG нижче

export function Footer() {
  return (
    // 👇 Зменшив padding (py-6 замість py-12) для компактності
    <footer className="w-full bg-black text-white border-t-2 border-white py-6 px-4 md:px-8 relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative z-10">
        {/* 1. ЛІВА ЧАСТИНА: Лого + Копірайт */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-unbounded-logo text-xl font-bold tracking-widest uppercase hover:text-orange-500 transition-colors"
          >
            TRDS
          </Link>
          <span className="text-neutral-600 text-xs font-mono hidden sm:inline-block">
            |
          </span>
          <div className="text-xs text-neutral-500 font-mono whitespace-nowrap">
            © {new Date().getFullYear()} Made in Ukraine 🇺🇦
          </div>
        </div>

        {/* 2. ЦЕНТР: Навігація (тепер в рядок) */}
        <nav className="flex items-center gap-6">
          <Link
            href="/stats"
            className="text-xs font-bold uppercase tracking-wider hover:text-orange-500 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Аналіз
          </Link>
          <Link
            href="/memes"
            className="text-xs font-bold uppercase tracking-wider hover:text-orange-500 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Меми
          </Link>
          <Link
            href="/about"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 cursor-not-allowed"
          >
            Про нас
          </Link>
        </nav>

        {/* 3. ПРАВА ЧАСТИНА: Соціалки (Github + Threads) */}
        <div className="flex gap-3">
          {/* GitHub */}
          <a
            href="https://github.com/ileegant"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white text-black border border-white hover:bg-orange-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
            title="GitHub Code"
          >
            <Github size={18} />
          </a>

          {/* Threads (Офіційна SVG іконка) */}
          <a
            href="https://www.threads.net/@ileegant" // 👈 Твій Threads
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white text-black border border-white hover:bg-black hover:text-white hover:border-orange-500 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[2px_2px_0px_0px_#f97316] hover:translate-x-[1px] hover:translate-y-[1px]"
            title="Threads Profile"
          >
            {/* SVG лого Threads */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.75 13C17.75 16.5 15.5 18 12 18C10.05 18 8.05 16.95 8.05 13.95C8.05 11.2 9.5 9 12 9C13.45 9 14.2 9.7 14.45 10.95H16.25C15.9 8.35 14.15 7.4 12 7.4C8.45 7.4 6.2 10.25 6.2 14C6.2 18.25 9.15 19.65 12 19.65C14.65 19.65 16.6 18.3 17.5 16.15V19.5H19.25V12.75C19.25 8.3 16.35 4.5 12 4.5C7.25 4.5 3.5 8.1 3.5 12.75C3.5 17.4 7.25 21 12 21H16V22.5H12C6.4 22.5 2 18.1 2 12.75C2 7.4 6.4 3 12 3C17.3 3 21 6.8 21 12.75V13H17.75ZM12 10.6C10.7 10.6 9.8 11.75 9.8 13.95C9.8 15.75 10.6 16.4 12 16.4C13.4 16.4 14.25 15.15 14.25 13.25C14.25 11.65 13.55 10.6 12 10.6Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
