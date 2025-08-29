// Performance configuration for Nova Ipê
module.exports = {
  // Bundle size limits (in bytes)
  bundleLimits: {
    maxPageBundle: 200 * 1024, // 200KB
    maxSharedBundle: 400 * 1024, // 400KB
    maxTotalBundle: 1024 * 1024, // 1MB
  },

  // Core Web Vitals targets
  webVitalsTargets: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 600, // Time to First Byte (ms)
  },

  // Performance optimizations
  optimizations: {
    // Enable SWC minification
    swcMinify: true,
    
    // Enable experimental features for better performance
    experimental: {
      // Optimize imports for common libraries
      optimizePackageImports: [
        'lucide-react',
        'framer-motion',
        '@radix-ui/react-dialog',
        '@radix-ui/react-accordion',
        '@radix-ui/react-tabs',
        '@sanity/ui',
        'date-fns',
        'react-intersection-observer',
        'embla-carousel-react',
      ],
      
      // Enable turbopack in development
      turbo: {
        rules: {
          '*.svg': ['@svgr/webpack'],
        },
        resolveAlias: {
          // Optimize commonly used paths
          '@': './app',
          '@/lib': './lib',
          '@/components': './app/components',
        },
      },
    },

    // Image optimization settings
    images: {
      // Use modern formats
      formats: ['image/avif', 'image/webp'],
      
      // Optimize device sizes for better loading
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      
      // Long cache duration for better performance
      minimumCacheTTL: 31536000, // 1 year
      
      // Enable SVG support with security
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Webpack optimizations
    webpack: {
      // Split chunks for better caching
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          
          // Common chunks
          common: {
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
          
          // UI library chunks
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 15,
          },
          
          // Sanity chunks
          sanity: {
            test: /[\\/]node_modules[\\/](@sanity|next-sanity)[\\/]/,
            name: 'sanity',
            chunks: 'all',
            priority: 15,
          },
        },
      },
    },
  },

  // Development performance settings
  development: {
    // Fast refresh settings
    fastRefresh: true,
    
    // Disable heavy operations in dev
    typescript: {
      ignoreBuildErrors: false,
      tsconfigPath: './tsconfig.json',
    },
    
    // Optimize dev server
    devServer: {
      compress: true,
      hot: true,
    },
  },

  // Production performance settings
  production: {
    // Enable all optimizations
    compress: true,
    
    // Remove console logs
    removeConsole: true,
    
    // Enable static optimization
    staticOptimization: true,
    
    // Output tracing
    outputFileTracing: true,
    
    // Generate bundle analyzer report
    analyzer: process.env.ANALYZE === 'true',
  },

  // Monitoring and reporting
  monitoring: {
    // Web vitals reporting
    reportWebVitals: true,
    
    // Bundle analysis
    bundleAnalysis: {
      enabled: process.env.ANALYZE === 'true',
      outputDirectory: './performance-reports',
    },
    
    // Performance budgets
    budgets: [
      {
        type: 'initial',
        maximumWarning: '500kb',
        maximumError: '1mb',
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '50kb',
        maximumError: '100kb',
      },
    ],
  },
};