/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Отключаем strict mode для избежания двойного рендера
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
};

export default nextConfig;
