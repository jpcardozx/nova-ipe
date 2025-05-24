# Next.js Development Speed Optimization Guide

This guide provides instructions on how to optimize and speed up the development experience for this project.

## Recent Performance Improvements

We've added several optimizations to improve development speed:

1. **Fixed Missing Placeholder Images:** The 404 error for `/images/property-placeholder.jpg` has been fixed with automatic image generation
2. **Optimized TypeScript Checking:** Type checking during development is now optional to improve compilation speed
3. **Enhanced Component Caching:** Improved caching for faster hot module replacement
4. **Optimized Package Imports:** Added more package optimization settings for `react-icons` and other libraries

## Fast Development Scripts

We have several options for running the development server with varying levels of performance:

1. **Regular Development:**
   ```powershell
   pnpm run dev
   ```

2. **Fast Development Mode:**
   ```powershell
   pnpm run dev:fast
   # or run the batch file directly
   ./fast-dev.bat
   ```

3. **Turbo Development Mode (Fastest):**
   ```powershell
   pnpm run dev:turbo
   ```

4. **Development with Web Vitals Monitoring:**
   ```powershell
   pnpm run dev:vitals
   # or run the batch file
   ./start-dev-with-vitals.bat
   ```

5. **Clean Development:**
   ```powershell
   pnpm run dev:clean
   # Clean caches and then start
   pnpm run dev:clean && pnpm run dev:turbo
   ```

6. **Fix Placeholder Image:**
   ```powershell
   pnpm run fix:placeholder
   ```

## Performance Optimization Techniques

### Development Server Optimization

The project uses several techniques to speed up the development server:

1. **Conditional Instrumentation:** Instrumentation is disabled in normal development to reduce overhead
2. **Turbo Mode:** Uses Next.js Turbo mode for faster compilation
3. **Caching:** Enhanced caching through `onDemandEntries` configuration
4. **Package Optimization:** Uses `optimizePackageImports` for faster module loading

### When to Use Different Development Modes

- Use **regular development** (`dev`) when you need the full experience with all checks and features
- Use **fast development** (`dev:fast`) for most daily work
- Use **turbo development** (`dev:turbo`) when you need maximum speed and don't need strict type checking
- Use **development with vitals** (`dev:vitals`) when debugging performance issues

## Resolving Common Issues

### 404 Image Errors

If you encounter 404 errors for images, check:

1. Make sure the image exists in the correct path
2. Use Next.js Image component with proper configuration
3. Ensure fallback images are available in both SVG and JPG formats

### Slow Compilation

If compilation is slow:

1. Use `dev:turbo` for faster compilation
2. Review imports and consider using dynamic imports for large modules
3. Check for circular dependencies

### High Memory Usage

If development server uses too much memory:

1. Use `pnpm run clean` to clear caches
2. Restart the development server regularly
3. Close unnecessary browser tabs and applications

## Added Optimization Scripts

- `fast-dev.bat` - Windows script for starting the development server in optimized mode
- `dev:fast` and `dev:turbo` scripts in package.json for quick access to optimized modes

## Optimized Components

### ImageWithFallback Component

We've added an optimized image component that automatically handles missing images and fallbacks:

```tsx
// Example usage
import { PropertyImage } from '@/app/components/ImageWithFallback';

function MyComponent() {
  return (
    <PropertyImage 
      src={propertyData.imageUrl} 
      alt={propertyData.title}
      width={800}
      height={600}
    />
  );
}
```

This component will automatically:
- Handle the 404 error for missing placeholder images
- Provide a smooth loading experience with placeholder
- Use the appropriate fallback image if the main image fails to load
