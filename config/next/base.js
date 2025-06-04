// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const baseNextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for minification (faster)
  compiler: {
    // Disable styled-components SWC transform as it's being removed
    styledComponents: false,
    // Remove console logs in production (except errors)
    // removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error'] } : false,
  },
  // If you have a custom server, uncomment and set:
  // useFileSystemPublicRoutes: false,

  // Environment variables
  env: {
    // NEXT_PUBLIC_SOME_VAR: process.env.SOME_VAR,
  },

  // Headers, redirects, rewrites
  // async headers() { return []; },
  // async redirects() { return []; },
  // async rewrites() { return []; },

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'], // Add mdx if you use it

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true, // Consider setting to false for stricter builds
  },

  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true, // Consider setting to false for stricter builds
  },

  // Modularize imports for specific libraries to reduce bundle size
  // modularizeImports: {
  //   '@mui/material': {
  //     transform: '@mui/material/{{member}}',
  //   },
  //   '@mui/icons-material': {
  //     transform: '@mui/icons-material/{{member}}',
  //   },
  //   'lodash': {
  //     transform: 'lodash/{{member}}',
  //     preventFullImport: true,
  //   }
  // },

  // Experimental features (use with caution)
  experimental: {
    // appDir: true, // If using the App Router
    // serverActions: true, // If using Server Actions
    // typedRoutes: true, // If using typed routes
    // instrumentationHook: true, // For OpenTelemetry or Sentry
  },

  // Production browser source maps
  productionBrowserSourceMaps: true, // Enable for easier debugging in production (at the cost of build time and bundle size)

  // Configure how Next.js handles webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // IMPORTANT: This is where you'll integrate your custom webpack configurations.
    // The existing webpack function in next.config.js needs to be merged with this.

    // Example: Modify existing rules or add new ones
    // config.module.rules.push({
    //   test: /\\.svg$/,
    //   use: ["@svgr/webpack"]
    // });

    // Example: Add fallbacks for node core modules (if not handled by your base webpack config)
    // if (!isServer) {
    //   config.resolve.fallback = {
    //     ...config.resolve.fallback,
    //     fs: false, // Example: 'fs' module cannot be used on the client side
    //     path: false,
    //     crypto: false,
    //     stream: require.resolve('stream-browserify'),
    //     buffer: require.resolve('buffer/'),
    //     process: require.resolve('process/browser'),
    //   };
    // }

    // Example: Add plugins
    // config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^\\.\\/locale$/, contextRegExp: /moment$/ }));

    // The final config object will be used by Next.js
    return config;
  },
};

module.exports = baseNextConfig;
