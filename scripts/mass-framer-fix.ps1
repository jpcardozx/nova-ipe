# Framer Motion v12 - Mass Fix Script
# PowerShell script para correção em massa

$patterns = @{
    'ease:\s*\[\s*0\.6,\s*0\.01,\s*-0\.05,\s*0\.95\s*\]' = 'ease: "easeInOut" as const'
    'ease:\s*\[\s*0\.25,\s*0\.46,\s*0\.45,\s*0\.94\s*\]' = 'ease: "easeOut" as const'
    'ease:\s*\[\s*0\.4,\s*0,\s*0\.2,\s*1\s*\]'           = 'ease: "easeInOut" as const'
    'ease:\s*\[\s*0\.22,\s*1,\s*0\.36,\s*1\s*\]'         = 'ease: "easeOut" as const'
    'ease:\s*"easeOut"(?!\s+as\s+const)'                 = 'ease: "easeOut" as const'
    'ease:\s*"easeIn"(?!\s+as\s+const)'                  = 'ease: "easeIn" as const'
    'ease:\s*"easeInOut"(?!\s+as\s+const)'               = 'ease: "easeInOut" as const'
    'type:\s*"spring"(?!\s+as\s+const)'                  = 'type: "spring" as const'
    'type:\s*"tween"(?!\s+as\s+const)'                   = 'type: "tween" as const'
    'layoutEffect:\s*false,?'                            = ''
}

$files = Get-ChildItem -Path "app\components" -Recurse -Include "*.tsx"

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        foreach ($pattern in $patterns.GetEnumerator()) {
            if ($content -match $pattern.Key) {
                $content = $content -replace $pattern.Key, $pattern.Value
                Write-Host "Fixed pattern in $($file.Name): $($pattern.Key)"
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content $file.FullName -Value $content -ErrorAction Stop
            Write-Host "✅ Updated: $($file.FullName)"
        }
    }
    catch {
        Write-Warning "❌ Error processing $($file.FullName): $($_.Exception.Message)"
    }
}

Write-Host "🎯 Mass fix completed!"
