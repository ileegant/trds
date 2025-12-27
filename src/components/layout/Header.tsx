import Link from "next/link";

export function Header() {
  const DEVELOPER_NAME = "ileegant";

  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-[#0a0a0a] text-white flex items-center justify-between px-4 md:px-6 z-50 shadow-md select-none border-b border-white/5">
      <Link
        href="/"
        className="font-bold tracking-widest text-m md:text-xl truncate mr-2 flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
        title="На головну"
      >
        TRDS
      </Link>

      <nav className="hidden md:flex gap-6 text-xs font-mono text-gray-500">
        <Link href="/stats" className="hover:text-white transition-colors">
          STATS
        </Link>
        <Link href="/memes" className="hover:text-white transition-colors">
          MEMES
        </Link>
      </nav>

      <a
        href={`https://www.threads.net/@${DEVELOPER_NAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] opacity-70 whitespace-nowrap font-mono text-gray-400 hover:text-white hover:opacity-100 transition-all cursor-pointer underline decoration-transparent hover:decoration-white underline-offset-2"
      >
        powered by {DEVELOPER_NAME}
      </a>
    </header>
  );
}
