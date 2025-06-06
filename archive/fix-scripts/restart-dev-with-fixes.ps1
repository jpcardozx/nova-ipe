# Restart Nova Ipê Development Server with All Fixes
# This script cleans the build directory, applies all fixes, and restarts the development server
# Date: June 2, 2025

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "     NOVA IPÊ DEVELOPMENT SERVER RESTART SCRIPT    " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running Next.js processes
Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { 
        try {
            Stop-Process -Id $_.Id -Force
            Write-Host "Stopped process with ID $($_.Id)" -ForegroundColor Green
        } catch {
            Write-Host "Could not stop process with ID $($_.Id): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No Next.js processes found running." -ForegroundColor Green
}

# Clean the build directory
Write-Host "Cleaning build directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Build directory cleaned." -ForegroundColor Green
} else {
    Write-Host "Build directory already clean." -ForegroundColor Green
}

# Fix webpack configuration deprecation warnings
Write-Host "Applying webpack configuration updates..." -ForegroundColor Yellow
try {
    $webpackFixFile = "webpack-definitive-fix.js"
    $smartFixFile = "smart-fix.js"
    
    # Check if files exist and update them
    if (Test-Path $webpackFixFile) {
        $content = Get-Content $webpackFixFile -Raw
        if ($content -match "\(context, request, callback\)") {
            Write-Host "  Updating externals function in $webpackFixFile" -ForegroundColor Yellow
            $content = $content -replace "\(context, request, callback\)", "({context, request}, cb)"
            $content = $content -replace "callback\(", "cb("
            $content = $content -replace "callback\(\);", "cb();"
            Set-Content -Path $webpackFixFile -Value $content
            Write-Host "  Updated $webpackFixFile successfully." -ForegroundColor Green
        } else {
            Write-Host "  $webpackFixFile already updated." -ForegroundColor Green
        }
    }
    
    if (Test-Path $smartFixFile) {
        $content = Get-Content $smartFixFile -Raw
        if ($content -match "\(context, request, callback\)") {
            Write-Host "  Updating externals function in $smartFixFile" -ForegroundColor Yellow
            $content = $content -replace "\(context, request, callback\)", "({context, request}, cb)"
            $content = $content -replace "callback\(", "cb("
            $content = $content -replace "callback\(\);", "cb();"
            Set-Content -Path $smartFixFile -Value $content
            Write-Host "  Updated $smartFixFile successfully." -ForegroundColor Green
        } else {
            Write-Host "  $smartFixFile already updated." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Error updating webpack configuration: $_" -ForegroundColor Red
}

# Fix Next.js configuration conflicts
Write-Host "Fixing Next.js configuration conflicts..." -ForegroundColor Yellow
node nextjs-config-conflicts-fix.js

# Apply all smart fixes
Write-Host "Applying all smart fixes..." -ForegroundColor Yellow
node smart-fix.js

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory (Get-Location)

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   NOVA IPÊ DEVELOPMENT SERVER STARTED WITH FIXES  " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Development server is now running in a new window."
Write-Host "Visit http://localhost:3000 to view the application."
Write-Host ""
Write-Host "If you still see any issues:"
Write-Host "1. Run 'npm run verify:final' to validate the fixes"
Write-Host "2. Check the browser's JavaScript console for errors"
Write-Host "3. Review the latest diagnostic reports"
