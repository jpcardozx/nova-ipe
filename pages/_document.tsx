/**
 * Optimized Document Layout for NextJS
 * 
 * This Document component includes advanced optimizations to improve:
 * 1. First Contentful Paint (FCP)
 * 2. Largest Contentful Paint (LCP) 
 * 3. First Input Delay (FID)
 * 4. Cumulative Layout Shift (CLS)
 */

import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

class OptimizedDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="pt-BR">
                <Head>
                    {/* Preconnect to critical domains */}
                    <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                    {/* Critical fonts preload */}
                    <link
                        rel="preload"
                        href="/fonts/montserrat-latin-wght-normal.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />

                    {/* Preload critical images */}
                    <link
                        rel="preload"
                        href="/images/hero-background.webp"
                        as="image"
                        type="image/webp"
                    />

                    {/* Critical inline CSS for above-the-fold content */}
                    <style
                        id="critical-css"
                        dangerouslySetInnerHTML={{
                            __html: `
                :root {
                  --color-primary: #003049;
                  --color-secondary: #f59e0b;
                  --font-sans: 'Montserrat', system-ui, sans-serif;
                }
                body {
                  margin: 0;
                  font-family: var(--font-sans);
                  -webkit-text-size-adjust: 100%;
                  -webkit-font-smoothing: antialiased;
                }
                .body-initial-state {
                  background-color: #ffffff;
                  color: #111827;
                }
                .body-visible {
                  opacity: 1;
                  transition: opacity 0.1s ease-in-out;
                }
                [data-optimize-lcp="true"] {
                  content-visibility: auto;
                  contain-intrinsic-size: 0 500px;
                }
                @media (prefers-reduced-motion) {
                  *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                  }
                }
              `
                        }}
                    />

                    {/* Optimization for FID - load touchevents early */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                (function() {
                  // Optimize event listeners for better FID
                  document.addEventListener('touchstart', function() {}, {passive: true});
                  document.addEventListener('touchmove', function() {}, {passive: true});
                  
                  // Set initial loading state
                  document.documentElement.setAttribute('data-loading-state', 'loading');
                  
                  // Performance mark for initial document processing
                  if (window.performance && window.performance.mark) {
                    window.performance.mark('document-start');
                  }
                })();
              `
                        }}
                    />
                </Head>
                <body className="body-initial-state">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default OptimizedDocument;
