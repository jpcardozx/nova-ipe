/**
 * Patch para corrigir erro "invalid relative URL" do Next.js
 * Específico para VS Code Simple Browser
 */

const originalParseRelativeUrl = require('next/dist/shared/lib/router/utils/parse-relative-url').parseRelativeUrl;

function parseRelativeUrlPatched(url) {
  // Log para debug
  console.log('[NEXT.JS PATCH] Processing URL:', url);
  
  // Se a URL for absoluta (contém http/https), extrair apenas o pathname
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      const urlObj = new URL(url);
      
      // Se contém parâmetros do VS Code Browser, retornar URL raiz
      if (urlObj.searchParams.has('vscodeBrowserReqId') || urlObj.searchParams.has('id')) {
        console.log('[NEXT.JS PATCH] VS Code browser request detected, redirecting to root');
        return originalParseRelativeUrl('/');
      }
      
      // Retorna apenas o pathname + search + hash
      const relativePath = urlObj.pathname + urlObj.search + urlObj.hash;
      console.log('[NEXT.JS PATCH] Converted absolute URL to relative:', relativePath);
      return originalParseRelativeUrl(relativePath);
    } catch (error) {
      console.warn('[NEXT.JS PATCH] Failed to parse absolute URL:', url, error);
      // Fallback para URL raiz
      return originalParseRelativeUrl('/');
    }
  }
  
  // Para URLs relativas, usar função original
  return originalParseRelativeUrl(url);
}

// Aplicar o patch
require.cache[require.resolve('next/dist/shared/lib/router/utils/parse-relative-url')].exports.parseRelativeUrl = parseRelativeUrlPatched;

console.log('[NEXT.JS PATCH] Applied parseRelativeUrl patch for VS Code compatibility');

module.exports = { parseRelativeUrlPatched };
