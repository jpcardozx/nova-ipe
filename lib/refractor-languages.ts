/**
 * Refractor Language Preloader
 * 
 * Este arquivo importa explicitamente todas as linguagens do refractor
 * que são utilizadas pelo Sanity, evitando erros em tempo de build.
 */

// Linguagens essenciais requeridas pelo Sanity
import 'refractor/lang/bash.js';
import 'refractor/lang/javascript.js';
import 'refractor/lang/json.js';
import 'refractor/lang/jsx.js';
import 'refractor/lang/typescript.js';

// Linguagens adicionais úteis
import 'refractor/lang/tsx.js';
import 'refractor/lang/css.js';
import 'refractor/lang/markdown.js';
import 'refractor/lang/yaml.js';
import 'refractor/lang/php.js';
import 'refractor/lang/python.js';

export const AVAILABLE_LANGUAGES = [
  'bash',
  'javascript',
  'json',
  'jsx',
  'typescript',
  'tsx',
  'css',
  'markdown',
  'yaml',
  'php',
  'python'
];

// Função helper para verificar se uma linguagem está disponível
export function isLanguageAvailable(lang: string): boolean {
  return AVAILABLE_LANGUAGES.includes(lang);
}
