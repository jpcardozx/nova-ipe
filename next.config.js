/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
    
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url', 
      'sharp',
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 640, 1080, 1920],
    imageSizes: [16, 32, 64, 128],
    minimumCacheTTL: 86400, // 1 dia
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },  webpack: (config, { isServer, dev }) => {
    // Resolver problemas de import/export
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignorar arquivos .js.map que causam erros de parsing
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'raw-loader'
    });

    // Configurar para não processar source maps como módulos
    config.resolve.alias = {
      ...config.resolve.alias,
      // Evitar que webpack tente resolver source maps como módulos
    };

    // Ignorar warnings de source maps
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module parse failed.*\.js\.map/,
      /Can't resolve.*\.js\.map/
    ];

    // Configuração específica para evitar que webpack processe .js.map como modules
    config.module.rules.unshift({
      test: /\.js\.map$/,
      type: 'asset/resource',
      generator: {
        emit: false
      }
    });

    return config;
  },
};

module.exports = nextConfig;