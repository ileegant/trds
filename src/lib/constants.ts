import { Fingerprint, Receipt, Users } from "lucide-react";

export const SITE_CONFIG = {
  name: "TRDS",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://trds.fun",
  developer: {
    name: "Oleh",
    handle: "ileegant",
    github: "https://github.com/ileegant",
  },
  links: {
    donate: "https://send.monobank.ua/jar/V6YvLzXiU",
  },
};

export const BLACKLIST = [
  "russia",
  "putin",
  "moscow",
  "rusnya",
  "brattkka",
  "glosssex",
  "drvlska",
  "genius_26.02",
  "lilya__sst",
  "daria.moginska",
  "pokkakattt",
  "riri_nka",
  "nastyapogorela",
  "na4asi.club",
  "vikki___iv"
];

export const WHITELIST = [
  "ileegant",
  "iyukkuri_",
  "trds.fun",
  "yprkt24",
  "romamakesense",
  "yevheniia25s",
  "igor_i_gory",
  "sydor_enko01",
  "did.ihor",
  "pepsasasp",
  "olhaharding",
  "pierwszy.rr",
  "kkirsanovska",
  "anastasiia.shv",
  "_stepanyuchka_",
  "cloutdevitto",
  "i.llsk8",
  "pavlo.kozeletskyi",
  "teawithmillk",
  "moralfaq_",
  "ffghisjkzkl",
  "rostikarts",
  "chopers.wear"
];

export const RECEIPT_COLORS = [
  { hex: "#ffffff", name: "Classic White" },
  { hex: "#F4FF5F", name: "Acid Yellow" },
  { hex: "#FF9EAA", name: "Punk Pink" },
  { hex: "#A0E9FF", name: "Electric Blue" },
  { hex: "#C7F9CC", name: "Mint Fresh" }
];

export const TAG_STYLES: Record<string, string> = {
  HOT: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  STABLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  BETA: "bg-slate-500/10 text-slate-400 border-slate-500/20"
};

export const TOOLS = [
  {
    id: "threads-circle",
    title: "Твоє тредс коло",
    description: "Цей тест покаже хто твої ментально не здорові кєнти.",
    icon: Users,
    href: "tools/threads-circle",
    tag: "NEW"
  },
  {
    id: "cbt",
    title: "СБТ: Служба безпеки тредів",
    description:
      "Дізнайся, чому тебе насправді не лайкають. Спойлер: справа не в тіньовому бані, а в тому, що ти душніла.",
    icon: Fingerprint,
    href: "tools/cbt",
    tag: "NEW"
  },
  {
    id: "vibe",
    title: "Твій Вайб Чек",
    description:
      "Який колір твоєї аури в Threads? Токсичний зелений чи депресивний сірий?",
    icon: Receipt,
    href: "tools/vibe-check",
    tag: "STABLE"
  },
];
