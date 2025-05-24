# Apply the dynamic import fix to all dynamic imports in the project
# This script helps prevent the "options.factory is not a function" Webpack error

param (
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Starting message
Write-Host "🔍 Dynamic Import Fix - Scanning for unsafe dynamic imports..." -ForegroundColor Cyan

$projectRoot = $PSScriptRoot
$appDir = Join-Path $projectRoot "app"

# Counter for statistics
$filesScanned = 0
$filesPotentiallyFixed = 0
$filesSkipped = 0

# Color settings
$warningColor = "Yellow"
$successColor = "Green"
$infoColor = "Cyan"
$errorColor = "Red"

# Function to check if the file has already been fixed
function IsFileAlreadyFixed {
    param($content)
    
    # Check if the file already has a safeDynamicImport import
    if ($content -match "safeDynamicImport") {
        return $true
    }
    
    # Check if the file already has the dynamic-import-fix import
    if ($content -match "dynamic-import-fix") {
        return $true
    }
    
    return $false
}

# Function to add the import statement
function AddSafeDynamicImportImport {
    param($content)
    
    # Skip if there's no dynamic from 'next/dynamic' import
    if (-not ($content -match "import\s+.*dynamic.*from\s+['`"]next\/dynamic['`"]")) {
        return $content
    }
    
    # Check if there are any imports from the utils directory already
    $hasUtilsImport = $content -match "import.*from\s+['`"]\.\./utils/"
    $hasRootUtilsImport = $content -match "import.*from\s+['`"]@/app/utils/"
    $importPath = "'"
    
    # Determine the right path for the import
    if ($content -match "app/components/") {
        $basePath = "../utils"
    }
    elseif ($content -match "app/sections/") {
        $basePath = "../utils"
    }
    elseif ($content -match "app/") {
        $basePath = "./utils"
    }
    else {
        $basePath = "@/app/utils"
    }
    
    # Determine if this is likely a server component
    $isServerComponent = -not ($content -match "'use client'")
    
    if ($isServerComponent) {
        # For server components, use the universal helper
        $importStatement = "import { universalDynamicImport } from '$basePath/dynamic-import-helper';"
    } else {
        # For client components, use the client-side helper
        $importStatement = "import { safeDynamicImport } from '$basePath/dynamic-import-fix';"
    }
    
    # Add the import statement after the dynamic import
    $newContent = $content -replace "(import\s+.*dynamic.*from\s+['`"]next\/dynamic['`"];?)", "`$1`n$importStatement"
    
    return $newContent
}

# Function to fix dynamic imports
function FixDynamicImports {
    param($content)
    
    # Determine if this is likely a server component
    $isServerComponent = -not ($content -match "'use client'")
    
    # Fix pattern 1: dynamic(() => import('./path'))
    $pattern1 = 'dynamic\(\(\)\s*=>\s*import\([''"]([^''"]*)[''"]\)\s*(?:,\s*\{([^}]*)\})?\)'
    
    # Choose the appropriate replacement based on component type
    if ($isServerComponent) {
        # For server components, use universalDynamicImport
        $replacement1 = 'dynamic(universalDynamicImport(() => import(''\$1''), ''$componentName'')$optionalConfig)'
    } else {
        # For client components, use safeDynamicImport
        $replacement1 = 'dynamic(() => safeDynamicImport(import(''\$1''), ''$componentName'')$optionalConfig)'
    }
    
    $newContent = $content
    
    # Find all matches of pattern1
    $matches = [regex]::Matches($content, $pattern1)
    
    foreach ($match in $matches) {
        $fullMatch = $match.Value
        $path = $match.Groups[1].Value
        
        # Extract the component name from the path
        $componentName = $path -replace '.*/', ''
        $componentName = $componentName -replace '\.tsx$|\.jsx$|\.ts$|\.js$', ''
        
        # Handle optional config
        $optionalConfig = ""
        if ($match.Groups.Count -gt 2 -and $match.Groups[2].Success) {
            $optionalConfig = ", {" + $match.Groups[2].Value + "}"
        }
        
        # Build the replacement
        $specificReplacement = $replacement1 -replace '\$1', $path
        $specificReplacement = $specificReplacement -replace '\$componentName', $componentName
        $specificReplacement = $specificReplacement -replace '\$optionalConfig', $optionalConfig
        
        # Replace just this occurrence
        $newContent = $newContent -replace [regex]::Escape($fullMatch), $specificReplacement
    }
    
    # Fix pattern 2: dynamic(() => import('./path').then(mod => mod.Component))
    $pattern2 = 'dynamic\(\(\)\s*=>\s*import\([''"]([^''"]*)[''"]\)\.then\(([^)]*)\)\s*(?:,\s*\{([^}]*)\})?\)'
    
    # Find all matches of pattern2
    $matches = [regex]::Matches($content, $pattern2)
    
    foreach ($match in $matches) {
        $fullMatch = $match.Value
        $path = $match.Groups[1].Value
        $thenClause = $match.Groups[2].Value
        
        # Extract component name from the path or then clause
        $componentName = ""
        if ($thenClause -match '(\w+)\.(\w+)') {
            $componentName = $matches[0].Groups[2].Value
        } else {
            $componentName = $path -replace '.*/', ''
            $componentName = $componentName -replace '\.tsx$|\.jsx$|\.ts$|\.js$', ''
        }
        
        # We'll keep the original .then() pattern but wrap the import in safeDynamicImport
        $newPattern = "dynamic(() => safeDynamicImport(import('$path'), '$componentName').then($thenClause)"
        
        # Handle optional config
        if ($match.Groups.Count -gt 3 -and $match.Groups[3].Success) {
            $newPattern += ", {" + $match.Groups[3].Value + "}"
        }
        $newPattern += ")"
        
        # Replace just this occurrence
        $newContent = $newContent -replace [regex]::Escape($fullMatch), $newPattern
    }
    
    return $newContent
}

