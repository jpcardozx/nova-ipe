const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // Optional

module.exports = function(config, options) {
  return merge(config, {
    mode: 'production',
    devtool: 'source-map', // Recommended for production
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
            mangle: true, // Note: Mangle can sometimes break code if not careful with class/function names relied upon by strings
          },
          extractComments: false, // Keep comments like licenses
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      // Further optimization settings can be added here
      // e.g., moduleIds: 'deterministic', chunkIds: 'deterministic'
    },
    plugins: [
      // Add any production-specific plugins here
      // Example: new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false, reportFilename: '../bundle-analyzer-report.html' }),
    ],
    performance: {
      hints: 'warning', // Show warnings for large assets
      maxAssetSize: 512 * 1024, // 512 KiB, increased from base
      maxEntrypointSize: 512 * 1024, // 512 KiB, increased from base
    },
  });
};
