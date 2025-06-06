# Cleanup and consolidate webpack fix files
# This script moves all old webpack fix attempts to an archive folder
# June 2, 2025

Write-Host "Starting webpack fix file cleanup..." -ForegroundColor Cyan

# Create backup directory for old fixes
$backupDir = "archive\webpack-fixes-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Green
}

# List of webpack fix files to archive (keep only our definitive fix)
$filesToMove = @(
    "webpack-ssr-fix.js",
    "webpack-factory-fix-simple.js",
    "webpack.sourcemap.config.js",
    "nextjs-webpack-fix-corrected.js",
    "nextjs-webpack-fix.js",
    "core/webpack-runtime-fix.js",
    "core/webpack-fix.js",
    "minimal-ssr-plugin.js",
    "ssr-globals-plugin.js",
    "ultra-simple-ssr-plugin.js",
    "direct-patch.js",
    "definitive-fix.js",
    "solucao-definitiva.js",
    "next-router-patch.js",
    "verify-fixes.js",
    "verify-fixes-v2.js",
    "verify-hydration-fix.js",
    "verify-webpack-plugins.js"
)

# Move files to archive
foreach ($file in $filesToMove) {
    if (Test-Path $file) {
        # Create target directory structure in the backup
        $targetDir = Join-Path $backupDir (Split-Path $file)
        if (-not (Test-Path $targetDir)) {
            New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
        }
        
        # Copy to backup
        Copy-Item -Path $file -Destination (Join-Path $backupDir $file) -Force
        Write-Host "Backed up $file to $backupDir\$file" -ForegroundColor Yellow
        
        # Remove original
        Remove-Item -Path $file -Force
        Write-Host "Removed $file" -ForegroundColor Red
    }
    else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

# Create a README in the backup directory with information about the cleanup
$readmeContent = @"
# Webpack Fix Backup

This directory contains webpack fix attempts that were superseded by the definitive webpack fix.

Date of cleanup: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

These files were archived as part of a consolidation effort to clean up duplicate files and
solve webpack hydration errors in the Nova Ipê website.

The definitive fix is now located in:
- webpack-definitive-fix.js
- next.config.js (updated to use the fix)

## Why we consolidated

Multiple webpack fix attempts led to confusion and potential conflicts. By standardizing
on a single, comprehensive solution, we:

1. Eliminated circular dependencies
2. Resolved module duplication
3. Fixed hydration errors
4. Improved code splitting
5. Enhanced build performance

This cleanup is part of the Phase 2 improvements to the Nova Ipê website.
"@

Set-Content -Path (Join-Path $backupDir "README.md") -Value $readmeContent

Write-Host "Webpack fix file cleanup complete!" -ForegroundColor Green
Write-Host "All old fixes have been backed up to $backupDir" -ForegroundColor Cyan
Write-Host "Only the definitive fix (webpack-definitive-fix.js) remains" -ForegroundColor White
