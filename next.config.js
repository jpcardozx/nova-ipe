const { withSentryConfig } = require("@sentry/nextjs");
const { desc } = require("framer-motion/client");

module.exports = withSentryConfig({
  // Outras configurações
  rewrites: async () => [
    {
      source: "/studio/:path*",
      destination: "/studio/index.html",
    },
  ],
});

const nextConfig = {
  images: {
    domains: ["github.com", "raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;