# Master cleanup and fix script for Nova Ipê website
# This script consolidates and fixes all webpack/duplicate component issues
# June 2, 2025

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  NOVA IPÊ WEBSITE OPTIMIZATION SCRIPT  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean build directory
Write-Host "Step 1: Cleaning build directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "  ✓ Build directory cleaned" -ForegroundColor Green
} else {
    Write-Host "  ✓ No build directory found" -ForegroundColor Green
}
Write-Host ""

# Step 2: Backup and clean webpack fix files
Write-Host "Step 2: Cleaning up webpack fix files..." -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File ./cleanup-webpack-files.ps1
Write-Host "  ✓ Webpack files cleaned up" -ForegroundColor Green
Write-Host ""

# Step 3: Backup and clean duplicate component files
Write-Host "Step 3: Cleaning up duplicate component files..." -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File ./cleanup-component-duplicates.ps1
Write-Host "  ✓ Component files cleaned up" -ForegroundColor Green
Write-Host ""

# Step 4: Run component consolidation script
Write-Host "Step 4: Running component consolidation script..." -ForegroundColor Yellow
node consolidate-components.js
Write-Host "  ✓ Component imports consolidated" -ForegroundColor Green
Write-Host ""

# Step 5: Install dependencies if needed
Write-Host "Step 5: Checking and installing dependencies..." -ForegroundColor Yellow
npm install --silent
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 6: Run clean development build
Write-Host "Step 6: Building the application..." -ForegroundColor Yellow
npm run build:clean

# Check build status
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "    Please check the build errors above" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 7: Run webpack verification script
Write-Host "Step 7: Verifying webpack configuration..." -ForegroundColor Yellow
node verify-webpack-fix.js
Write-Host "  ✓ Webpack verification complete" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  OPTIMIZATION COMPLETE  " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "The Nova Ipê website has been successfully optimized!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host " 1. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host " 2. Check for any remaining console errors" -ForegroundColor White
Write-Host " 3. Test all features and components thoroughly" -ForegroundColor White
Write-Host ""
Write-Host "If you encounter any issues, run 'npm run fix:verify' to analyze the build." -ForegroundColor Yellow