# Main function to process a file
function ProcessFile {
    param($filePath)
    
    $filesScanned++
    
    if ($Verbose) {
        Write-Host "  Scanning: $filePath" -ForegroundColor $infoColor
    }
    
    # Read the file content
    $content = Get-Content -Path $filePath -Raw
    
    # Skip if the file doesn't have dynamic imports
    if (-not ($content -match "dynamic\(\s*\(\s*\)")) {
        if ($Verbose) {
            Write-Host "    No dynamic imports found, skipping." -ForegroundColor $warningColor
        }
        $script:filesSkipped++
        return
    }
    
    # Check if the file has already been fixed
    if (IsFileAlreadyFixed -content $content) {
        Write-Host "  ✓ File already fixed: $filePath" -ForegroundColor $successColor
        $script:filesSkipped++
        return
    }
    
    # Add the import statement
    $newContent = AddSafeDynamicImportImport -content $content
    
    # Fix dynamic imports
    $newContent = FixDynamicImports -content $newContent
    
    # Check if any changes were made
    if ($content -ne $newContent) {
        $script:filesPotentiallyFixed++
        
        Write-Host "  🔧 Fixing: $filePath" -ForegroundColor $successColor
        
        if (-not $DryRun) {
            # Write the new content back to the file
            Set-Content -Path $filePath -Value $newContent
            Write-Host "    ✓ Fixed!" -ForegroundColor $successColor
        } else {
            Write-Host "    (Dry run - no changes applied)" -ForegroundColor $warningColor
        }
    }
}

# Recursively process all TypeScript/JavaScript files in the app directory
$files = Get-ChildItem -Path $appDir -Recurse -File | Where-Object { $_.Extension -match "\.tsx?$|\.jsx?$" }

foreach ($file in $files) {
    ProcessFile -filePath $file.FullName
}

# Summary
Write-Host ""
Write-Host "📊 Dynamic Import Fix Summary:" -ForegroundColor $infoColor
Write-Host "  - Files scanned: $filesScanned" -ForegroundColor $infoColor
Write-Host "  - Files fixed: $($DryRun ? '(would be) ' : '')$filesPotentiallyFixed" -ForegroundColor $successColor
Write-Host "  - Files skipped: $filesSkipped" -ForegroundColor $warningColor
Write-Host ""

if ($DryRun) {
    Write-Host "This was a dry run. Use the script without -DryRun to apply changes." -ForegroundColor $warningColor
} else {
    Write-Host "✅ Dynamic import fix applied! This should help prevent 'options.factory is not a function' errors." -ForegroundColor $successColor
}
