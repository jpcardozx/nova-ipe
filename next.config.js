/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url', 
      'sharp',
    ],
    
    // Garantir que styled-components seja tratado corretamente
    esmExternals: 'loose',
  },

  transpilePackages: ['styled-components', '@sanity/ui'],

  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: true,
    },
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

    // Fix abrangente para styled-components com Sanity Studio
    config.resolve.alias = {
      ...config.resolve.alias,
      'styled-components': require.resolve('styled-components'),
    };

    // Configuração especial para Sanity Studio e styled-components
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/(sanity|@sanity)/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Tratar styled-components como externo apenas no servidor para SSR
    if (isServer) {
      config.externals = config.externals || [];
      // Remover styled-components dos externals para garantir que seja bundleado corretamente
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(external => {
          if (typeof external === 'string') {
            return external !== 'styled-components';
          }
          return true;
        });
      }
    }

    // Garantir que styled-components seja sempre resolvido corretamente
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push('node_modules');

    // Configuração adicional para modules ESM
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };

    // Ignorar arquivos .js.map que causam erros de parsing
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'raw-loader'
    });

    // Ignorar warnings de source maps
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module parse failed.*\.js\.map/,
      /Can't resolve.*\.js\.map/,
      /Can't resolve 'styled-components'/
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