/**
 * Script para criar um override no processamento CSS do Next.js
 * Este script cria uma versão minimalista do processador CSS do Next.js
 * para evitar problemas com o autoprefixer
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Criando override para processamento CSS do Next.js...');

// Caminho para o diretório do Next.js
const nextDir = path.join(process.cwd(), 'node_modules', 'next');
if (!fs.existsSync(nextDir)) {
    console.error('❌ Diretório do Next.js não encontrado');
    process.exit(1);
}

// Caminhos para os arquivos de configuração CSS do Next.js
const cssConfigPath = path.join(nextDir, 'dist', 'build', 'webpack', 'config', 'blocks', 'css');
if (!fs.existsSync(cssConfigPath)) {
    console.error('❌ Diretório de configuração CSS do Next.js não encontrado');
    process.exit(1);
}

// Arquivo de plugins
const pluginsPath = path.join(cssConfigPath, 'plugins.js');
if (!fs.existsSync(pluginsPath)) {
    console.error('❌ Arquivo de plugins CSS não encontrado');
    process.exit(1);
}

// Criar backup
const backupPath = `${pluginsPath}.bak`;
if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(pluginsPath, backupPath);
    console.log('✅ Backup do arquivo de plugins criado');
}

// Substituir o conteúdo com uma implementação simplificada
const simplifiedPlugins = `
// Plugins simplificados para evitar problemas de resolução com autoprefixer
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPostCssPlugins = getPostCssPlugins;

// Implementação simplificada do getPostCssPlugins
function getPostCssPlugins(ctx) {
  console.log('[Next.js CSS] Usando implementação simplificada de plugins PostCSS');
  
  const customPlugins = [];
  
  // Implementação minimalista do Tailwind CSS
  const tailwindPlugin = {
    postcssPlugin: 'tailwindcss',
    Once(root) { return root; }
  };
  
  // Implementação minimalista do Autoprefixer
  const autoprefixerPlugin = {
    postcssPlugin: 'autoprefixer',
    Once(root) { return root; }
  };
  
  // Função para tentar carregar os plugins reais, mas com fallback
  function safeRequire(name) {
    try {
      return require(name);
    } catch (err) {
      console.warn(\`[Next.js CSS] Não foi possível carregar \${name}, usando implementação minimalista\`);
      if (name === 'tailwindcss') {
        return () => tailwindPlugin;
      } else if (name === 'autoprefixer') {
        return () => autoprefixerPlugin;
      }
      return () => ({});
    }
  }
  
  // Tentar carregar a configuração do PostCSS do projeto
  try {
    const resolvedPostCssConfig = require('postcss-load-config');
    const filePath = path.join(process.cwd(), 'postcss.config.js');
    
    if (fs.existsSync(filePath)) {
      try {
        const projectPostCssConfig = require(filePath);
        if (typeof projectPostCssConfig === 'object' && projectPostCssConfig.plugins) {
          console.log('[Next.js CSS] Usando configuração PostCSS do projeto');
          return projectPostCssConfig.plugins;
        }
      } catch (e) {
        console.warn('[Next.js CSS] Erro ao carregar configuração PostCSS:', e.message);
      }
    }
  } catch (e) {
    // Ignorar erros na tentativa de carregar a configuração
  }
  
  // Adicionar plugins padrão
  customPlugins.push(safeRequire('tailwindcss')());
  customPlugins.push(safeRequire('autoprefixer')());
  
  return customPlugins;
}
`;

// Escrever o arquivo modificado
fs.writeFileSync(pluginsPath, simplifiedPlugins);
console.log('✅ Arquivo de plugins CSS do Next.js modificado');

console.log('🎉 Override para processamento CSS do Next.js criado com sucesso!');
