const { merge } = require('webpack-merge');

module.exports = function(config, options) {
  return merge(config, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    optimization: {
      minimizer: [
        // No JS or CSS minimization in development for faster builds
      ],
    },
    plugins: [
      // Add any development-specific plugins here
      // e.g., new webpack.HotModuleReplacementPlugin(), // Next.js handles HMR
    ],
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000, // Or set to true for polling if watching doesn't work
    },
  });
};
