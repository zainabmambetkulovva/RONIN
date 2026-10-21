"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/typography.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Регистрация Service Worker для PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker зарегистрирован:', registration);
          
          // Проверка обновлений каждые 5 минут
          setInterval(() => {
            registration.update().then(() => {
              console.log('🔄 Проверка обновлений Service Worker...');
            }).catch(err => {
              console.error('Ошибка проверки обновлений:', err);
            });
          }, 5 * 60 * 1000);
          
          // Обновление Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новая версия доступна
                  console.log('🔄 Новая версия приложения доступна');
                  // Автоматически обновляем без подтверждения
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Ошибка регистрации Service Worker:', error);
        });
    }
  }, []);

  return (
    <html lang="ru" className="dark">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="RONIN Gaming Club" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RONIN" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#9333ea" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Splash Screens для iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* SEO */}
        <meta name="description" content="Компьютерный клуб в Бишкеке - Мощные игровые ПК, комфортная атмосфера, онлайн бронирование" />
        <meta name="keywords" content="компьютерный клуб, gaming, киберспорт, Бишкек, игровые компьютеры" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-ronin-black`}>
        <LoadingScreen />
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
