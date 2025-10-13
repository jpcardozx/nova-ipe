/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.lightsailproperty.com',
      },
      {
        protocol: 'https',
        hostname: 'api.jetimob.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Configuração otimizada de qualidades para Next.js 15
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    // Configuração de qualidades progressivas
    qualities: [50, 75, 85, 90, 100],
    // Cache otimizado
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 dias
    // Limitar tamanho máximo de imagens
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ⚡ PERFORMANCE OPTIMIZATIONS
  experimental: {
    // Habilitar optimized package imports para Sanity
    optimizePackageImports: ['@sanity/ui', '@sanity/icons', 'sanity'],
  },
  
  // Cache agressivo para dev
  onDemandEntries: {
    // Período que as páginas ficam em cache (1 hora)
    maxInactiveAge: 60 * 60 * 1000,
    // Número de páginas simultâneas
    pagesBufferLength: 5,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Otimizações para bundle do Sanity Studio
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separar Sanity em chunk próprio
            sanity: {
              test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
              name: 'sanity',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separar outras dependências grandes
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    
    // Ignorar warnings de source maps do Sanity
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules[\\/](@sanity|sanity|next-sanity)[\\/]/,
      },
    ]
    
    return config
  },
};

module.exports = nextConfig;