/**
 * Implementação de fallback do autoprefixer
 * Para usar quando o módulo original não está disponível
 */

'use strict';

// Implementação minimalista do autoprefixer
function autoprefixer(options) {
    options = options || {};

    return {
        postcssPlugin: 'autoprefixer',
        Once(root) {
            // Não faz nada, apenas retorna a raiz CSS sem modificações
            return root;
        },
        info() {
            return { browsers: [] };
        }
    };
}

// Configurações necessárias para o PostCSS
autoprefixer.postcss = true;

module.exports = autoprefixer;
