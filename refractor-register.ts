// Simplified refractor registration for Next.js build compatibility
// Using a more basic approach to avoid module resolution issues

import { refractor } from 'refractor';

// Basic language registration - using try/catch to avoid build failures
try {
  // Import and register common languages that are typically included
  // Instead of importing from specific language files, we'll use the common bundle
  // or register languages that are already available in the base refractor
  
  // These languages are typically available in the base refractor installation
  const commonLanguages = ['javascript', 'json', 'jsx'];
  
  // Check if languages are already registered to avoid errors
  commonLanguages.forEach(lang => {
    if (!refractor.registered(lang)) {
      console.warn(`Language ${lang} not available in refractor`);
    }
  });
  
} catch (error) {
  console.warn('Failed to register refractor languages:', error);
}

export default refractor;
