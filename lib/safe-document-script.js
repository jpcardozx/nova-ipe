/**
 * Safe Document Script
 * 
 * Este script é importado como um módulo separado para evitar problemas
 * de webpack com execução de código client-side durante o build do Next.js.
 */

export const safeBrowserScript = `
(function() {
  // Optimize event listeners for better FID
  if (typeof document !== 'undefined') {
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // Set initial loading state
    document.documentElement.setAttribute('data-loading-state', 'loading');
  }
  
  // Performance mark for initial document processing
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark('document-start');
  }
})();
`;
