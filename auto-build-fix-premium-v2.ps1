# Auto Build Fix Premium - Script Avançado para Resolver Dependências
# Versão 2.0 - Inteligente e Robusto
# Uso: .\auto-build-fix-premium.ps1

param(
    [int]$MaxAttempts = 10,
    [switch]$Verbose,
    [switch]$DryRun,
    [string]$LogFile = "build-fix-log.txt"
)

# Configurações
$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# Cores para output
function Write-ColoredOutput {
    param([string]$Text, [string]$Color = "White")
    switch ($Color) {
        "Red" { Write-Host $Text -ForegroundColor Red }
        "Green" { Write-Host $Text -ForegroundColor Green }
        "Yellow" { Write-Host $Text -ForegroundColor Yellow }
        "Blue" { Write-Host $Text -ForegroundColor Blue }
        "Cyan" { Write-Host $Text -ForegroundColor Cyan }
        "Magenta" { Write-Host $Text -ForegroundColor Magenta }
        default { Write-Host $Text }
    }
}

# Função para logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $logEntry
    
    if ($Verbose) {
        switch ($Level) {
            "ERROR" { Write-ColoredOutput $logEntry "Red" }
            "WARN" { Write-ColoredOutput $logEntry "Yellow" }
            "SUCCESS" { Write-ColoredOutput $logEntry "Green" }
            default { Write-ColoredOutput $logEntry "White" }
        }
    }
}

# Função para extrair módulos faltantes de forma inteligente
function Extract-MissingModules {
    param([string]$BuildOutput)
    
    $missingModules = @()
    $patterns = @(
        "Module not found: Can't resolve '([^']+)'",
        "Cannot resolve module '([^']+)'",
        "Module not found: Error: Can't resolve '([^']+)'",
        "Cannot find module '([^']+)'",
        "Error: Cannot resolve '([^']+)'",
        "Failed to resolve '([^']+)'"
    )
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($BuildOutput, $pattern)
        foreach ($match in $matches) {
            $module = $match.Groups[1].Value
            
            # Filtrar módulos que não são pacotes npm válidos
            if ($module -match '^[a-zA-Z0-9@/_-]+$' -and 
                $module -notmatch '\.(js|ts|css|scss|json)$' -and
                $module -notmatch '^\./' -and
                $module -notmatch '^\.\./' -and
                $module -notmatch '^/' -and
                $module -ne 'fs' -and $module -ne 'path' -and $module -ne 'crypto' -and
                $module -ne 'http' -and $module -ne 'https' -and $module -ne 'url' -and
                $module -ne 'util' -and $module -ne 'events' -and $module -ne 'stream') {
                
                $missingModules += $module
            }
        }
    }
    
    # Remover duplicatas e ordenar
    return $missingModules | Sort-Object -Unique
}

# Função para verificar se um pacote existe no npm
function Test-PackageExists {
    param([string]$PackageName)
    
    try {
        $result = pnpm view $PackageName version 2>$null
        return $result -ne $null -and $result.Trim() -ne ""
    }
    catch {
        return $false
    }
}

# Função para instalar módulos com retry
function Install-ModulesWithRetry {
    param([string[]]$Modules, [int]$MaxRetries = 3)
    
    $successful = @()
    $failed = @()
    
    foreach ($module in $Modules) {
        $retries = 0
        $installed = $false
        
        while ($retries -lt $MaxRetries -and -not $installed) {
            try {
                Write-ColoredOutput "📦 Instalando $module (tentativa $($retries + 1)/$MaxRetries)..." "Cyan"
                Write-Log "Attempting to install: $module (retry $($retries + 1))"
                
                if ($DryRun) {
                    Write-ColoredOutput "   [DRY RUN] Simulando instalação de $module" "Yellow"
                    $installed = $true
                } else {
                    # Verificar se o pacote existe primeiro
                    if (Test-PackageExists $module) {
                        $installResult = pnpm add $module 2>&1
                        if ($LASTEXITCODE -eq 0) {
                            $installed = $true
                            $successful += $module
                            Write-ColoredOutput "   ✅ $module instalado com sucesso" "Green"
                            Write-Log "Successfully installed: $module" "SUCCESS"
                        } else {
                            Write-Log "Failed to install $module. Output: $installResult" "ERROR"
                        }
                    } else {
                        Write-ColoredOutput "   ❌ Pacote $module não encontrado no registry" "Red"
                        Write-Log "Package not found in registry: $module" "WARN"
                        $failed += $module
                        break
                    }
                }
            }
            catch {
                Write-Log "Exception installing $module (retry $retries): $($_.Exception.Message)" "ERROR"
            }
            
            if (-not $installed) {
                $retries++
                if ($retries -lt $MaxRetries) {
                    Start-Sleep -Seconds 2
                }
            }
        }
        
        if (-not $installed -and $module -notin $failed) {
            $failed += $module
            Write-ColoredOutput "   ❌ Falha ao instalar $module após $MaxRetries tentativas" "Red"
            Write-Log "Failed to install after $MaxRetries attempts: $module" "ERROR"
        }
    }
    
    return @{
        Successful = $successful
        Failed = $failed
    }
}

