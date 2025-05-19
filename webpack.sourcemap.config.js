/**
 * webpack.sourcemap.config.js
 * 
 * Configuração auxiliar para lidar com source maps durante o build do Next.js.
 * Este arquivo é utilizado para resolver problemas com arquivos .map do lucide-react.
 * 
 * @date 19/05/2025
 */

module.exports = {
    /**
     * Aplicar configuração de ignore para source maps
     * @param {Object} config - Configuração do webpack
     * @returns {Object} - Configuração atualizada
     */
    applySourceMapIgnore: (config) => {
        // Ignorar arquivos .map para evitar erros de parse
        config.module.rules.push({
            test: /\.js\.map$/,
            enforce: 'pre',
            use: ['ignore-loader'],
        });

        config.module.rules.push({
            test: /\.map$/,
            use: 'ignore-loader',
        });        // Ignorar especificamente source maps do lucide-react
        config.module.rules.push({
            test: /[\\/]node_modules[\\/]lucide-react[\\/].*\.map$/,
            use: 'ignore-loader',
        });

        // Técnica avançada: substitui importações problemáticas de source maps no webpack
        config.module.rules.push({
            test: /lucide-react\/dist\/esm\/icons\/.*\.js$/,
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        search: /\/\/# sourceMappingURL=.*\.map/g,
                        replace: '// sourcemap removed by build process',
                    },
                },
            ],
        });

        return config;
    }
};
