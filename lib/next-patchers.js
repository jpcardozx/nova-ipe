/**
 * Patch para corrigir o erro "Cannot destructure property 'protocol' of 'window.location' as it is undefined"
 * Este patch monta um mock específico para a função getLocationOrigin usada pelo Next.js
 */

// O arquivo original no Next.js está em:
// node_modules/next/dist/shared/lib/utils.js e node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js

if (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'nodejs') {
  // Somente executar no servidor
  
  // Patch para utils.js
  try {
    const nextUtils = require('next/dist/shared/lib/utils');
    
    // Patching getLocationOrigin
    if (nextUtils && nextUtils.getLocationOrigin) {
      const originalGetLocationOrigin = nextUtils.getLocationOrigin;
      
      // Substituir pela versão que funciona sem window
      nextUtils.getLocationOrigin = function patchedGetLocationOrigin() {
        try {
          return originalGetLocationOrigin();
        } catch (e) {
          // Fallback quando window não está disponível
          return 'http://localhost:3001';
        }
      };
      
      console.log('✅ Next.js getLocationOrigin patched successfully');
    }
  } catch (e) {
    console.warn('Failed to patch Next.js utils:', e.message);
  }
  
  // Patch para parse-relative-url.js
  try {
    const parseRelativeUrl = require('next/dist/shared/lib/router/utils/parse-relative-url');
    
    if (parseRelativeUrl && parseRelativeUrl.parseRelativeUrl) {
      const originalParseRelativeUrl = parseRelativeUrl.parseRelativeUrl;
      
      // Substituir pela versão que não depende de window.location
      parseRelativeUrl.parseRelativeUrl = function patchedParseRelativeUrl(url) {
        try {
          return originalParseRelativeUrl(url);
        } catch (e) {
          // Implementação básica que não depende de window.location
          const parsedURL = new URL(url, 'http://localhost:3001');
          return {
            pathname: parsedURL.pathname,
            query: Object.fromEntries(parsedURL.searchParams),
            search: parsedURL.search,
            hash: parsedURL.hash,
            href: parsedURL.href
          };
        }
      };
      
      console.log('✅ Next.js parseRelativeUrl patched successfully');
    }
  } catch (e) {
    console.warn('Failed to patch Next.js parseRelativeUrl:', e.message);
  }
}

// Exportar um objeto vazio para que possa ser importado
module.exports = {};