# Função principal para build com análise
function Start-IntelligentBuild {
    param([int]$AttemptNumber)
    
    Write-ColoredOutput "`n🔧 BUILD ATTEMPT #$AttemptNumber" "Magenta"
    Write-Log "Starting build attempt #$AttemptNumber"
    
    try {
        if ($DryRun) {
            Write-ColoredOutput "   [DRY RUN] Simulando build..." "Yellow"
            return @{
                Success = $false
                Output = "Simulated build output with missing modules: '@sentry/core', 'missing-package'"
                MissingModules = @('@sentry/core', 'missing-package')
            }
        }
        
        # Executar build e capturar output
        $buildOutput = pnpm run build 2>&1 | Out-String
        $buildSuccess = $LASTEXITCODE -eq 0
        
        # Extrair módulos faltantes
        $missingModules = Extract-MissingModules $buildOutput
        
        Write-Log "Build completed. Success: $buildSuccess. Missing modules found: $($missingModules.Count)"
        
        if ($buildSuccess) {
            Write-ColoredOutput "🎉 BUILD SUCESSO!" "Green"
            Write-Log "Build completed successfully!" "SUCCESS"
        } else {
            Write-ColoredOutput "❌ Build falhou. Módulos faltantes encontrados: $($missingModules.Count)" "Red"
            if ($missingModules.Count -gt 0) {
                Write-ColoredOutput "   Módulos: $($missingModules -join ', ')" "Yellow"
            }
        }
        
        return @{
            Success = $buildSuccess
            Output = $buildOutput
            MissingModules = $missingModules
        }
    }
    catch {
        Write-Log "Exception during build: $($_.Exception.Message)" "ERROR"
        Write-ColoredOutput "❌ Erro durante build: $($_.Exception.Message)" "Red"
        return @{
            Success = $false
            Output = $_.Exception.Message
            MissingModules = @()
        }
    }
}

# Função para gerar relatório final
function Generate-Report {
    param($Results, $TotalTime)
    
    $reportFile = "build-fix-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $report = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        TotalTime = $TotalTime.ToString()
        TotalAttempts = $Results.Count
        Success = $Results[-1].Success
        AllModulesInstalled = $Results | ForEach-Object { $_.ModulesInstalled } | Sort-Object -Unique
        FinalMissingModules = if ($Results[-1].Success) { @() } else { $Results[-1].MissingModules }
        AttemptDetails = $Results
    }
    
    $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportFile -Encoding UTF8
    Write-ColoredOutput "`n📊 Relatório detalhado salvo em: $reportFile" "Blue"
    Write-Log "Report generated: $reportFile"
}

# Script principal
Write-ColoredOutput "🚀 AUTO BUILD FIX PREMIUM v2.0" "Magenta"
Write-ColoredOutput "===============================================" "Magenta"
Write-ColoredOutput "Max tentativas: $MaxAttempts" "Blue"
Write-ColoredOutput "Log file: $LogFile" "Blue"
Write-ColoredOutput "Dry run: $DryRun" "Blue"
Write-ColoredOutput "===============================================`n" "Magenta"

$startTime = Get-Date
$results = @()
$attempt = 1
$allInstalledModules = @()

