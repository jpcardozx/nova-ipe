# PowerShell script to cleanly start Nova Ipê development server
# This script ensures a clean start without Server Component conflicts

Write-Host "🚀 Starting Nova Ipê Clean Development Server..." -ForegroundColor Green

# Change to project directory
Set-Location "c:\Users\João Pedro Cardozo\projetos\nova-ipe"

# Kill any existing processes on port 3000
Write-Host "🔌 Checking for existing processes on port 3000..." -ForegroundColor Yellow
$existingProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($existingProcess) {
    $processId = (Get-Process -Id $existingProcess.OwningProcess -ErrorAction SilentlyContinue).Id
    if ($processId) {
        Write-Host "⚠️ Killing existing process $processId on port 3000..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Clear caches
Write-Host "🧹 Clearing caches..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared .next cache" -ForegroundColor Green
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared node_modules cache" -ForegroundColor Green
}

# Verify next.config.js is the clean version
if (Test-Path "next.config.clean.minimal.js") {
    Copy-Item "next.config.clean.minimal.js" "next.config.js" -Force
    Write-Host "✅ Applied clean next.config.js" -ForegroundColor Green
}

Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "📱 The application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔍 Watch for Server Component errors in the output below..." -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
