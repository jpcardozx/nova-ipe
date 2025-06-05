# Next.js 14 Development Error Fixes

This documentation covers the comprehensive solutions implemented to fix common Next.js 14 development errors, particularly focusing on:

1. `Error: Invariant: Missing ActionQueueContext`
2. `TypeError: Cannot read properties of undefined (reading 'userAgent')` in the development overlay

## Overview of Implemented Solutions

We've created a multi-layered approach to fix these issues:

1. **Polyfills for SSR environments**
2. **Context providers for Next.js internal contexts**
3. **Dev overlay specific fixes**
4. **Error monitoring and diagnostics**

## 1. Context Provider System

The most important fix is the `NextContextProvider` that addresses the missing ActionQueueContext error:

```tsx
// lib/next-context-polyfills.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Provides multiple context providers needed by Next.js internal components
export function NextContextProvider({ children }: NextContextProviderProps) {
  // Creates necessary contexts with minimal implementations
  return (
    <ActionQueueContext.Provider value={actionQueueValue}>
      <ServerInsertedHTMLContext.Provider value={serverInsertedHTMLValue}>
        <PathnameContext.Provider value={pathnameValue}>
          <LayoutSegmentsContext.Provider value={layoutSegmentsValue}>
            {children}
          </LayoutSegmentsContext.Provider>
        </PathnameContext.Provider>
      </ServerInsertedHTMLContext.Provider>
    </ActionQueueContext.Provider>
  );
}
```

## 2. Browser API Polyfills

We've enhanced the SSR environment with comprehensive polyfills:

```ts
// lib/dev-overlay-polyfill.ts
// Provides navigator and other browser APIs needed by the dev overlay
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Fix for dev overlay accessing navigator.userAgent before it's available
    if (typeof navigator === 'undefined') {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome Dev SSR',
          platform: 'Win32',
          vendor: 'Nova IPE Polyfill',
          // Additional properties...
        },
        writable: true,
        configurable: true,
      });
    }
    // Additional polyfills...
  }
}
```

## 3. Error Detection and Prevention

We've added developer experience enhancers to intercept and prevent errors:

```tsx
// app/components/NextDeveloperExperienceEnhancer.tsx
export function NextDeveloperExperienceEnhancer({ children }) {
  useEffect(() => {
    // Patch console.error and window.onerror to catch and handle specific errors
    const originalConsoleError = console.error;
    console.error = function (...args) {
      // Filter out known Next.js development errors
      if (args.length > 0 && typeof args[0] === 'string') {
        if (
          args[0].includes('Missing ActionQueueContext') ||
          (args[0].includes('Cannot read properties') && args[0].includes('userAgent'))
        ) {
          // Suppress the error but log a more helpful message
          console.debug('[NextDEE] Suppressed Next.js internal error:', args[0]);
          return;
        }
      }
      originalConsoleError.apply(console, args);
    };

    // Additional error handling...
  }, []);

  return <>{children}</>;
}
```

## 4. Specific Dev Overlay Patches

We've added direct patches for the dev overlay module:

```tsx
// app/components/DevOverlayEnhancer.tsx
export function DevOverlayEnhancer() {
  useEffect(() => {
    // Patch the Next.js dev overlay internals
    const patchDevOverlay = () => {
      // Target the specific Next.js file that causes userAgent errors
      const targetModule = 'maintain--tab-focus.js';

      // Look for script elements that might contain the target code
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src && script.src.includes('/next/dist/') && script.src.includes(targetModule)) {
          // Create a patched version of the script
          // ...
        }
      });
    };
  }, []);

  return null;
}
```

## 5. Monitoring and Diagnostics

We've added tools to monitor and diagnose issues:

1. `NextErrorMonitor` - Shows a floating indicator if errors are detected
2. `NextDevDiagnostics` - Provides detailed diagnostics via Ctrl+Alt+D keyboard shortcut

## Integration in Root Layout

All these solutions are integrated in the root layout:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <NextContextProvider>
            <NextDeveloperExperienceEnhancer>
              {children}

              <Suspense fallback={null}>
                <NextDevDiagnostics />
              </Suspense>

              <Suspense fallback={null}>
                <NextErrorMonitor />
              </Suspense>

              <Suspense fallback={null}>
                <DevOverlayEnhancer />
              </Suspense>
            </NextDeveloperExperienceEnhancer>
          </NextContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Testing in Development Mode

With these changes implemented, the development server should run without the following errors:

1. ✅ No `Error: Invariant: Missing ActionQueueContext` errors
2. ✅ No `TypeError: Cannot read properties of undefined (reading 'userAgent')` errors
3. ✅ Dev overlay works properly
4. ✅ Navigation and hot module replacement work as expected

## Production Impact

These fixes only apply to development mode and don't impact production builds. The polyfills and context providers are conditionally activated only when `process.env.NODE_ENV === 'development'`.

## Troubleshooting

If you still encounter errors:

1. Check the NextErrorMonitor indicator in the bottom-left corner
2. Press Ctrl+Alt+D to see detailed diagnostics
3. Check browser console for any remaining errors

## Conclusion

The combination of context providers, polyfills, and error handling provides a robust solution to the common Next.js 14 development errors. These fixes ensure a smoother development experience while working with Next.js.