while ($attempt -le $MaxAttempts) {
    $buildResult = Start-IntelligentBuild $attempt
    
    if ($buildResult.Success) {
        $results += @{
            Attempt = $attempt
            Success = $true
            MissingModules = @()
            ModulesInstalled = @()
            Duration = (Get-Date) - $startTime
        }
        break
    }
    
    if ($buildResult.MissingModules.Count -eq 0) {
        Write-ColoredOutput "⚠️ Build falhou mas nenhum módulo faltante detectado. Verifique erros manualmente." "Yellow"
        Write-Log "Build failed but no missing modules detected" "WARN"
        
        # Salvar output para análise manual
        $errorFile = "build-error-detailed-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
        $buildResult.Output | Out-File -FilePath $errorFile -Encoding UTF8
        Write-ColoredOutput "💾 Output do build salvo em: $errorFile" "Blue"
        
        $results += @{
            Attempt = $attempt
            Success = $false
            MissingModules = @()
            ModulesInstalled = @()
            Duration = (Get-Date) - $startTime
            ErrorFile = $errorFile
        }
        break
    }
    
    # Filtrar módulos que já foram instalados
    $newModules = $buildResult.MissingModules | Where-Object { $_ -notin $allInstalledModules }
    
    if ($newModules.Count -eq 0) {
        Write-ColoredOutput "🔄 Mesmos módulos faltando. Pode haver dependências circulares ou outros problemas." "Yellow"
        Write-Log "Same modules missing as previous attempts" "WARN"
        
        $results += @{
            Attempt = $attempt
            Success = $false
            MissingModules = $buildResult.MissingModules
            ModulesInstalled = @()
            Duration = (Get-Date) - $startTime
            Note = "Circular dependencies or other issues detected"
        }
        break
    }
    
    Write-ColoredOutput "`n📦 INSTALANDO MÓDULOS FALTANTES..." "Cyan"
    Write-ColoredOutput "   Novos módulos a instalar: $($newModules -join ', ')" "White"
    
    $installResult = Install-ModulesWithRetry $newModules
    $allInstalledModules += $installResult.Successful
    
    $results += @{
        Attempt = $attempt
        Success = $false
        MissingModules = $buildResult.MissingModules
        ModulesInstalled = $installResult.Successful
        ModulesFailed = $installResult.Failed
        Duration = (Get-Date) - $startTime
    }
    
    if ($installResult.Successful.Count -gt 0) {
        Write-ColoredOutput "`n✅ Módulos instalados com sucesso: $($installResult.Successful.Count)" "Green"
        Write-ColoredOutput "   $($installResult.Successful -join ', ')" "Green"
    }
    
    if ($installResult.Failed.Count -gt 0) {
        Write-ColoredOutput "`n❌ Módulos que falharam: $($installResult.Failed.Count)" "Red"
        Write-ColoredOutput "   $($installResult.Failed -join ', ')" "Red"
    }
    
    Write-ColoredOutput "`n⏳ Aguardando 3 segundos antes da próxima tentativa..." "Yellow"
    if (-not $DryRun) {
        Start-Sleep -Seconds 3
    }
    
    $attempt++
}

$totalTime = (Get-Date) - $startTime

Write-ColoredOutput "`n===============================================" "Magenta"
Write-ColoredOutput "🏁 RESULTADO FINAL" "Magenta"
Write-ColoredOutput "===============================================" "Magenta"

if ($results[-1].Success) {
    Write-ColoredOutput "🎉 BUILD CONCLUÍDO COM SUCESSO!" "Green"
    Write-ColoredOutput "   Tentativas necessárias: $($results.Count)" "Green"
    Write-ColoredOutput "   Tempo total: $($totalTime.ToString('mm\:ss'))" "Green"
    Write-ColoredOutput "   Total de módulos instalados: $($allInstalledModules.Count)" "Green"
    if ($allInstalledModules.Count -gt 0) {
        Write-ColoredOutput "   Módulos: $($allInstalledModules -join ', ')" "Green"
    }
} else {
    Write-ColoredOutput "❌ BUILD AINDA COM PROBLEMAS" "Red"
    Write-ColoredOutput "   Tentativas realizadas: $($results.Count)/$MaxAttempts" "Red"
    Write-ColoredOutput "   Tempo total: $($totalTime.ToString('mm\:ss'))" "Red"
    
    $finalMissingModules = $results[-1].MissingModules
    if ($finalMissingModules.Count -gt 0) {
        Write-ColoredOutput "   Módulos ainda faltando: $($finalMissingModules -join ', ')" "Red"
    }
}

Write-ColoredOutput "===============================================`n" "Magenta"

# Gerar relatório
Generate-Report $results $totalTime

Write-Log "Script completed. Final success: $($results[-1].Success)" "SUCCESS"

exit $(if ($results[-1].Success) { 0 } else { 1 })
