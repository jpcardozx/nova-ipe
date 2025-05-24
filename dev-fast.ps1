# Nova-IPE Fast Development Mode
# This script runs Next.js in development mode with performance optimizations

# Set environment variables for faster development
$env:FAST_DEV = "true"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_PUBLIC_ENABLE_WEB_VITALS = "false"
$env:ANALYZE_BUNDLE = "false"

# Force disable TypeScript checking during development for speed
Write-Host "🚀 Starting Next.js in high-performance development mode" -ForegroundColor Green
Write-Host "⚡ TypeScript checking: disabled" -ForegroundColor Yellow
Write-Host "⚡ ESLint checking: disabled" -ForegroundColor Yellow
Write-Host "⚡ Web Vitals: disabled" -ForegroundColor Yellow
Write-Host "⚡ Using minimal transpilation" -ForegroundColor Yellow

# Run Next.js with optimized settings
npm run dev -- --turbo
