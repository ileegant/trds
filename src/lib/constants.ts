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
    donate: "https://send.monobank.ua/jar/63mt83E1dg",
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
];

export const RECEIPT_COLORS = [
  { hex: "#ffffff", name: "Classic White" },
  { hex: "#F4FF5F", name: "Acid Yellow" },
  { hex: "#FF9EAA", name: "Punk Pink" },
  { hex: "#A0E9FF", name: "Electric Blue" },
  { hex: "#C7F9CC", name: "Mint Fresh" },
];

export const TOOLS = [
  {
    id: "threads-circle",
    title: "Твоє тредс коло",
    description: "Цей тест покаже хто твої ментально не здорові кєнти.",
    icon: Users,
    href: "/threads-circle",
    tag: "NEW",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "cbt",
    title: "СБТ: Служба безпеки тредів",
    description:
      "Дізнайся, чому тебе насправді не лайкають. Спойлер: справа не в тіньовому бані, а в тому, що ти душніла.",
    icon: Fingerprint,
    href: "/cbt",
    tag: "NEW",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "vibe",
    title: "Твій Вайб Чек",
    description:
      "Який колір твоєї аури в Threads? Токсичний зелений чи депресивний сірий?",
    icon: Receipt,
    href: "/vibe-check",
    tag: "STABLE",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];
