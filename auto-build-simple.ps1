# Auto Build Fix - Script Simplificado e Funcional
param(
    [int]$MaxAttempts = 8
)

Write-Host "🚀 AUTO BUILD FIX - Versão Simplificada" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

$attempt = 1
$allInstalledModules = @()

while ($attempt -le $MaxAttempts) {
    Write-Host "`n🔧 TENTATIVA #$attempt" -ForegroundColor Cyan
    
    # Executar build e capturar saída
    Write-Host "   Executando build..." -ForegroundColor Yellow
    $buildOutput = pnpm run build 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 BUILD SUCESSO!" -ForegroundColor Green
        Write-Host "   Tentativas necessárias: $attempt" -ForegroundColor Green
        if ($allInstalledModules.Count -gt 0) {
            Write-Host "   Módulos instalados: $($allInstalledModules -join ', ')" -ForegroundColor Green
        }
        exit 0
    }
    
    # Extrair módulos faltantes
    $missingModules = @()
    $patterns = @(
        "Module not found: Can't resolve '([^']+)'",
        "Cannot resolve module '([^']+)'",
        "Cannot find module '([^']+)'"
    )
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($buildOutput, $pattern)
        foreach ($match in $matches) {
            $module = $match.Groups[1].Value
            if ($module -match '^[a-zA-Z0-9@/_-]+$' -and 
                $module -notmatch '\.(js|ts|css)$' -and
                $module -notmatch '^\./' -and
                $module -ne 'fs' -and $module -ne 'path' -and $module -ne 'crypto') {
                $missingModules += $module
            }
        }
    }
    
    $missingModules = $missingModules | Sort-Object -Unique
    
    if ($missingModules.Count -eq 0) {
        Write-Host "   ❌ Build falhou mas nenhum módulo faltante detectado" -ForegroundColor Red
        $errorFile = "build-error-$attempt.txt"
        $buildOutput | Out-File -FilePath $errorFile
        Write-Host "   💾 Erro salvo em: $errorFile" -ForegroundColor Blue
        break
    }
    
    # Filtrar módulos já instalados
    $newModules = $missingModules | Where-Object { $_ -notin $allInstalledModules }
    
    if ($newModules.Count -eq 0) {
        Write-Host "   🔄 Mesmos módulos faltando - possível problema circular" -ForegroundColor Yellow
        break
    }
    
    Write-Host "   📦 Instalando módulos: $($newModules -join ', ')" -ForegroundColor Cyan
    
    foreach ($module in $newModules) {
        Write-Host "      Instalando $module..." -ForegroundColor White
        $result = pnpm add $module 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "      ✅ $module instalado" -ForegroundColor Green
            $allInstalledModules += $module
        } else {
            Write-Host "      ❌ Falha ao instalar $module" -ForegroundColor Red
        }
    }
    
    Write-Host "   ⏳ Aguardando 2 segundos..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    $attempt++
}

Write-Host "`n❌ BUILD AINDA COM PROBLEMAS APÓS $MaxAttempts TENTATIVAS" -ForegroundColor Red
Write-Host "   Total de módulos instalados: $($allInstalledModules.Count)" -ForegroundColor Yellow

exit 1
