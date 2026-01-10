import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { SupportUsers } from "../ui/SupportUsers";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-8 md:h-10 bg-[#0a0a0a] text-white flex items-center justify-between px-4 md:px-6 z-50 shadow-md select-none border-b border-white/5">
      <Link
        href="/"
        className="font-display font-bold tracking-widest text-xl md:text-2xl truncate mr-2 flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
        title="На головну"
      >
        TRDS
        <div className="flex flex-col h-3 w-4.5 rounded-[2px] overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity -mt-0.5 ml-0.5 shadow-sm">
          <div className="flex-1 bg-[#215bbf]" />
          <div className="flex-1 bg-[#fbd500]" />
        </div>
      </Link>

      <a
        href={`https://www.threads.net/@${SITE_CONFIG.developer.handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-[10px] opacity-70 whitespace-nowrap font-mono text-gray-400 hover:text-white hover:opacity-100 transition-all cursor-pointer underline decoration-transparent hover:decoration-white underline-offset-2"
      >
        powered by {SITE_CONFIG.developer.handle}
      </a>
    </header>
  );
}
