# Quick Start Development Server with Smart Fixes Applied
# June 2, 2025

Write-Host "Starting optimized development server with smart fixes..." -ForegroundColor Cyan
Write-Host "This script applies all webpack and component fixes before starting the server." -ForegroundColor Cyan
Write-Host ""

# Clean the build directory
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Build directory cleaned." -ForegroundColor Green
}

# Apply smart fixes
node smart-fix.js

# Start the development server
npx next dev

# Check for errors
if ($LASTEXITCODE -ne 0) {
    Write-Host "Development server failed to start with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Try running the diagnostic script first: node smart-diagnostic.js" -ForegroundColor Yellow
    exit $LASTEXITCODE
}