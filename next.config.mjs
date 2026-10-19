/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Отключаем strict mode для избежания двойного рендера
  typescript: {
    // Игнорируем ошибки TypeScript при сборке (только для production)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки ESLint при сборке
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Разрешаем локальные изображения с кириллическими именами
    unoptimized: false,
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  // PWA оптимизация
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Кэширование для статики
  async headers() {
    return [
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
