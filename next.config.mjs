/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Canonical host: www → apex. Without this Google indexes both hosts
      // separately and splits ranking signal (visible in Search Console).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.filelark.com' }],
        destination: 'https://filelark.com/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // @jsquash/avif ships WebAssembly codecs
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
