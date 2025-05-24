
// Add this to your next.config.js webpack function
config.optimization = {
  ...config.optimization,
  splitChunks: {
    chunks: 'all',
    maxSize: 200000, // 200KB max chunks
    cacheGroups: {
      default: false,
      vendors: false,
      // Framework chunk (React, Next.js)
      framework: {
        chunks: 'all',
        name: 'framework',
        test: /(?:[\\/]node_modules[\\/](?:react|react-dom|scheduler|prop-types|use-subscription)[\\/])/,
        priority: 40,
        enforce: true,
      },
      // Libraries chunk
      lib: {
        test: /[\\/]node_modules[\\/]/,
        name: 'lib',
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
        chunks: 'all',
        maxSize: 150000,
      },
      // UI libraries (heavy ones)
      ui: {
        test: /[\\/]node_modules[\\/](@chakra-ui|@radix-ui|framer-motion)[\\/]/,
        name: 'ui-heavy',
        priority: 35,
        chunks: 'all',
        maxSize: 100000,
      },
      // Commons chunk for shared code
      commons: {
        name: 'commons',
        minChunks: 2,
        priority: 20,
        chunks: 'all',
        maxSize: 100000,
      },
    },
  },
};
