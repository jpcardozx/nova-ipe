/**
 * Refractor Language Registry
 * 
 * Este módulo centraliza o registro de todas as linguagens do refractor,
 * garantindo que elas sejam carregadas corretamente e estejam disponíveis
 * para o Sanity e outros componentes.
 */

import refractor from 'refractor/core';

// Importação de todas as linguagens necessárias
import javascript from 'refractor/lang/javascript';
import typescript from 'refractor/lang/typescript';
import json from 'refractor/lang/json';
import jsx from 'refractor/lang/jsx';
import tsx from 'refractor/lang/tsx';
import css from 'refractor/lang/css';
import markdown from 'refractor/lang/markdown';
import bash from 'refractor/lang/bash';
import diff from 'refractor/lang/diff';
import html from 'refractor/lang/markup';
import yaml from 'refractor/lang/yaml';
import sql from 'refractor/lang/sql';

// Criação de um mapa de linguagens indexado por nome
const languageMap = {
  javascript,
  typescript,
  json,
  jsx,
  tsx,
  css,
  markdown,
  bash,
  diff,
  html,
  yaml,
  sql,
  // Importante: Adicionar esse alias para resolver o problema de 'lang.js'
  lang: javascript
};

// Função segura para registro das linguagens
const registerLanguages = () => {
  try {
    // Registra todas as linguagens com o refractor
    Object.values(languageMap).forEach(lang => {
      if (lang && typeof lang === 'object') {
        try {
          refractor.register(lang);
          console.log(`✅ Registrada linguagem refractor: ${lang.displayName || 'desconhecida'}`);
        } catch (err) {
          // Se a linguagem já estiver registrada, isso não é um problema
          if (!err.message.includes('already registered')) {
            console.warn(`⚠️ Erro ao registrar linguagem: ${err.message}`);
          }
        }
      }
    });
    console.log('🔄 Todas as linguagens refractor foram registradas');
  } catch (error) {
    console.error('❌ Erro crítico no registro de linguagens refractor:', error);
  }
};

// Registra as linguagens ao importar este módulo
registerLanguages();

// Exporta o refractor com as linguagens registradas
export default refractor;

// Exporta o mapa de linguagens e funções individuais
export { languageMap, registerLanguages };

// Re-exporta todas as linguagens individualmente
export { 
  javascript,
  typescript,
  json,
  jsx,
  tsx,
  css,
  markdown,
  bash,
  diff,
  html,
  yaml,
  sql
};
