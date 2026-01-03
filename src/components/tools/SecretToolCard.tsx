import { Bomb } from "lucide-react"

export const SecretToolCard = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[250px] border border-dashed border-neutral-700 bg-transparent p-4 opacity-80 cursor-not-allowed">
      <Bomb className="w-8 h-8 text-neutral-700 mb-4" />
      <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
        Секретний Модуль
      </span>
      <span className="text-xs text-neutral-700 mt-1">Скоро Буде...</span>
    </div>
  )
}