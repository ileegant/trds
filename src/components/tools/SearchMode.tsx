import React from "react";
import { AtSign } from "lucide-react";
import { Button } from "../ui/Button";

interface SearchModeProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  username: string;
  setUsername: (value: string) => void;
  onGenerate: () => void;
  buttonText?: string;
  placeholder?: string;
}

export const SearchMode = ({
  icon,
  title,
  description,
  username,
  setUsername,
  onGenerate,
  buttonText = "Згенерувати",
  placeholder = "НІКНЕЙМ",
}: SearchModeProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onGenerate();
  };

  return (
    <div className="w-full flex flex-col items-center text-center animate-fade-in-up">
      <div
        className={`mb-8 relative inline-flex items-center justify-center p-4 border-2 rounded-sm overflow-hidden group bg-neutral-900 border-neutral-800 text-slate-400 rounded-full`}
      >
        <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 leading-[0.9]">
        {title}
      </h1>

      <p className="text-neutral-400 text-xs md:text-sm mb-10 max-w-lg font-mono uppercase tracking-wider leading-relaxed">
        {description}
      </p>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="relative group">
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white`}
          >
            <AtSign className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full pl-12 pr-4 py-4 bg-black border-2 border-neutral-800 text-white placeholder-neutral-600 font-bold uppercase font-mono text-lg shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] focus:outline-none transition-all rounded-none focus:border-slate-500 focus:shadow-[4px_4px_0px_0px_#64748b]`}
            placeholder={placeholder}
            spellCheck={false}
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={!username.trim()}
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
