import React, { useState } from "react";
import { Lock, Cat, Send, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const WhiteListOverlay = () => {
  const [nickname, setNickname] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    // Тут відправка на сервер/консоль
    try {
      await fetch("/api/log-request", {
        method: "POST",
        body: JSON.stringify({ nickname }),
      });
    } catch (err) {
      console.log("Request access for:", nickname);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-md bg-neutral-900 border border-red-900/30 rounded-2xl p-2 shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden">
        {/* Фоновий ефект (червоний для агресії) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {!isSubmitted ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-neutral-800 rounded-full border border-red-900/50 shadow-inner group">
                <Lock className="w-8 h-8 text-red-500 group-hover:animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tighter leading-none">
              ТИ ХТО <span className="text-red-500">ТАКИЙ?</span>
            </h2>

            <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 mb-6 text-center">
              <p className="text-[8px] text-red-400 font-mono uppercase tracking-widest font-bold">
                Access Denied: You are not whitelisted
              </p>
            </div>

            <p className="text-neutral-400 text-center text-[8px] mb-6 font-mono leading-relaxed">
              Зараз доступ відкрито тільки для перевірених тредчан, щоб сервери
              не лягли від напливу. Скоро відкриємо для всіх смертних. <br />
              Не хочеш чекати загальної черги?
              <span className="text-white font-bold block mt-2">
                Можна "домовитись" через котика.
              </span>
            </p>

            <div className="space-y-2 mb-4 text-[8px] text-neutral-400 font-mono border-l-2 border-neutral-700 pl-3">
              <p>
                <span className="text-white font-bold">1.</span> Кидаєш донат на
                корм коту (це хабар).
              </p>
              <p className="text-red-400 font-bold">
                <span className="text-white">2.</span> В КОМЕНТАРІ ДО БАНКИ
                ПИШЕШ СВІЙ НІК.
              </p>
              <p className="italic opacity-70">
                *Якщо не напишеш нік в банці — я не ванга, доступ не дам, гроші
                не поверну.
              </p>
              <p>
                <span className="text-white font-bold">3.</span> Дублюєш нік
                сюди і чекаєш.
              </p>
            </div>

            {/* Кнопка донату */}
            <a
              href={SITE_CONFIG.links.donate} // <-- ЛІНК
              target="_blank"
              rel="noopener noreferrer"
              className="group flex text-xs items-center justify-center gap-2 w-full bg-white text-black font-black uppercase py-2 px-2 rounded-xl mb-3 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/10"
            >
              <Cat className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Дати Хабар (Monobank)</span>
            </a>

            <div className="relative flex items-center gap-2 mb-3">
              <div className="h-px bg-neutral-800 flex-1"></div>
              <span className="text-[8px] text-neutral-600 font-mono uppercase">
                Я вже заніс, пустіть
              </span>
              <div className="h-px bg-neutral-800 flex-1"></div>
            </div>

            {/* Форма для ніку */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="@nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full text-xs bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2 pl-2 pr-12 focus:outline-none focus:border-red-500 transition-colors font-mono placeholder:text-neutral-600"
              />
              <button
                type="submit"
                disabled={!nickname}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-neutral-700 rounded-lg text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* Стан "Успішно відправлено" */
          <div className="text-center py-8">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
              <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
            </div>
            <h3 className="font-black text-white mb-2 uppercase">
              Заявка пішла
            </h3>
            <p className="text-neutral-400 text-[8px] font-mono mb-6 leading-relaxed">
              Якщо ти не збрехав і дійсно закинув на корм — скоро пущу. <br />
              Якщо ні — сиди і чекай до другого пришестя.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-[10px] text-red-500 font-mono hover:text-red-400 uppercase tracking-widest border-b border-red-500/30 pb-1"
            >
              Я зрозумів, оновити
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
