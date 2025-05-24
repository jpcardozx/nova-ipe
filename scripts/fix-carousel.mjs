// @ts-check
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixCarousel() {
    console.log('🔧 Applying fixes to OptimizedCarousel.tsx...');

    const carouselPath = join(process.cwd(), 'app', 'components', 'ui', 'OptimizedCarousel.tsx');

    try {
        const content = await readFile(carouselPath, 'utf-8');

        // Apply fixes
        const fixedContent = content
            // Fix imports
            .replace(
                'import Autoplay from "embla-carousel-autoplay";',
                `import type { CreatePluginType } from 'embla-carousel';
import type { AutoplayOptionsType } from 'embla-carousel-autoplay';

// Define autoplay variable that will be lazily loaded
let Autoplay: any | undefined;`
            )
            // Add dynamic import
            .replace(
                'type CarouselOptions',
                `type CarouselOptions = OptimizedCarouselProps<unknown>['options'];

// Initialize autoplay plugin on client side
if (typeof window !== 'undefined') {
    import('embla-carousel-autoplay').then((mod) => {
        Autoplay = mod.default;
    });
}

// Helper function to get plugins based on options
function getPlugins(options: CarouselOptions = {}): CreatePluginType<LoosePluginType, Record<string, unknown>>[] {`
            )
            // Update plugin initialization
            .replace(
                'if (!options.autoplay) {',
                'if (!options.autoplay || !Autoplay) {'
            );

        await writeFile(carouselPath, fixedContent, 'utf-8');
        console.log('✅ Successfully applied fixes to OptimizedCarousel.tsx');

    } catch (error) {
        console.error('❌ Error fixing carousel:', error);
        process.exit(1);
    }
}

// Run the fix
fixCarousel();
