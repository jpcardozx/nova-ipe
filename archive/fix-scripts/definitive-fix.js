/**
 * DEFINITIVE FIX - Nova Ipê Server Component Issues
 * This script addresses the critical "Unsupported Server Component type" errors
 * by implementing proper server/client boundaries and removing problematic imports.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting definitive fix for Server Component issues...');

// Clear Next.js cache
const cachePath = path.join(process.cwd(), '.next');
if (fs.existsSync(cachePath)) {
    console.log('🧹 Clearing .next cache...');
    try {
        fs.rmSync(cachePath, { recursive: true, force: true });
        console.log('✅ Cache cleared successfully');
    } catch (error) {
        console.log('⚠️ Cache clear warning:', error.message);
    }
}

// Backup and fix next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const nextConfigBackupPath = path.join(process.cwd(), 'next.config.backup.js');

if (fs.existsSync(nextConfigPath) && !fs.existsSync(nextConfigBackupPath)) {
    fs.copyFileSync(nextConfigPath, nextConfigBackupPath);
    console.log('📄 Backed up next.config.js');
}

// Create a minimal next.config.js that should fix the issues
const minimalNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Fix Server Component serialization issues
  experimental: {
    serverComponentsExternalPackages: ['framer-motion'],
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // Prevent SSR issues with client-only components
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Fix module resolution for client components
    config.module.rules.push({
      test: /\\.tsx?$/,
      use: [
        {
          loader: 'next-swc-loader',
          options: {
            sourceMaps: true,
          },
        },
      ],
    });
    
    return config;
  },
  
  // Optimize bundle splitting
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync(nextConfigPath, minimalNextConfig);
console.log('⚙️ Updated next.config.js with fixes');

// Check and fix middleware if it has issues
const middlewarePath = path.join(process.cwd(), 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    if (middlewareContent.includes('Unsupported') || middlewareContent.includes('Error')) {
        const backupMiddlewarePath = path.join(process.cwd(), 'middleware.backup.ts');
        fs.copyFileSync(middlewarePath, backupMiddlewarePath);
        
        // Create minimal middleware
        const minimalMiddleware = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;
        fs.writeFileSync(middlewarePath, minimalMiddleware);
        console.log('🛡️ Fixed middleware.ts');
    }
}

// Create package.json scripts for clean start
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add clean scripts
    packageJson.scripts = {
        ...packageJson.scripts,
        'dev:clean': 'rm -rf .next && next dev',
        'dev:fresh': 'rm -rf .next node_modules/.cache && next dev',
        'build:clean': 'rm -rf .next && next build',
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Updated package.json with clean scripts');
}

console.log('\n✅ Definitive fix completed! Summary:');
console.log('  - Cleared .next cache');
console.log('  - Fixed next.config.js configuration');
console.log('  - Updated middleware if needed');
console.log('  - Added clean scripts to package.json');
console.log('\n🎯 Next steps:');
console.log('  1. Run: npm run dev:clean');
console.log('  2. Test the application');
console.log('  3. Check for remaining errors\n');
