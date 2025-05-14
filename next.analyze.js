const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Importa as configurações existentes do next.config.js
    ...require('./next.config.js')
};

module.exports = withBundleAnalyzer(nextConfig);
