import { TriangleAlert } from 'lucide-react';

interface ErrorAlertProps {
  message: string | null; // Приймає рядок або null
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  // Якщо повідомлення немає, не показуємо нічого
  if (!message) return null;

  return (
    <div className="fixed top-16 left-0 w-full flex justify-center px-4 z-50 pointer-events-none">
      <div className="animate-bounce bg-[#ff4b4b] text-white px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg flex items-center gap-3 pointer-events-auto">
        <TriangleAlert className="w-5 h-5 stroke-[3]" />
        <span className="font-bold uppercase text-xs md:text-sm">
          {message}
        </span>
      </div>
    </div>
  );
};