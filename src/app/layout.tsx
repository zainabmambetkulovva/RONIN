"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/typography.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-ronin-black`}>
        <SessionProvider>
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
        </SessionProvider>
      </body>
    </html>
  );
}
