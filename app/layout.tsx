import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "416 AI Studio — 你諗到嘅嘢，我哋整得出",
  description: "AI 製作 · 人手把關 · 香港製造。最快 3 日交付真正可用嘅產品。由 HKD $500 起。",
  openGraph: {
    title: "416 AI Studio",
    description: "AI 製作 · 人手把關 · 香港製造",
    locale: "zh_HK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
