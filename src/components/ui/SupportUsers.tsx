import Link from "next/link";
import { PawPrint } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

// Масив реальних донатерів
const RECENT_DONATIONS = [
  { name: "Богдан М.", amount: "6.09 ₴" },
  { name: "Анатолій К.", amount: "44.00 ₴" },
  { name: "Невідомий Герой", amount: "50.00 ₴" },
  { name: "Анастасія Д.", amount: "20.00 ₴" },
  { name: "Олена М.", amount: "26.91 ₴" },
  { name: "Богдан М.", amount: "6.09 ₴" },
  { name: "Анатолій К.", amount: "44.00 ₴" },
  { name: "Невідомий Герой", amount: "50.00 ₴" },
  { name: "Анастасія Д.", amount: "20.00 ₴" },
  { name: "Олена М.", amount: "26.91 ₴" },
];

export const SupportUsers = () => {
  return (
    <div className="bg-black py-3 pt-9 md:pt-11 relative select-none overflow-hidden">
      <div className="flex gap-2 md:gap-4 w-max">
        {/* ПЕРШИЙ ВАГОН (Їде вліво) */}
        <div className="flex gap-2 md:gap-4 items-center shrink-0 animate-marquee min-w-50 justify-around">
          {/* Рендеримо список донатерів.
             Якщо донатерів мало (< 5), краще продублювати масив: [...RECENT_DONATIONS, ...RECENT_DONATIONS].map... */}
          {RECENT_DONATIONS.map((user, i) => (
            <DonationItem
              key={`a-${i}`}
              name={user.name}
              amount={user.amount}
            />
          ))}
        </div>

        {/* ДРУГИЙ ВАГОН (Клон для безшовності) */}
        <div
          className="flex gap-2 md:gap-4 items-center shrink-0 animate-marquee min-w-50 justify-around"
          aria-hidden="true"
        >
          {RECENT_DONATIONS.map((user, i) => (
            <DonationItem
              key={`b-${i}`}
              name={user.name}
              amount={user.amount}
            />
          ))}
        </div>
      </div>

      {/* Градієнти по боках */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
};

// Компонент одного донату (приймає пропси)
const DonationItem = ({ name, amount }: { name: string; amount: string }) => (
  <Link
    href={SITE_CONFIG.links.donate}
    target="_blank"
    className="group flex items-center gap-3 text-sm font-medium transition-all hover:opacity-80 decoration-0"
  >
    <div className="flex items-center gap-1 text-white text-[10px] md:text-sm">
      <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
        <PawPrint className="w-3 h-3 md:w-4 md:h-4 text-white" />
      </div>

      <span className="text-gray-300 whitespace-nowrap">{name}</span>
      <span className="text-white font-bold tabular-nums whitespace-nowrap">
        {amount}
      </span>
      <span className="text-gray-600 mx-1 pl-2 md:pl-4">•</span>
    </div>
  </Link>
);
