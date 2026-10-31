import { Inter, Unbounded } from "next/font/google";
import "./globals.css";
import "../styles/typography.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import type { Metadata } from "next";
import { getBranding } from "@/server/services/branding";
import { club } from "@/config/club";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

// Шрифт заголовков нового дизайна (поддерживает кириллицу)
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
});

// Название клуба в превью обновляется не реже раза в 5 минут
export const revalidate = 300;

const DESCRIPTION = "Круглосуточный компьютерный клуб в Бишкеке: мощные игровые ПК, 3D-карта зала и онлайн-бронирование.";

/**
 * Open Graph и Twitter Card: превью ссылки в Telegram, WhatsApp, Instagram, Facebook.
 * Название — из настроек бренда, картинка — club.ogImage, а если её нет — /api/og (собирается из названия, цветов и логотипа клуба).
 */
export async function generateMetadata(): Promise<Metadata> {
  // Адрес сайта для абсолютных ссылок в превью. На Vercel — основной адрес этого проекта (с доменом клуба, если он подключён):
  // Vercel задаёт его сам, и он не устаревает, как NEXT_PUBLIC_APP_URL, оставшийся от старого сайта
  const site =
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";
  // Название — из настроек бренда; если база недоступна (например, при сборке) — стандартное
  const name = await Promise.race([
    getBranding()
      .then((b) => b.clubName)
      .catch(() => "RONIN"),
    new Promise<string>((resolve) => setTimeout(() => resolve("RONIN"), 1500)),
  ]).catch(() => "RONIN");
  const title = `${name} — компьютерный клуб в Бишкеке`;
  // Готовая картинка клуба, если есть, иначе автоматическая
  const ogImage = club.ogImage ?? "/api/og";
  return {
    metadataBase: new URL(site),
    title,
    description: DESCRIPTION,
    applicationName: `${name} Gaming Club`,
    openGraph: {
      type: "website",
      url: "/",
      siteName: name,
      title,
      description: DESCRIPTION,
      locale: "ru_RU",
      alternateLocale: ["ky_KG", "en_US"],
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DESCRIPTION,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        {/* PWA Meta Tags */}
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
        <meta name="keywords" content="компьютерный клуб, gaming, киберспорт, Бишкек, игровые компьютеры" />
      </head>
      <body className={`${inter.variable} ${display.variable} font-sans antialiased bg-ronin-black`}>
        <ServiceWorkerRegister />
        <BrandingProvider>
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
        </BrandingProvider>
      </body>
    </html>
  );
}
