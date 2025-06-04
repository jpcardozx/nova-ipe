# Configuration Cleanup Script
# Removes redundant and obsolete configuration files
# @version 1.0.0

$filesToRemove = @(
    "webpack.config.master.js",
    "webpack.sourcemap.config.js",
    "webpack-factory-fix-enhanced.js",
    "webpack-factory-fix-simple.js",
    "webpack-ssr-fix.js",
    "nextjs-webpack-fix.js",
    "nextjs-hydration-webpack-fix.js",
    "performance-webpack-config.js",
    "analyze-bundles.js",
    "verify-webpack-plugins.js",
    "verify-nextjs-patches.js",
    "verify-hydration-fix.js",
    "verify-fixes.js",
    "verify-fixes-v2.js",
    "verify-definitive-fix.js",
    "ultra-simple-ssr-plugin.js",
    "minimal-ssr-plugin.js",
    "styled-jsx-ssr-fix.js"
)

# Create backup directory
$backupDir = "backup-configs-$(Get-Date -Format 'yyyyMMdd')"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Move files to backup
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "Moving $file to backup..."
        Move-Item -Path $file -Destination "$backupDir/$file" -Force
    }
}

Write-Host "Cleanup complete. Old configuration files have been moved to $backupDir"
