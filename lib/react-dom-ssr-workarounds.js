/**
 * Este arquivo contém workarounds específicos para problemas com React DOM
 * no contexto de Server-Side Rendering (SSR) do Next.js
 */

if (typeof window === 'undefined') {
  // Simulamos o comportamento do Element.prototype.setAttribute para
  // evitar erros durante o SSR
  module.exports = {
    setupReactDOMWorkarounds: function() {
      try {
        // Overriding isEventSupported function in react-dom
        const reactDOM = require('react-dom');
        
        // Only override if it's the development version with accessible internals
        if (reactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
          const originalIsEventSupported = 
            reactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events?.isEventSupported;
            
          if (originalIsEventSupported) {
            // Replace with a safe version for SSR
            reactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events.isEventSupported = 
              function safeIsEventSupported() {
                // Always return false during SSR to bypass DOM checks
                return false;
              };
            
            console.log('✅ React DOM event support function patched for SSR');
          }
        }
        
      } catch (error) {
        console.warn('⚠️ Failed to apply React DOM SSR workarounds:', error.message);
      }
    }
  };
} else {
  // No-op for browser environment
  module.exports = {
    setupReactDOMWorkarounds: function() {}
  };
}
