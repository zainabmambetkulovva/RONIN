import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/typography.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RONIN — Компьютерный клуб в Бишкеке",
    template: "%s | RONIN",
  },
  description:
    "RONIN — современный компьютерный клуб в Бишкеке. 96 компьютеров, онлайн-бронирование, Premium и VIP комнаты.",
  keywords: ["компьютерный клуб", "Бишкек", "RONIN", "Gaming", "бронирование"],
  openGraph: {
    title: "RONIN — Компьютерный клуб",
    description: "96 компьютеров. Онлайн-бронирование. Gaming-атмосфера.",
    type: "website",
    locale: "ru_KG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-ronin-black`}>
        <LanguageProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a0a3e",
                color: "#fff",
                border: "1px solid rgba(168,85,247,0.3)",
              },
              success: {
                iconTheme: { primary: "#a855f7", secondary: "#fff" },
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
