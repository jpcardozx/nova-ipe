#!/usr/bin/env pwsh

# test-dynamic-import-fix.ps1
# Script to test if the dynamic import fix resolves the webpack options.factory → .call undefined crash
# Required to be run after applying the dynamic import fixes

Write-Host "🔍 Testing dynamic import fixes..." -ForegroundColor Cyan

# Clean Next.js cache to ensure a fresh build
Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
if (Test-Path -Path .next) {
    Remove-Item -Path .next -Recurse -Force
}

# Clean browser caches
Write-Host "Cleaning browser cache data..." -ForegroundColor Yellow
if (Test-Path -Path $env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache) {
    Remove-Item -Path "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache\*" -Force -ErrorAction SilentlyContinue
}

# Run a test build
Write-Host "Starting test build..." -ForegroundColor Green
$env:NODE_OPTIONS = "--max-old-space-size=4096"
pnpm run build

# Check build result
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful! The dynamic import fix appears to be working." -ForegroundColor Green
    
    # Start development server to test runtime
    Write-Host "Starting development server to test runtime..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C when done testing." -ForegroundColor Yellow
    pnpm run dev
} else {
    Write-Host "❌ Build failed. The fix might not be complete." -ForegroundColor Red
    exit 1
}
