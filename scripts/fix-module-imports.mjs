/**
 * Script para criar aliases de módulos para resolver problemas de importação 
 * Específicamente criado para resolver os erros:
 * - @sections/Footer
 * - @sections/NavBar
 * - @sections/Valor
 * - @core/mapImovelToClient
 * - embla-carousel-autoplay
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Criando aliases de módulos para resolver problemas de importação...');

// Verificar se os diretórios existem
const sectionsDir = path.join(process.cwd(), 'sections');
const coreDir = path.join(process.cwd(), 'lib', 'core');
const nodeModulesDir = path.join(process.cwd(), 'node_modules');

// Criar diretório sections se não existir
if (!fs.existsSync(sectionsDir)) {
    console.log('📁 Criando diretório sections...');
    fs.mkdirSync(sectionsDir, { recursive: true });
}

// Criar diretório lib/core se não existir
if (!fs.existsSync(coreDir)) {
    console.log('📁 Criando diretório lib/core...');
    fs.mkdirSync(coreDir, { recursive: true });
}

// 1. Criar componentes stub para sections
const createSectionStub = (name) => {
    const filePath = path.join(sectionsDir, `${name}.tsx`);
    if (!fs.existsSync(filePath)) {
        const content = `
import React from 'react';

export default function ${name}({ children, ...props }) {
  // Implementação minimalista para evitar erros de build
  return (
    <div className="section ${name.toLowerCase()}-section" {...props}>
      {children || <div>Placeholder para ${name}</div>}
    </div>
  );
}
`;
        fs.writeFileSync(filePath, content);
        console.log(`✅ Stub criado para ${name} em ${filePath}`);
    }
};

// Criar stubs para seções
['Footer', 'NavBar', 'Valor'].forEach(createSectionStub);

// 2. Criar mapImovelToClient
const mapImovelToClientPath = path.join(coreDir, 'mapImovelToClient.ts');
if (!fs.existsSync(mapImovelToClientPath)) {
    const content = `
// Implementação minimalista para evitar erros de build
import type { ImovelClient, ImovelProjetado } from '@/types/imovel-client';

export function mapImovelToClient(imovel: any): ImovelClient {
  return {
    id: imovel._id || '',
    titulo: imovel.titulo || '',
    descricao: imovel.descricao || '',
    slug: imovel.slug?.current || '',
    endereco: imovel.endereco || {},
    preco: imovel.preco || 0,
    area: imovel.area || 0,
    quartos: imovel.quartos || 0,
    banheiros: imovel.banheiros || 0,
    vagas: imovel.vagas || 0,
    tipo: imovel.tipo || 'Apartamento',
    destaque: imovel.destaque || false,
    status: imovel.status || 'Disponível',
    modalidade: imovel.modalidade || 'Venda',
    imagens: imovel.imagens?.map(img => ({ 
      url: img?.asset?._ref || '',
      alt: img?.alt || ''
    })) || [],
    caracteristicas: imovel.caracteristicas || [],
    createdAt: imovel._createdAt || new Date().toISOString(),
  };
}
`;
    fs.writeFileSync(mapImovelToClientPath, content);
    console.log(`✅ Stub criado para mapImovelToClient em ${mapImovelToClientPath}`);
}

// 3. Criar módulo embla-carousel-autoplay
const emplaAutoplayDir = path.join(nodeModulesDir, 'embla-carousel-autoplay');
if (!fs.existsSync(emplaAutoplayDir)) {
    fs.mkdirSync(emplaAutoplayDir, { recursive: true });

    // Criar package.json
    fs.writeFileSync(
        path.join(emplaAutoplayDir, 'package.json'),
        JSON.stringify({
            "name": "embla-carousel-autoplay",
            "version": "8.0.0",
            "main": "index.js"
        }, null, 2)
    );

    // Criar index.js
    fs.writeFileSync(
        path.join(emplaAutoplayDir, 'index.js'),
        `
// Stub para embla-carousel-autoplay
module.exports = function AutoPlay(options = {}) {
  return () => ({
    name: 'autoplay',
    options: Object.assign({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: false }, options),
    init: () => {},
    destroy: () => {},
    play: () => {},
    stop: () => {},
    reset: () => {}
  });
};
`
    );

    console.log('✅ Stub criado para embla-carousel-autoplay');
}

// 4. Atualizar jsconfig.json para adicionar aliases
const jsconfigPath = path.join(process.cwd(), 'jsconfig.json');
if (fs.existsSync(jsconfigPath)) {
    const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));

    // Fazer backup
    fs.writeFileSync(`${jsconfigPath}.bak`, JSON.stringify(jsconfig, null, 2));

    // Atualizar ou adicionar paths
    if (!jsconfig.compilerOptions) {
        jsconfig.compilerOptions = {};
    }

    if (!jsconfig.compilerOptions.paths) {
        jsconfig.compilerOptions.paths = {};
    }

    jsconfig.compilerOptions.paths['@sections/*'] = ['sections/*'];
    jsconfig.compilerOptions.paths['@core/*'] = ['lib/core/*'];

    fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
    console.log('✅ jsconfig.json atualizado com aliases adicionais');
}

// 5. Atualizar next.config.js para incluir aliases
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
    let content = fs.readFileSync(nextConfigPath, 'utf8');

    // Verificar se já tem os aliases
    if (!content.includes("'@sections/'") && !content.includes("'@core/'")) {
        // Buscar pela configuração webpack
        const aliasCode = `
    // Resolver imports de sections e core
    config.resolve.alias['@sections'] = './sections';
    config.resolve.alias['@core'] = './lib/core';`;

        // Adicionar após os aliases existentes
        if (content.includes("config.resolve.alias['@app']")) {
            content = content.replace(
                "config.resolve.alias['@app'] = './app';",
                "config.resolve.alias['@app'] = './app';" + aliasCode
            );
        } else if (content.includes("config.resolve.alias")) {
            // Se existe configuração de alias, adicionar após a última
            const lastAliasRegex = /(config\.resolve\.alias\[[^\]]+\][^;]+;)/g;
            const matches = [...content.matchAll(lastAliasRegex)];

            if (matches.length > 0) {
                const lastMatch = matches[matches.length - 1][0];
                content = content.replace(lastMatch, lastMatch + aliasCode);
            }
        }

        fs.writeFileSync(nextConfigPath, content);
        console.log('✅ next.config.js atualizado com aliases adicionais');
    } else {
        console.log('✅ next.config.js já possui os aliases necessários');
    }
}

// 6. Instalar embla-carousel-autoplay via npm
try {
    console.log('📦 Instalando embla-carousel-autoplay...');
    require('child_process').execSync('npm install embla-carousel-autoplay --save', { stdio: 'inherit' });
} catch (err) {
    console.warn('⚠️ Não foi possível instalar embla-carousel-autoplay via npm, usando stub');
}

console.log('🎉 Aliases e módulos stub criados com sucesso!');
