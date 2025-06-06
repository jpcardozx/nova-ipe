// Test script to check for hydration issues
console.log('=== Hydration Test Starting ===');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
    console.log('✓ Running in browser environment');
    
    // Monitor for hydration errors
    const originalError = console.error;
    const hydrationErrors = [];
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('hydration') || message.includes('Hydration')) {
            hydrationErrors.push(message);
            console.log('❌ Hydration error detected:', message);
        }
        originalError.apply(console, args);
    };
    
    // Check DOM readiness
    if (document.readyState === 'loading') {
        console.log('⏳ Document still loading...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✓ DOM loaded');
        });
    } else {
        console.log('✓ DOM already loaded');
    }
    
    // Monitor for React hydration completion
    setTimeout(() => {
        const hydrationState = document.documentElement.getAttribute('data-loading-state');
        const hydrationClass = document.documentElement.classList.contains('hydrated');
        
        console.log('=== Hydration Status ===');
        console.log('Loading state:', hydrationState);
        console.log('Hydrated class:', hydrationClass);
        console.log('Hydration errors count:', hydrationErrors.length);
        
        if (hydrationErrors.length === 0) {
            console.log('🎉 No hydration errors detected!');
        } else {
            console.log('⚠️ Hydration errors found:', hydrationErrors);
        }
    }, 3000);
    
} else {
    console.log('Running in server environment');
}
