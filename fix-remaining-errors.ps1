# Fix remaining TypeScript errors
# 1. Fix malformed import statements (importfrom -> import React from)
# 2. Fix type syntax errors (: -> :)

$projectPath = "c:\Users\João Pedro Cardozo\projetos\nova-ipe"
Set-Location $projectPath

Write-Host "Fixing remaining TypeScript errors..." -ForegroundColor Green

# Files with importfrom errors
$filesToFix = @(
    "app/components/client/PropertyClient.tsx",
    "app/components/client/PropertyShowcaseAdapter.tsx", 
    "app/components/server/PageServerProps.tsx",
    "app/components/server/PropertyShowcaseServer.tsx",
    "app/components/ui/ErrorBoundary.tsx",
    "app/components/ui/OptimizedImage.tsx",
    "app/documentation/ErrorBoundaryUsage.tsx",
    "app/hooks/useAnalytics.ts",
    "app/hooks/useIntersectionObserver.ts",
    "app/hooks/useMediaQuery.ts",
    "components/SectionHeader.tsx",
    "components/UnifiedLoading.tsx",
    "hooks/useDebounce.ts",
    "lib/cache.ts",
    "lib/schemas.ts",
    "next-env.d.ts",
    "scripts/diagnostics.ts",
    "src/types/base-props.ts",
    "src/types/base-types.ts",
    "src/types/custom.d.ts",
    "src/types/form-data.d.ts",
    "src/types/forms.ts",
    "src/types/global-types.ts",
    "src/types/image-types.ts",
    "src/types/media-query.d.ts"
)

$fixedCount = 0

foreach ($file in $filesToFix) {
    $fullPath = Join-Path $projectPath $file
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            
            # Fix importfrom -> import React from
            $originalContent = $content
            $content = $content -replace "importfrom 'react';", "import React from 'react';"
            
            # Fix type syntax errors (: -> :)
            $content = $content -replace "(\w+)\?\.(\w+)", '$1?: $2'
            $content = $content -replace "(\w+)\.(\w+)<", '$1: $2<'
            $content = $content -replace "\.(\w+)>", ': $1>'
            $content = $content -replace "\.(\w+);", ': $1;'
            $content = $content -replace "(\w+)\.(\w+) =", '$1: $2 ='
            
            if ($content -ne $originalContent) {
                Set-Content $fullPath $content -Encoding UTF8 -NoNewline
                Write-Host "Fixed: $file" -ForegroundColor Yellow
                $fixedCount++
            }
        }
        catch {
            Write-Host "Error processing $file : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Green
Write-Host "Running TypeScript check..." -ForegroundColor Blue

# Run TypeScript check to see remaining errors
npx tsc --noEmit --maxNodeModuleJsDepth 0
