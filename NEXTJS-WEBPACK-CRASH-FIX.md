# Next.js 15 "webpack options.factory → .call undefined" Fix 

## Patch Summary

**Date:** May 23, 2025  
**Issue:** Uncaught TypeError: Cannot read properties of undefined (reading 'call')  
**Fix Version:** 1.1.0  

## 📊 Issue Diagnosis

The "Cannot read properties of undefined (reading 'call')" error was occurring in the Next.js 15.2.4 app when dynamic imports were used. The issue was traced to cases where:

1. A module had **named exports only** (no default export)
2. The module was imported with dynamic imports
3. Webpack expected a default export to exist
4. The crash happened at runtime when trying to call `options.factory`

## 🛠️ Applied Fixes

### 1. Created utilities for safe dynamic imports

- Created `app/utils/dynamic-import-fix.ts` with:
  - `safeDynamicImport()` - Wrapper for Next.js dynamic imports
  - `ensureDynamicImport()` - Ensures modules always have valid default exports
- Created `app/utils/dynamic-import-helper.ts` with:
  - `universalDynamicImport()` - Works in both server and client contexts

### 2. Fixed critical components

- Added default exports to:
  - `instrumentation-client.ts`
  - `debug-tools.tsx`
- Fixed import pattern in:
  - `page-client.tsx`
  - `page.tsx` (main entry point)
  - `ClientComponents.tsx`

### 3. Enhanced the dynamic import wrapper

- Modified `DynamicImportWrapper.tsx` to handle:
  - Modules with only named exports
  - Empty modules
  - Error cases

### 4. Created automated fix tools

- `test-dynamic-import-fix.ps1` - Tests if the fix works
- `apply-dynamic-import-fix.ps1` - Automatically applies the fix to all dynamic imports

## 📝 Usage Instructions

### For Fixed Components

Components are now imported with the safe pattern:

```tsx
// Before (unsafe)
const Component = dynamic(() => import('./component-path'));

// After (safe - client components only)
const Component = dynamic(() => 
  safeDynamicImport(import('./component-path'), 'ComponentName')
);

// After (safe - universal, works in both server and client components)
const Component = dynamic(
  universalDynamicImport(() => import('./component-path'), 'ComponentName')
);
```

### SSR Compatibility

For server-rendered pages that need dynamic imports, use the universal helper:

```tsx
// In page.tsx (server component)
const ClientComponent = dynamic(
  universalDynamicImport(() => import('./client-component'), 'ClientComponent')
);
```

This approach prevents the "Attempted to call client function from server" error while still protecting against the webpack "call undefined" crash.

### To Apply to Remaining Components

Run:

```powershell
# Dry run first to see what would be changed
.\apply-dynamic-import-fix.ps1 -DryRun

# Apply the fix to all dynamic imports
.\apply-dynamic-import-fix.ps1
```

## 🧪 Testing

To verify the fix:

```powershell
.\test-dynamic-import-fix.ps1
```

## ✅ Validation

The fix should eliminate all instances of:
```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'call')
```

From the browser console in both development and production builds.

---

## Technical Details

The root cause was that Webpack's internal module system expects a valid function in the factory property when loading chunks. Our fix ensures that every dynamically loaded module has a valid default export that can be called, even if the original module only had named exports or was empty.
