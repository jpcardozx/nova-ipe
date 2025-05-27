/**
 * Refractor Lang Index Fallback - ULTRA SIMPLIFIED
 * 
 * Este arquivo resolve o problema específico com imports para 'refractor/lang/lang.js'
 * redirecionando para o módulo javascript.js que existe de fato.
 */

// Importa e re-exporta o módulo javascript como fallback para 'lang.js'
module.exports = require('refractor/lang/javascript.js');
