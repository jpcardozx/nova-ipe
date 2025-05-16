// layout-styles.tsx - Centralized imports for all layout styles
// Import this single file in layout.tsx instead of multiple <link> tags

import './globals.css';
import './cls-optimizations.css';

// Import critical CSS files
import '../public/critical-speed.css';
import '../public/critical.css';

// Import optimizations CSS files
import '../public/styles/mobile-optimizations.css';
import '../public/styles/loading-fix.css';
import '../public/styles/loading-states.css';
import '../public/styles/loading-effects.css';

export default function LayoutStyles() {
  return null;
}
