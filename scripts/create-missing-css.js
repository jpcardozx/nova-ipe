// scripts/create-missing-css.js
/**
 * Script para criar arquivos CSS faltantes no projeto Nova Ipê
 */

const fs = require('fs');
const path = require('path');
// Usando cores nativas do terminal em vez de chalk
const colors = {
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`
};

console.log(colors.cyan('\n🎨 CRIAÇÃO DE ARQUIVOS CSS FALTANTES'));
console.log(colors.cyan('====================================\n'));

const rootDir = path.join(__dirname, '..');

// Arquivos CSS para verificar/criar
const cssFiles = [
    {
        path: 'app/styles/critical/critical.css',
        content: `/**
 * critical.css - Estilos críticos para renderização inicial
 * 
 * Contém estilos essenciais para o carregamento inicial da página,
 * otimizações de CLS e configurações de performance.
 * Esse arquivo é carregado antes dos outros estilos.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Configurações de carregamento para fontes */
html {
  font-display: optional;
}

/* Indicador de carregamento na parte superior da página */
html[data-loading-state="loading"]:before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-brand-green);
  animation: loading-indicator 1s infinite ease-in-out;
  z-index: 9999;
}

@keyframes loading-indicator {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Otimizações de imagem para melhorar LCP */
img, svg {
  max-width: 100%;
  height: auto;
}

/* Estilos de layout críticos */
main {
  display: block;
  width: 100%;
}

.container-ipe {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Componentes críticos - cards de propriedade */
.property-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.375rem;
  overflow: hidden;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-image-container {
  position: relative;
  padding-bottom: 66%;
  overflow: hidden;
}

.property-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}`
    },
    {
        path: 'app/styles/cls-optimizations.css',
        content: `/**
 * cls-optimizations.css - Otimizações para Cumulative Layout Shift
 * 
 * Contém estilos específicos para minimizar mudanças de layout durante
 * o carregamento da página e melhorar o score de CLS.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Preservação de espaço para imagens */
.aspect-ratio-box {
  position: relative;
  height: 0;
  overflow: hidden;
}

.aspect-ratio-box-16-9 {
  padding-top: 56.25%; /* 16:9 */
}

.aspect-ratio-box-4-3 {
  padding-top: 75%; /* 4:3 */
}

.aspect-ratio-box-1-1 {
  padding-top: 100%; /* 1:1 */
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Reserva de espaço para carregamento de fontes */
.font-size-guard {
  max-height: 999999px; /* Previne ajustes de linha causados por carregamento de fontes */
}

/* Placeholders para conteúdo dinâmico */
.placeholder-rect {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

/* Placeholders para conteúdo de texto */
.placeholder-text {
  display: inline-block;
  width: 100%;
  height: 1em;
  background-color: #f0f0f0;
  border-radius: 0.25rem;
}

/* Espaço reservado para componentes de UI que carregam assincronamente */
[data-ui-component] {
  min-height: 1.5rem;
}`
    },
    {
        path: 'app/styles/tailwind-compat.css',
        content: `/**
 * tailwind-compat.css - Compatibilidade com Tailwind
 * 
 * Garante que nossos componentes personalizados são compatíveis
 * com classes do Tailwind e estabelece regras de prioridade.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Compatibilidade com Tailwind para componentes personalizados */
:root {
  --tw-content: '';
}

/* Permitir uso das variáveis do tema com classes Tailwind */
.text-brand-green {
  color: var(--color-brand-green) !important;
}

.text-brand-dark {
  color: var(--color-brand-dark) !important;
}

.text-brand-light {
  color: var(--color-brand-light) !important;
}

.bg-brand-green {
  background-color: var(--color-brand-green) !important;
}

.bg-brand-dark {
  background-color: var(--color-brand-dark) !important;
}

.bg-brand-light {
  background-color: var(--color-brand-light) !important;
}

/* Configurações para border-radius consistente */
.rounded-ipe {
  border-radius: 0.375rem !important;
}

.rounded-ipe-lg {
  border-radius: 0.5rem !important;
}

/* Animações compatíveis */
.animate-ipe-fade {
  animation: ipe-fade 0.3s ease-in-out;
}

@keyframes ipe-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Compatibilidade de sombras */
.shadow-ipe {
  box-shadow: var(--shadow-default) !important;
}

.shadow-ipe-lg {
  box-shadow: var(--shadow-lg) !important;
}`
    },
    {
        path: 'app/cls-prevention.css',
        content: `/**
 * cls-prevention.css - Prevenção adicional de CLS
 * 
 * Estilos complementares para evitar mudanças de layout
 * durante o carregamento e interação do usuário.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Prevenir saltos quando a scrollbar aparece/desaparece */
html {
  overflow-y: scroll;
}

/* Espaço reservado para imagens enquanto carregam */
img:not([src]), img[src=""] {
  visibility: hidden;
  min-height: 1px; /* Impede colapso */
}

/* Manter altura mínima em contêineres de imóveis */
.property-card-container {
  min-height: 350px;
}

/* Manter proporções em galerias de imagens */
.gallery-item {
  aspect-ratio: 4/3;
}

/* Prevenir colapso em elementos que carregam assincronamente */
[data-loading] {
  min-height: 1.5rem;
}

/* Prevenir movimentos ao carregar botões com ícones */
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-with-icon > *:first-child {
  margin-right: 0.5rem;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}`
    }
];

// Criar diretórios necessários e os arquivos
cssFiles.forEach(file => {
    const fullPath = path.join(rootDir, file.path);
    const dirPath = path.dirname(fullPath);

    // Verificar se já existe
    if (fs.existsSync(fullPath)) {
        console.log(chalk.blue(`ℹ️ Arquivo já existe: ${file.path}`));
        return;
    }

    // Criar diretório se necessário
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(chalk.green(`✅ Diretório criado: ${path.relative(rootDir, dirPath)}`));
        } catch (err) {
            console.error(chalk.red(`❌ Erro ao criar diretório: ${path.relative(rootDir, dirPath)}`));
            console.error(err);
            return;
        }
    }

    // Criar arquivo
    try {
        fs.writeFileSync(fullPath, file.content);
        console.log(chalk.green(`✅ Arquivo criado: ${file.path}`));
    } catch (err) {
        console.error(chalk.red(`❌ Erro ao criar arquivo: ${file.path}`));
        console.error(err);
    }
});

// Corrigir importações no globals.css
const globalsPath = path.join(rootDir, 'app/globals.css');
if (fs.existsSync(globalsPath)) {
    try {
        let content = fs.readFileSync(globalsPath, 'utf8');

        // Procurar pelo padrão de importação
        const importPattern = /\/\* Importações críticas para evitar CLS e garantir LCP otimizado \*\/\s*(@import [^;]+;[\s\n]*)+/;

        const requiredImports = `/* Importações críticas para evitar CLS e garantir LCP otimizado */
@import "styles/critical/critical.css";
@import "styles/cls-optimizations.css";
@import "styles/tailwind-compat.css";
@import "./cls-prevention.css"; /* Novas otimizações para prevenir CLS */`;

        if (importPattern.test(content)) {
            // Substituir seção existente
            content = content.replace(importPattern, requiredImports);
            console.log(chalk.blue(`ℹ️ Importações atualizadas em globals.css`));
        } else {
            // Verificar se há alguma seção de importação simples
            const tailwindImport = /@tailwind utilities;/;
            if (tailwindImport.test(content)) {
                content = content.replace(tailwindImport, '@tailwind utilities;\n\n' + requiredImports);
                console.log(chalk.green(`✅ Importações adicionadas em globals.css após utilities`));
            } else {
                console.log(chalk.yellow(`⚠️ Padrão de importação não encontrado em globals.css`));
                console.log(chalk.yellow(`⚠️ Adicione manualmente as importações necessárias`));
            }
        }

        // Salvar alterações
        fs.writeFileSync(globalsPath, content);
    } catch (err) {
        console.error(chalk.red(`❌ Erro ao atualizar globals.css`));
        console.error(err);
    }
} else {
    console.log(chalk.red(`❌ Arquivo globals.css não encontrado`));
}

console.log(chalk.green('\n✨ Processo concluído!'));
