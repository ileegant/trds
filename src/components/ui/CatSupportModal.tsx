import { SITE_CONFIG } from "@/lib/constants";
import { Fish } from "lucide-react";
interface CatSupportModalProps {
  isOpen?: boolean;
}

export const CatSupportModal = ({ isOpen = true }: CatSupportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-black border border-neutral-700 p-8 shadow-[10px_10px_0px_0px_#171717] relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-7xl drop-shadow-2xl">
          <img src="/cat.png" alt="Cat Support" className="object-contain" />
        </div>

        <div className="mt-12 space-y-6">
          <div className="space-y-3 mb-8 text-left border-l-2 border-white/20 pl-4 py-1">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
              <span>СИСТЕМА:</span>
              <span className="text-white animate-pulse">ОБРОБЛЯЄ...</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
              <span>ГОЛОД КОТА:</span>
              <span className="text-red-500 font-bold">КРИТИЧНИЙ (99%) ⚠️</span>
            </div>
            <p className="text-xs text-gray-300 mt-2 leading-tight">
              Розробник працює за їжу. Котик теж.
            </p>
          </div>

          <a
            href={SITE_CONFIG?.links?.donate || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-sm relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-2 bg-black text-white border-2 border-white font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:bg-[#111] hover:shadow-[4px_4px_0px_0px_#64748b] hover:border-slate-500 transition-all active:translate-y-1 active:shadow-none rounded-none"
          >
            <Fish className="w-5 h-5 group-hover:text-slate-400 transition-colors" />
            <span>ПОГОДУВАТИ МУРЗІКУ</span>
          </a>
          <p className="text-[10px] text-center text-neutral-600 uppercase">
            MONOBANK БАНКА
          </p>
        </div>
      </div>
    </div>
  );
};
