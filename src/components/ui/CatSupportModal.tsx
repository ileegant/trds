import { SITE_CONFIG } from "@/lib/constants";

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
            className="font-display text-sm group flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors border-2 border-transparent"
          >
            <span>НА ПАШТЕТ МУРЗІКУ</span>
          </a>
          <p className="font-display text-[10px] text-center text-neutral-600 uppercase">
            MONOBANK БАНКА
          </p>
        </div>
      </div>
    </div>
  );
};
