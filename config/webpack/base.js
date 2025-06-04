/**
 * Base Webpack Configuration
 * Contains core webpack settings and optimizations
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs'); // Added fs for refractor alias logic
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (config, { isServer, dev, buildId, webpack }) => {
  const isProduction = !dev;

  // Core optimization settings
  config.optimization = config.optimization || {};
  config.optimization.moduleIds = 'deterministic';
  config.optimization.chunkIds = dev ? 'named' : 'deterministic';
  config.optimization.runtimeChunk = isServer ? false : 'single';

  // Advanced code splitting configuration
  config.optimization.splitChunks = {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      default: false,
      vendors: false,
      // Core framework chunk
      framework: {
        name: 'framework',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
        priority: 40,
        enforce: true,
      },
      // UI Components chunk
      uiComponents: {
        name: 'ui-components',
        chunks: 'async',
        test: /[\\/]node_modules[\\/](@radix-ui|@floating-ui|cmdk|framer-motion)[\\/]/,
        priority: 30,
        reuseExistingChunk: true,
        minChunks: 2,
      },
      // Common libraries chunk
      lib: {
        name: 'lib',
        chunks: 'async',
        test: /[\\/]node_modules[\\/]/,
        priority: 20,
        reuseExistingChunk: true,
        minChunks: 2,
      },
    },
  };

  // Module resolution configuration
  config.resolve = config.resolve || {};
  config.resolve.symlinks = false;
  config.resolve.cacheWithContext = false;
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(process.cwd()),
    '@lib': path.resolve(process.cwd(), 'lib'),
    '@components': path.resolve(process.cwd(), 'components'),
    '@app': path.resolve(process.cwd(), 'app'),
    // Aliases from webpack.config.master.js (adjusted paths)
    // Refractor aliases
    ...(function() {
      const aliases = {};
      try {
        // Corrected path resolution for refractor
        const refractorNodeModulesPath = path.resolve(process.cwd(), 'node_modules', 'refractor');
        const refractorPackageJsonPath = path.join(refractorNodeModulesPath, 'package.json');

        if (!fs.existsSync(refractorPackageJsonPath)) {
          throw new Error(`Refractor package.json not found at ${refractorPackageJsonPath}`);
        }
        
        const langDir = path.join(refractorNodeModulesPath, 'lang');
        const languageModules = [
          'bash', 'javascript', 'json', 'jsx', 'typescript', 'tsx',
          'css', 'markdown', 'html', 'python', 'java', 'cpp', 'c',
          'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'
        ];
        languageModules.forEach(lang => {
          const langFile = path.join(langDir, `${lang}.js`);
          if (fs.existsSync(langFile)) {
            aliases[`refractor/lang/${lang}.js`] = langFile;
            aliases[`refractor/lang/${lang}`] = langFile;
          } else {
            // console.warn(`Refractor lang file not found: ${langFile}`);
          }
        });
        const javascriptLangFile = path.join(langDir, 'javascript.js');
        if (fs.existsSync(javascriptLangFile)) {
          aliases['refractor/lang/lang.js'] = javascriptLangFile;
          aliases['refractor/lang/lang'] = javascriptLangFile;
        }
      } catch (err) {
        console.warn('⚠️ Could not configure refractor paths in webpack base config:', err.message);
      }
      return aliases;
    })(),
    // get-it aliases
    'get-it/middleware': path.resolve(process.cwd(), 'node_modules/get-it/dist/middleware.browser.js'),
    'get-it': path.resolve(process.cwd(), 'node_modules/get-it/dist/index.browser.js'),
    'get-it/dist/middleware': path.resolve(process.cwd(), 'node_modules/get-it/dist/middleware.browser.js'),
    'get-it/dist/index': path.resolve(process.cwd(), 'node_modules/get-it/dist/index.browser.js'),
    // Sanity visual editing alias
    '@sanity/visual-editing/react': path.resolve(process.cwd(), 'node_modules/@sanity/visual-editing/dist/react/index.js'),
  };

  // Robustly initialize module and rules
  if (!config.module) {
    config.module = {};
  }
  // Ensure config.module.rules is an array before pushing
  if (!Array.isArray(config.module.rules)) {
    // console.log('Webpack base.js: config.module.rules was not an array. Initializing.');
    config.module.rules = [];
  }

  // console.log('Webpack base.js: Before push - config.module:', JSON.stringify(config.module, null, 2));
  // console.log('Webpack base.js: Before push - config.module.rules type:', typeof config.module.rules, 'Is Array:', Array.isArray(config.module.rules));
    // File handling rules
  // Defensive check one last time
  if (!Array.isArray(config.module.rules)) {
    console.error('Webpack base.js: CRITICAL - config.module.rules is NOT an array RIGHT BEFORE PUSH. Forcing to array.');
    config.module.rules = [];
  }
    config.module.rules.push(
    // Let Next.js handle CSS files natively, only add asset rules
    {
      test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024, // 8kb
        },
      },
      generator: {
        filename: 'static/images/[name]-[hash][ext]',
      },
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name]-[hash][ext]',
      },
    },
    {
      test: /\.md$/,
      type: 'asset/source',
    }
  );

  // Essential plugins
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.__NEXT_VERSION': JSON.stringify('14.2.15'),
      'process.env.__BUILD_ID': JSON.stringify(buildId || 'dev'),
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? 'css/[name]-[contenthash].css' : 'css/[name].css',
      chunkFilename: isProduction ? 'css/[name]-[contenthash].css' : 'css/[name].css',
    })
  );

  // Performance and source map settings
  config.performance = {
    hints: isProduction ? 'warning' : false,
    maxAssetSize: 300 * 1024,
    maxEntrypointSize: 300 * 1024,
  };

  // Return the modified config
  return config;
};
