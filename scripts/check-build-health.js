const fs = require('fs');
const path = require('path');

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Logger utility
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✕${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`)
};

// Check build health
async function checkBuildHealth() {
  log.title('Nova IPE Build Health Check');

  // Check .next directory
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    const stats = fs.statSync(buildDir);
    const sizeMB = stats.size / (1024 * 1024);
    
    if (sizeMB > 500) {
      log.warning(`Build directory is quite large (${sizeMB.toFixed(2)}MB)`);
    } else {
      log.success(`Build directory size is healthy (${sizeMB.toFixed(2)}MB)`);
    }

    // Check chunk files
    const serverDir = path.join(buildDir, 'server');
    const staticDir = path.join(buildDir, 'static');
    
    if (fs.existsSync(serverDir)) {
      const serverFiles = fs.readdirSync(serverDir);
      log.info(`Server chunks: ${serverFiles.length} files`);
    }

    if (fs.existsSync(staticDir)) {
      const chunksDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(chunksDir)) {
        const chunks = fs.readdirSync(chunksDir);
        log.info(`Static chunks: ${chunks.length} files`);

        // Check for large chunks
        let largeChunks = 0;
        chunks.forEach(chunk => {
          const chunkPath = path.join(chunksDir, chunk);
          const chunkSize = fs.statSync(chunkPath).size / (1024 * 1024);
          if (chunkSize > 2) {
            largeChunks++;
            log.warning(`Large chunk detected: ${chunk} (${chunkSize.toFixed(2)}MB)`);
          }
        });

        if (largeChunks === 0) {
          log.success('No unusually large chunks detected');
        }
      }
    }
  } else {
    log.error('Build directory not found. Run `pnpm build` first');
  }

  // Check package manager files
  if (fs.existsSync('pnpm-lock.yaml')) {
    log.success('Using pnpm (recommended)');
  } else if (fs.existsSync('package-lock.json')) {
    log.warning('Using npm instead of pnpm');
  } else if (fs.existsSync('yarn.lock')) {
    log.warning('Using yarn instead of pnpm');
  }

  // Check Next.js configuration
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  // Check for optimization features
  if (nextConfig.includes('optimizePackageImports')) {
    log.success('Package imports optimization enabled');
  }
  
  if (nextConfig.includes('swcMinify: true')) {
    log.success('Using SWC minification');
  }

  if (nextConfig.includes('deterministic')) {
    log.success('Using deterministic chunk IDs (good for caching)');
  }

  // Report TypeScript and ESLint settings
  if (nextConfig.includes('ignoreBuildErrors: false')) {
    log.success('TypeScript errors will fail the build (recommended)');
  } else {
    log.warning('TypeScript errors are being ignored');
  }

  if (nextConfig.includes('ignoreDuringBuilds: false')) {
    log.success('ESLint errors will fail the build (recommended)');
  } else {
    log.warning('ESLint errors are being ignored');
  }

  log.title('Recommendations:');
  console.log('1. Run `pnpm build` regularly to check for issues');
  console.log('2. Monitor chunk sizes in the build output');
  console.log('3. Keep dependencies up to date with `pnpm update`');
  console.log('4. Use `pnpm dev` for development\n');
}

// Run the health check
checkBuildHealth().catch(console.error);
