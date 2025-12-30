"use client";

import { useState } from "react";
import { AtSign, Search, Siren } from "lucide-react";

// Приклад виклику компонента (якщо він окремо):
// <SearchForm onSearch={(nick) => console.log("Searching:", nick)} loading={false} />

export default function SearchForm({
  onSearch,
  loading,
}: {
  onSearch?: (nick: string) => void;
  loading?: boolean;
}) {
  const [username, setUsername] = useState("");

  const handleGenerate = () => {
    if (username.trim() && onSearch) {
      onSearch(username);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center animate-fade-in-up px-4 pt-10">
      {/* Верхня іконка (Сирена/Пошук) */}
      <div className="mb-8 relative inline-flex items-center justify-center p-4 bg-neutral-950 border-2 border-neutral-800 rounded-sm overflow-hidden group">
        {/* Ефект сканування на фоні */}
        <div className="absolute inset-0 bg-red-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/50 animate-scan opacity-0 group-hover:opacity-100"></div>

        <Siren className="w-10 h-10 text-red-600/80 relative z-10 animate-pulse" />

        {/* Штамп на фоні */}
        <span className="absolute -rotate-12 text-neutral-800 font-black text-5xl opacity-20 pointer-events-none select-none z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          УВАГА
        </span>
      </div>

      {/* Головний заголовок */}
      <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 leading-[0.9]">
        ОПЕРАТИВНИЙ <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-slate-400 to-white">
          РОЗШУК ФІГУРАНТА
        </span>
      </h1>

      {/* Підзаголовок (Інструкція) */}
      <div className="flex items-center gap-4 opacity-50 mb-4">
        <div className="h-[1px] w-8 bg-red-500" />
        <span className="text-red-500 text-xs font-mono uppercase tracking-widest">
          Доступ до реєстру
        </span>
        <div className="h-[1px] w-8 bg-red-500" />
      </div>

      <p className="text-neutral-400 text-xs md:text-sm mb-10 max-w-lg font-mono uppercase tracking-wider leading-relaxed">
        Введіть позивний (нікнейм) об'єкта для перевірки по базах даних та
        виявлення ознак деструктивної діяльності в тредах.
      </p>

      {/* Форма вводу (ТВІЙ СТИЛЬ ЗІ ЗМІНАМИ ДЛЯ СБУ) */}
      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-500 transition-colors">
            <AtSign className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="w-full pl-12 pr-4 py-4 bg-black border-2 border-neutral-800 text-white placeholder-neutral-700 font-bold uppercase font-mono text-lg shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] focus:outline-none focus:border-red-700 focus:shadow-[4px_4px_0px_0px_#ef4444] transition-all rounded-none"
            placeholder="ПОЗИВНИЙ / NICKNAME"
            spellCheck={false}
          />
          {/* Декоративні кутики */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neutral-700 pointer-events-none group-focus-within:border-red-600 transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neutral-700 pointer-events-none group-focus-within:border-red-600 transition-colors"></div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !username.trim()}
          // Твій стиль кнопки
          className="group font-display relative w-full py-4 bg-white text-black border-2 border-white font-bold uppercase tracking-[0.15em] text-sm shadow-[4px_4px_0px_0px_#64748b] hover:bg-neutral-100 hover:shadow-[2px_2px_0px_0px_#64748b] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-[4px_4px_0px_0px_#64748b] rounded-none overflow-hidden flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
              Обробка запиту...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              ЗАПИТ ДО АРХІВУ
            </>
          )}
        </button>
      </div>

      {/* Фоновий шум/сітка */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
    </div>
  );
}
