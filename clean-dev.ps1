# Development Environment Cleanup Script
# This script cleans up development caches and temporary files

Write-Host "Starting development environment cleanup..." -ForegroundColor Cyan

# Clean Next.js cache
Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Clean node_modules cache
Write-Host "Cleaning module cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Clean browser caches in common locations (optional)
if ($args -contains "--browser-cache") {
    Write-Host "This script cannot clean browser caches. Please clear browser caches manually." -ForegroundColor Yellow
}

Write-Host "Cleanup complete! Ready for a fresh development session." -ForegroundColor Green
Write-Host "Run './fast-dev.ps1' to start development server in optimized mode." -ForegroundColor Cyan
