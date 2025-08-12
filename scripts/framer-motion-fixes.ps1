# FRAMER_MOTION_FIXES.ps1
# Script para correção automatizada dos erros do Framer Motion v12

$errorPatterns = @(
    @{
        Pattern     = 'ease: \[0\.6, 0\.01, -0\.05, 0\.95\]'
        Replacement = 'ease: "easeInOut" as const'
    },
    @{
        Pattern     = 'ease: \[0\.25, 0\.46, 0\.45, 0\.94\]'
        Replacement = 'ease: "easeOut" as const'
    },
    @{
        Pattern     = 'ease: \[0\.4, 0, 0\.2, 1\]'
        Replacement = 'ease: "easeInOut" as const'
    },
    @{
        Pattern     = 'type: "spring"'
        Replacement = 'type: "spring" as const'
    },
    @{
        Pattern     = 'type: "tween"'
        Replacement = 'type: "tween" as const'
    },
    @{
        Pattern     = 'layoutEffect: false'
        Replacement = ''
    }
)

$files = Get-ChildItem -Path "app/components" -Recurse -Include "*.tsx" | Where-Object { $_.Name -like "*Premium*" -or $_.Name -like "*Enhanced*" -or $_.Name -like "*Formal*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($pattern in $errorPatterns) {
        if ($content -match $pattern.Pattern) {
            $content = $content -replace $pattern.Pattern, $pattern.Replacement
            $modified = $true
            Write-Host "Fixed pattern in $($file.Name): $($pattern.Pattern)"
        }
    }
    
    if ($modified) {
        Set-Content $file.FullName -Value $content
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Framer Motion fixes applied!"
