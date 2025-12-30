import Link from "next/link";
import {
  ArrowLeft,
  Siren,
  FileWarning,
  Fingerprint,
  Share2,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";

// Фейкові дані (симуляція відповіді бекенду)
const MOCK_DATA = {
  nickname: "@pan_expert_2024",
  realName: "Невідомий Анон",
  threatLevel: "КРИТИЧНИЙ", // LOW, MEDIUM, CRITICAL
  status: "ПІД ПИЛЬНИМ НАГЛЯДОМ",
  location: "Треди про мобілізацію / Твіттерські срачі",
  crimes: [
    "Розпалювання ворожнечі до ананасів у піці",
    "Надмірне використання смайлика 🤡",
    "Експертна думка з усіх питань (без диплома)",
  ],
  evidence: [
    {
      id: 1,
      text: "Я звісно не військовий експерт, але чому ми ще не...",
      date: "12.10.2024 14:02",
      note: "Спроба стати Арестовичем. Невдала.",
    },
    {
      id: 2,
      text: "В цьому вашому Тредсі одні зумери, де нормальний контент?",
      date: "13.10.2024 09:15",
      note: "Виявлено ознаки старечої буркотнечі (рівень 'Дід').",
    },
  ],
  verdict: "ЗРАДОФІЛ ЗВИЧАЙНИЙ (Vulgus Zradofilus)",
  sentence: "Примусове лікування: 24 години без інтернету та дотик до трави.",
};

export default function AnalysisResult() {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-neutral-950 text-neutral-200 p-4 md:p-8 font-mono overflow-x-hidden">
      {/* --- НАВІГАЦІЯ --- */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад до пошуку
        </Link>
        <div className="flex items-center gap-2 text-emerald-500/80 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          ОНЛАЙН МОНІТОРИНГ
        </div>
      </div>

      {/* --- ГОЛОВНА ПАПКА СПРАВИ --- */}
      <div className="w-full max-w-4xl relative z-10">
        {/* Штамп "ТАЄМНО" */}
        <div className="absolute -top-6 -right-6 md:-right-12 rotate-12 z-20 pointer-events-none select-none">
          <div className="border-4 border-red-600/80 text-red-600/80 px-6 py-2 text-2xl md:text-4xl font-black uppercase tracking-tighter mix-blend-screen animate-pulse">
            Цілком Таємно
          </div>
        </div>

        {/* Контейнер досьє */}
        <div className="bg-neutral-900/50 border border-white/10 backdrop-blur-md overflow-hidden relative shadow-2xl">
          {/* Верхня панель (Скріпка/Заголовок) */}
          <div className="bg-white/5 border-b border-white/10 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-neutral-800 p-2 rounded-sm border border-white/10">
                <Siren className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                  Номер провадження
                </p>
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                  СПРАВА № 349-THR-X
                </h2>
              </div>
            </div>
            <div className="font-mono text-xs text-neutral-400 text-right">
              <p>ДАТА ВІДКРИТТЯ: {new Date().toLocaleDateString()}</p>
              <p>СЛІДЧИЙ: Ш.І. (AI)</p>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* --- ЛІВА КОЛОНКА: ФОТО ТА ПРОФІЛЬ --- */}
            <div className="md:col-span-1 flex flex-col gap-6">
              {/* Фото з цензурою */}
              <div className="relative aspect-square bg-neutral-800 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://ui-avatars.com/api/?name=Pan+Expert&background=random')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute top-1/2 left-0 w-full h-8 bg-black flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">
                    Censored
                  </span>
                </div>
                <Fingerprint className="absolute bottom-2 right-2 w-8 h-8 text-white/20" />
              </div>

              {/* Основні дані */}
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase">
                    Фігурант (Nickname)
                  </p>
                  <p className="text-white text-lg font-bold bg-white/5 px-2 py-1 border-l-2 border-emerald-500">
                    {MOCK_DATA.nickname}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 text-[10px] uppercase">
                    Поточний статус
                  </p>
                  <p className="text-yellow-500 font-bold animate-pulse">
                    {MOCK_DATA.status}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 text-[10px] uppercase">
                    Рівень загрози
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 flex-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-yellow-600 to-red-600" />
                    </div>
                    <span className="text-red-500 font-bold text-xs">
                      {MOCK_DATA.threatLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ПРАВА КОЛОНКА: ДОКАЗИ ТА ВИРОК --- */}
            <div className="md:col-span-2 flex flex-col gap-8">
              {/* Розділ "Доказова база" */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40 border-b border-white/10 pb-2">
                  <Eye className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">
                    Матеріали спостереження (Треди)
                  </h3>
                </div>

                {MOCK_DATA.evidence.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="bg-neutral-950 p-4 border border-neutral-800 hover:border-slate-500 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-neutral-500">
                          {item.date}
                        </span>
                        <FileWarning className="w-4 h-4 text-neutral-700 group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <p className="text-neutral-300 italic mb-3 font-serif">
                        "{item.text}"
                      </p>

                      {/* Коментар слідчого (рукописний стиль) */}
                      <div className="flex items-start gap-2 pt-2 border-t border-dashed border-white/10">
                        <span className="text-red-500/70 font-bold text-xs">
                          ➤
                        </span>
                        <p className="text-red-400/80 text-xs font-mono uppercase">
                          ПРИМІТКА: {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Розділ "Вирок" */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle className="w-24 h-24" />
                </div>

                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Офіційний висновок алгоритму
                </h3>
                <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 uppercase leading-none">
                  {MOCK_DATA.verdict}
                </h2>
                <p className="text-sm text-neutral-400 font-mono border-l-2 border-red-500 pl-4 py-1">
                  {MOCK_DATA.sentence}
                </p>
              </div>
            </div>
          </div>

          {/* Футер картки */}
          <div className="bg-neutral-950/50 p-4 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-[10px] text-neutral-600 font-mono text-center sm:text-left">
              Цей документ згенеровано автоматично. Оскарженню не підлягає.
            </p>

            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none group flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:bg-neutral-700 transition-all">
                <Download className="w-4 h-4" />
                <span>Архів</span>
              </button>

              <button className="flex-1 sm:flex-none group relative flex items-center justify-center gap-2 px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#64748b] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#64748b] active:translate-y-[4px] active:shadow-none transition-all border-2 border-white">
                <Share2 className="w-4 h-4" />
                <span>Злити інфу</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Фонові ефекти */}
      <div className="fixed top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] blur-[120px] bg-red-500 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] opacity-[0.05] blur-[100px] bg-blue-500 rounded-full pointer-events-none" />
      <div className="fixed inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </div>
  );
}
