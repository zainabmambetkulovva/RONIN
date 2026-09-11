import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/client',
        destination: '/client/home',
        permanent: false,
      },
      {
        source: '/manager',
        destination: '/manager/dashboard',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin/admin-dashboard',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
