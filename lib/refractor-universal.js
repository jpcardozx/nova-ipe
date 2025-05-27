/**
 * Refractor Language Loader Universal - SIMPLIFIED
 * 
 * Versão simplificada que evita problemas de import e build.
 * Usa apenas refractor básico sem linguagens específicas.
 */

// Importação simplificada que funciona com next.js
import { refractor } from 'refractor';

// Exporta o refractor configurado
export { refractor as default };

// Exporta uma função para realce de sintaxe segura
export const highlightSafely = (code, language = 'javascript') => {
  try {
    // Verifica se a linguagem está registrada
    if (refractor.registered(language)) {
      return refractor.highlight(code, language);
    } else {
      // Fallback para texto simples
      return [{
        type: 'text',
        value: code
      }];
    }
  } catch (error) {
    console.warn(`Failed to highlight code with language ${language}:`, error);
    // Retorna o código sem destaque em caso de erro
    return [{
      type: 'text',
      value: code
    }];
  }
};
