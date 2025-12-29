import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Snow } from "@/components/ui/Snow";
import { SITE_CONFIG } from "@/lib/constants";

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
  metadataBase: new URL(SITE_CONFIG.url),

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

  authors: [
    { name: SITE_CONFIG.developer.name, url: SITE_CONFIG.developer.github },
  ],
  creator: "TRDS Team",

  openGraph: {
    title: "TRDS | Прокачай свій Threads",
    description: "Генератор статистики та мемів для твого профілю.",
    url: SITE_CONFIG.url,
    siteName: "TRDS",
    locale: "uk_UA",
    type: "website",
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
      <head>
        {/* 2. Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${manrope.variable} ${unbounded.variable} antialiased min-h-screen flex flex-col bg-neutral-950 text-white`}
      >
        <Snow />
        <Header />
        <main className="flex-1 flex flex-col px-4 pt-8 pb-6 bg-neutral-950">
          {children}
        </main>
      </body>
    </html>
  );
}
