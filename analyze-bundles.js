/**
 * Bundle Analyzer Configuration
 * 
 * This file extends Next.js configuration to enable bundle analysis,
 * which helps identify large dependencies that can impact performance.
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});
