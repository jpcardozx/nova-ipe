# PowerShell script to cleanup and optimize the Nova Ipê project
Write-Host "🧹 Starting cleanup process for Nova Ipê..." -ForegroundColor Cyan

Write-Host "🔍 Finding duplicate dependencies..." -ForegroundColor Yellow
npx find-duplicate-dependencies

Write-Host "📦 Analyzing unused dependencies..." -ForegroundColor Yellow
npx depcheck

Write-Host "♻️ Cleaning up Next.js cache..." -ForegroundColor Yellow
if (Test-Path -Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
}

Write-Host "🗑️ Removing node_modules cache..." -ForegroundColor Yellow
if (Test-Path -Path "node_modules/.cache") {
    Remove-Item -Path "node_modules/.cache" -Recurse -Force
}

Write-Host "📊 Preparing to analyze bundle size..." -ForegroundColor Yellow
Write-Host "Run 'npm run build:analyze' to see bundle analysis" -ForegroundColor Cyan

Write-Host "✅ Cleanup complete! Review the output above for optimization opportunities." -ForegroundColor Green
