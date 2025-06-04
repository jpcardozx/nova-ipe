# Quick Start Development Server with All Optimizations Applied
# June 2, 2025

Write-Host "Starting optimized development server..." -ForegroundColor Cyan
Write-Host "This script applies all webpack and component fixes before starting the server." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed." -ForegroundColor Green
}

# Run the optimized development script
npm run dev:optimized

# Check for errors
if ($LASTEXITCODE -ne 0) {
    Write-Host "Development server failed to start with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Try running ./optimize-all.ps1 first to apply all fixes" -ForegroundColor Yellow
    exit $LASTEXITCODE
}
