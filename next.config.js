const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  images: {
    domains: ["github.com", "raw.githubusercontent.com", "cdn.sanity.io"], // ADICIONADO O DOMÍNIO NECESSÁRIO
  },
  rewrites: async () => [
    {
      source: "/studio/:path*",
      destination: "/studio/index.html",
    },
  ],
};

// exporta tudo com Sentry
module.exports = withSentryConfig(nextConfig);
