# Start Next.js after recovery
# Run this script to start the Next.js development server

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   STARTING NEXT.JS AFTER SUCCESSFUL RECOVERY        " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Run verification first
Write-Host "Running verification..." -ForegroundColor Yellow
node verify-recovery.js

Write-Host ""
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev
