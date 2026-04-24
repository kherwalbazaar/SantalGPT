import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.42.94.52'],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV !== 'development') {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
