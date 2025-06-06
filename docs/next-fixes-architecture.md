# Next.js Fixes Architecture

> Documentation for the consolidated Next.js hydration and webpack fixes  
> Last Updated: May 30, 2025

## Overview

This document describes the architecture of our Next.js fixes that resolve critical hydration and webpack issues in the Nova Ipê application. The solution has been carefully restructured to follow best practices, improve maintainability, and ensure long-term stability.

## Directory Structure

The solution is organized in a modular structure under the `core/next-fixes` directory:

```
core/next-fixes/
├── index.js                   # Main entry point
├── polyfills/
│   └── browser-polyfills.js   # SSR browser globals
├── plugins/
│   ├── webpack-factory-fix.js # Webpack factory fix plugin
│   └── minimal-ssr-plugin.js  # Minimal SSR plugin
└── utils/
    ├── next-patcher.js        # Patches for Next.js files
    └── verify.js              # Verification utility
```

## Key Components

### 1. Browser Polyfills (`polyfills/browser-polyfills.js`)

Provides essential browser globals during server-side rendering (SSR):

- `window`, `document`, `localStorage`, `sessionStorage`
- `location` with all required properties
- HTML Element classes and DOM methods
- `navigator` and `matchMedia` APIs

These polyfills prevent errors that occur when client-side code is executed in the Node.js environment during SSR.

### 2. Webpack Factory Fix Plugin (`plugins/webpack-factory-fix.js`)

Prevents the critical webpack error: "Cannot read properties of undefined (reading 'call')":

- Adds safety wrappers around webpack's factory calls
- Protects specific problematic modules (error components, next-themes)
- Handles compatibility with different webpack versions

### 3. Minimal SSR Plugin (`plugins/minimal-ssr-plugin.js`)

A safe, minimal webpack plugin that:

- Initializes the SSR environment correctly
- Doesn't cause compatibility issues with other plugins
- Has minimal impact on the webpack build process

### 4. Next.js Patcher (`utils/next-patcher.js`)

Applies patches to Next.js core files to fix:

- "Cannot destructure property 'protocol' of 'window.location'"
- Issues with URL parsing during SSR
- Other Next.js internal errors

### 5. Integration Module (`index.js`)

Integrates all components and provides a clean API for the next.config.js file.

## Implementation

### In `next.config.js`

```javascript
const {
  applySSRPolyfills,
  WebpackFactoryFixPlugin,
  createMinimalSSRPlugin,
} = require('./core/next-fixes');

// Apply SSR polyfills immediately
applySSRPolyfills();

// In webpack config:
config.plugins.push(new WebpackFactoryFixPlugin({ verbose: false }));
config.plugins.push(createMinimalSSRPlugin({ verbose: true }));
```

### In `package.json`

```json
"scripts": {
  "dev": "cross-env NODE_OPTIONS=\"--require ./core/next-fixes\" next dev",
  "build": "cross-env NODE_OPTIONS=\"--require ./core/next-fixes\" next build"
}
```

## Simplified Error Components

The error components (`app/error.tsx` and `app/global-error.tsx`) have been simplified to avoid hydration issues by:

1. Removing dependencies on problematic libraries (next-themes)
2. Eliminating complex state management
3. Using simple styling that doesn't conflict during hydration

## Verification

To verify that the fixes are correctly implemented:

```bash
npm run verify-fix
```

## Benefits of This Architecture

1. **Modularity**: Each fix is isolated in its own file, making it easier to understand, test, and maintain.
2. **Extensibility**: New fixes can be added without modifying existing code.
3. **Clarity**: Clear documentation and organization make it easier for team members to understand.
4. **Stability**: Comprehensive fixes that are applied correctly in the right order.
5. **Performance**: Minimal overhead and careful implementation to avoid affecting build times.

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify that all components are correctly imported in next.config.js
3. Ensure that the NODE_OPTIONS in package.json scripts include the fixes
4. Run the verification script to check for missing or misconfigured components

## History

This solution consolidates multiple partial fixes that were developed between March and May 2025, addressing critical hydration and webpack issues that were affecting the Nova Ipê application.

## Contributors

- João Pedro Cardozo
- Development Team Nova Ipê Imóveis
