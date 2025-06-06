# Clean up duplicated components script
# This script moves duplicated files to an archive directory to avoid conflicts
# June 2, 2025

Write-Host "Starting component cleanup process..." -ForegroundColor Cyan

# Create backup directory if it doesn't exist
$backupDir = "archive\component-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Green
}

# Files to archive (these are duplicates or obsolete versions)
$filesToMove = @(
    "app\components\ImovelCard.tsx",
    "app\components\OptimizedImovelCard.tsx",
    "components\ui\property\PropertyCard.tsx",
    "components\ui\property\PropertyCard.consolidated.tsx",
    "app\components\VirtualizedPropertiesGrid.tsx"
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
        
        # Create a redirect file in place of the original
        $redirectContent = @"
/**
 * REDIRECTED COMPONENT
 * 
 * This file has been consolidated into the unified component system.
 * Please use the appropriate unified component instead:
 * 
 * - For PropertyCard/ImovelCard: import PropertyCardUnified from '@/components/ui/property/PropertyCardUnified'
 * - For VirtualizedGrid: import VirtualizedPropertiesGridUnified from '@/app/components/VirtualizedPropertiesGridUnified'
 * 
 * @deprecated Use the unified components instead
 */

import { redirect } from 'next/navigation';

// This component is deprecated - use the unified version
export default function DeprecatedComponent() {
  console.warn('This component is deprecated. Please use the unified component system instead.');
  // This should never be rendered as it's only for reference
  return null;
}

// If you're seeing this file, check the import paths in your code
// and update them to use the unified components
"@

        Set-Content -Path $file -Value $redirectContent -Force
        Write-Host "Created redirect stub for $file" -ForegroundColor Magenta
    }
    else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "Component cleanup process completed!" -ForegroundColor Green
Write-Host "Original files have been backed up to $backupDir" -ForegroundColor Cyan
Write-Host "Run 'npm run dev' to test the changes" -ForegroundColor White
