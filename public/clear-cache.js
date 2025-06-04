// Cache clearing utility for development
// This script helps clear all service worker caches when ports change

(function() {
    console.log('🧹 Starting cache cleanup...');
    
    async function clearAllCaches() {
        try {
            // 1. Clear all browser caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                console.log('Found caches:', cacheNames);
                
                await Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
                console.log('✅ All browser caches cleared');
            }
            
            // 2. Unregister all service workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                console.log('Found service worker registrations:', registrations.length);
                
                await Promise.all(
                    registrations.map(registration => {
                        console.log('Unregistering service worker:', registration.scope);
                        return registration.unregister();
                    })
                );
                console.log('✅ All service workers unregistered');
            }
            
            // 3. Clear localStorage and sessionStorage
            if (typeof Storage !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                console.log('✅ Local and session storage cleared');
            }
            
            console.log('🎉 Cache cleanup completed! Reloading page...');
            
            // 4. Force reload without cache
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error during cache cleanup:', error);
        }
    }
    
    // Auto-run if called directly
    if (window.location.search.includes('clear-cache=true')) {
        clearAllCaches();
    } else {
        // Expose function globally for manual use
        window.clearAllCaches = clearAllCaches;
        console.log('💡 Run clearAllCaches() to clear all caches, or add ?clear-cache=true to URL');
    }
})();
