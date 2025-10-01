import type { NextConfig } from 'next';

// Expose an optional env var NEXT_PUBLIC_API_BASE_URL allowing override (e.g. Docker, staging)
// We still proxy browser calls through Next.js (see rewrites) to avoid CORS issues in Safari and others.
// If the user sets NEXT_PUBLIC_API_DIRECT=1 we will skip proxy usage (useful for tools / local scripts).
const API_PORT = process.env.API_PORT || '8088';
const DIRECT_API_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL || `http://localhost:${API_PORT}`;

const nextConfig: NextConfig = {
  async rewrites() {
    // Only add rewrites when not explicitly disabled.
    if (process.env.NEXT_PUBLIC_API_DIRECT === '1') return [];
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${DIRECT_API_ORIGIN}/:path*`, // Proxy to backend
      },
    ];
  },
  // Provide the resolved direct origin to the client (for SSR usage or optional direct calls)
  env: {
    NEXT_PUBLIC_API_BASE_URL: DIRECT_API_ORIGIN,
  },
};

export default nextConfig;
