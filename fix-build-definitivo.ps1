# Fix Build Definitivo - Solução Robusta
param(
    [int]$MaxAttempts = 10
)

Write-Host "🚀 FIX BUILD DEFINITIVO - Versao Robusta" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

$attempt = 1
$installedModules = @()
$previousMissingCount = 999

while ($attempt -le $MaxAttempts) {
    Write-Host "`n🔧 TENTATIVA #$attempt de $MaxAttempts" -ForegroundColor Cyan
    Write-Host "   Executando build..." -ForegroundColor Yellow
    
    # Executar build e capturar saida
    $buildResult = Start-Process -FilePath "pnpm" -ArgumentList "run", "build" -Wait -PassThru -NoNewWindow -RedirectStandardOutput "build-output.txt" -RedirectStandardError "build-error.txt"
    
    if ($buildResult.ExitCode -eq 0) {
        Write-Host "🎉 BUILD SUCESSO!" -ForegroundColor Green
        Write-Host "   Tentativas necessarias: $attempt" -ForegroundColor Green
        if ($installedModules.Count -gt 0) {
            Write-Host "   Modulos instalados: $($installedModules.Count)" -ForegroundColor Green
        }
        
        # Cleanup arquivos temporarios
        Remove-Item "build-output.txt" -ErrorAction SilentlyContinue
        Remove-Item "build-error.txt" -ErrorAction SilentlyContinue
        exit 0
    }
    
    # Ler saida de erro
    $buildOutput = ""
    if (Test-Path "build-error.txt") {
        $buildOutput += Get-Content "build-error.txt" -Raw
    }
    if (Test-Path "build-output.txt") {
        $buildOutput += Get-Content "build-output.txt" -Raw
    }
    
    # Patterns mais robustos para detectar modulos faltantes
    $missingModules = @()
    $patterns = @(
        "Module not found: Can't resolve '([^']+)'",
        "Cannot resolve module '([^']+)'",
        "Cannot find module '([^']+)'",
        "Module build failed.*?Can't resolve '([^']+)'",
        "Failed to resolve '([^']+)'"
    )
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($buildOutput, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($match in $matches) {
            $module = $match.Groups[1].Value
            
            # Filtrar modulos validos
            if ($module -match '^[@a-zA-Z0-9][a-zA-Z0-9/_-]*$' -and
                $module -notmatch '\.(js|ts|tsx|jsx|css|scss|json)$' -and
                $module -notmatch '^\./' -and
                $module -notmatch '^\.\./' -and
                $module -notmatch '^/' -and
                $module -notin @('fs', 'path', 'crypto', 'http', 'https', 'url', 'os', 'util', 'stream', 'buffer', 'events')) {
                
                $missingModules += $module
            }
        }
    }
    
    $missingModules = $missingModules | Sort-Object -Unique | Where-Object { $_ -notin $installedModules }
    
    Write-Host "   Modulos faltantes detectados: $($missingModules.Count)" -ForegroundColor Yellow
    
    if ($missingModules.Count -eq 0) {
        Write-Host "   ❌ Build falhou mas nenhum modulo faltante detectado" -ForegroundColor Red
        Write-Host "   💾 Salvando erro detalhado..." -ForegroundColor Blue
        
        $errorFile = "build-error-detailed-$attempt.txt"
        $buildOutput | Out-File -FilePath $errorFile -Encoding UTF8
        Write-Host "   Erro salvo em: $errorFile" -ForegroundColor Blue
        break
    }
    
    # Verificar se estamos progredindo
    if ($missingModules.Count -ge $previousMissingCount) {
        Write-Host "   ⚠️ Sem progresso detectado. Mesmo numero de modulos faltando." -ForegroundColor Yellow
        Write-Host "   Tentando instalar modulos conhecidos..." -ForegroundColor Yellow
        
        # Lista de modulos comuns que costumam faltar
        $commonMissing = @(
            '@sentry/nextjs',
            '@sentry/browser', 
            '@sentry/core',
            '@sentry-internal/feedback',
            '@sentry-internal/replay',
            '@sentry-internal/replay-canvas',
            'hoist-non-react-statics',
            'react-is',
            'prop-types'
        )
        
        foreach ($module in $commonMissing) {
            if ($module -notin $installedModules) {
                Write-Host "      Instalando modulo comum: $module" -ForegroundColor Cyan
                $result = Start-Process -FilePath "pnpm" -ArgumentList "add", $module -Wait -PassThru -NoNewWindow
                if ($result.ExitCode -eq 0) {
                    $installedModules += $module
                    Write-Host "      ✅ $module instalado" -ForegroundColor Green
                }
            }
        }
    }
    
    $previousMissingCount = $missingModules.Count
    
    # Instalar modulos faltantes
    $successCount = 0
    foreach ($module in $missingModules) {
        Write-Host "      Instalando: $module" -ForegroundColor Cyan
        
        $result = Start-Process -FilePath "pnpm" -ArgumentList "add", $module -Wait -PassThru -NoNewWindow
        
        if ($result.ExitCode -eq 0) {
            Write-Host "      ✅ $module instalado com sucesso" -ForegroundColor Green
            $installedModules += $module
            $successCount++
        } else {
            Write-Host "      ❌ Falha ao instalar $module" -ForegroundColor Red
        }
    }
    
    Write-Host "   📊 Resumo: $successCount de $($missingModules.Count) modulos instalados" -ForegroundColor Blue
    
    # Pequena pausa antes da proxima tentativa
    Write-Host "   ⏳ Aguardando 3 segundos..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    $attempt++
}

Write-Host "`n❌ BUILD AINDA COM PROBLEMAS APOS $MaxAttempts TENTATIVAS" -ForegroundColor Red
Write-Host "   Total de modulos instalados: $($installedModules.Count)" -ForegroundColor Yellow
Write-Host "   Modulos instalados: $($installedModules -join ', ')" -ForegroundColor Yellow

# Salvar relatorio final
$report = @{
    "attempts" = $attempt - 1
    "installed_modules" = $installedModules
    "success" = $false
} | ConvertTo-Json -Depth 3

$report | Out-File -FilePath "build-fix-report.json" -Encoding UTF8
Write-Host "   📋 Relatorio salvo em: build-fix-report.json" -ForegroundColor Blue

exit 1
