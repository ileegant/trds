import Link from "next/link";
import { MoveLeft, Skull, Ban } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] w-full px-4 text-center overflow-hidden bg-neutral-950 selection:bg-red-500/30">
      {/* 1. Фон (Темний вайб) */}
      <div className="fixed top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] blur-[80px] bg-slate-600 rounded-full pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 pointer-events-none mix-blend-soft-light"></div>

      <div className="mb-8 animate-pulse">
        <span className="inline-flex items-center gap-2 rounded-none border border-red-500/20 bg-red-500/5 px-3 py-1 text-xs font-mono text-red-400 backdrop-blur-md uppercase tracking-widest">
          <Ban className="w-3 h-3" />
          <span>Critical Fuckup</span>
        </span>
      </div>

      <h1 className="relative font-display text-8xl md:text-[12rem] font-black tracking-tighter mb-0 leading-[0.8] select-none select-none motion-safe:animate-pulse">
        <span className="absolute top-0 left-0 text-red-600 mix-blend-screen blur-[1px] -translate-x-2 opacity-80">
          404
        </span>

        <span className="absolute top-0 left-0 text-cyan-600 mix-blend-screen blur-[1px] translate-x-2 opacity-80">
          404
        </span>

        <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-700 z-10">
          404
        </span>
      </h1>

      <h2 className="font-display mt-8 text-lg md:text-2xl font-bold text-white uppercase tracking-wider max-w-2xl">
        Ну і куди ти, заліз?
      </h2>

      <p className="mt-4 text-sm md:text-base text-neutral-500 max-w-md mx-auto leading-relaxed font-mono">
        Тут тупо{" "}
        <span className="font-display text-red-500 underline font-bold decoration-wavy">
          НІХУЯ НЕМАЄ
        </span>
        . Або ти криворукий і помилився посиланням, або ми десь провтикали в
        коді.
      </p>

      <div className="mt-10">
        <Link
          href="/"
          className="font-display group relative inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-black border-2 border-white font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#ef4444] hover:bg-neutral-200 hover:shadow-[2px_2px_0px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-none"
        >
          <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>З'їбатись в ужасі</span>
        </Link>
      </div>

      <div className="absolute bottom-4 flex items-center gap-2 text-neutral-700 text-[10px] uppercase tracking-[0.2em] font-mono opacity-50">
        <Skull className="w-3 h-3" />
        <span>Dead End</span>
        <Skull className="w-3 h-3" />
      </div>
    </div>
  );
}
