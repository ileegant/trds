import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Snow } from "@/components/ui/Snow";
import { Footer } from "@/components/layout/Footer";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trds-tau.vercel.app"),

  title: {
    default: "TRDS | Генератор для Threads",
    template: "%s | TRDS",
  },

  description:
    "Безкоштовний набір інструментів для Threads: генератор мемів, детальна статистика профілю, аналіз трендів та створення вірусного контенту.",

  keywords: [
    "Threads",
    "Тредс",
    "статистика threads",
    "генератор мемів",
    "threads analytics",
    "меми українською",
    "trds",
    "інстаграм тредс",
  ],

  authors: [{ name: "Oleh", url: "https://github.com/ileegant" }],
  creator: "TRDS Team",

  openGraph: {
    title: "TRDS | Прокачай свій Threads",
    description: "Генератор статистики та мемів для твого профілю.",
    url: "https://trds-tau.vercel.app",
    siteName: "TRDS",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TRDS Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TRDS | Інструменти для Threads",
    description: "Статистика, меми та інструменти для росту.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${manrope.variable} ${unbounded.variable} antialiased min-h-screen flex flex-col bg-[#0a0a0a] text-white`}
      >
        <Snow />
        <Header />
        <main className="flex-1 flex flex-col py-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
