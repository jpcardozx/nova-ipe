/**
 * Webpack Patch para Next.js
 * 
 * Este arquivo contém ajustes específicos para o webpack que previnem
 * o erro "Cannot read properties of undefined (reading 'length')"
 * durante o build do Next.js.
 */

module.exports = function applyWebpackFixes(config) {
    // Certificar que tempos configurações de saída válidas
    config.output = config.output || {};

    // Usar globalThis em vez de self para compatibilidade
    config.output.globalObject = 'globalThis';

    // Adicionar salvaguardas para importações dinâmicas
    config.plugins = config.plugins || [];

    // Ignorar avisos comuns que não afetam a funcionalidade
    config.ignoreWarnings = [
        { message: /Critical dependency: require function is used/ },
        { message: /Critical dependency: the request of a dependency is an expression/ },
        { message: /Failed to parse source map/ }
    ];

    // Garantir que a divisão de código funcione corretamente
    if (config.optimization && config.optimization.splitChunks) {
        config.optimization.splitChunks = {
            chunks: 'all',
            name: false, // Use automatic naming to prevent runtime errors
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        };
    }

    // Add specific fixes for webpack runtime errors
    config.plugins = config.plugins || [];
    const webpack = require('webpack');
    
    // Prevent runtime errors with undefined arrays
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.__NEXT_RUNTIME_CONFIG': JSON.stringify({}),
        })
    );

    // Ensure proper module resolution
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
    };

    // Garantir que o código ainda possa ser debugado
    if (config.optimization) {
        config.optimization.moduleIds = 'named';
    }

    return config;
}
