/**
 * Next.js Configuration - Otimizado para performance rápida em desenvolvimento
 * @version 4.0.0
 * @date 21/05/2025
 * @type {import("next").NextConfig}
 */

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isDev = !isProduction;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Usar apenas o que é realmente necessário
  experimental: {
    // Apenas otimizações que não afetam o tempo de build
    optimizePackageImports: ["lucide-react"]
  },

  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    domains: ["cdn.sanity.io", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  },

  // Configuração de webpack especializada para dev/prod
  webpack: (config, { dev, isServer }) => {
    // Sempre reduzir logging
    config.infrastructureLogging = { level: "error" };

    if (dev) {
      // Em desenvolvimento, desativar funcionalidades pesadas
      config.resolve.alias = {
        ...config.resolve.alias,
        "@sentry/nextjs": false,
        "@opentelemetry/instrumentation": false,
        // Don't disable OpenTelemetry API completely, use the fixed version
      };

      // Reduzir estatísticas apenas em dev
      config.stats = "errors-only";
    }

    return config;
  },
};

module.exports = nextConfig;
