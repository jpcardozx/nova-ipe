# Auto Build Fix Script - Automatiza build -> captura erros -> instala módulos -> repete
# Versão robusta para resolver todos os módulos faltantes automaticamente

param(
    [int]$MaxAttempts = 10,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$buildAttempt = 0
$allMissingModules = @()

Write-Host "🚀 Iniciando Auto Build Fix - Máximo $MaxAttempts tentativas" -ForegroundColor Green
Write-Host "📁 Diretório: $(Get-Location)" -ForegroundColor Cyan

function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Extract-Missing-Modules {
    param($BuildOutput)
    
    $missingModules = @()
    
    # Regex patterns para capturar módulos faltantes
    $patterns = @(
        "Module not found: Can't resolve '([^']+)'",
        "Cannot resolve module '([^']+)'",
        "Could not resolve '([^']+)'",
        "Module not found: Error: Can't resolve '([^']+)'",
        "Cannot find module '([^']+)'"
    )
    
    foreach ($line in $BuildOutput -split "`n") {
        foreach ($pattern in $patterns) {
            if ($line -match $pattern) {
                $module = $matches[1]
                
                # Filtrar módulos que não devemos instalar
                $skipModules = @(
                    "fs", "path", "crypto", "os", "util", "events", "stream", "buffer",
                    "./", "../", "next/", "@/", "~/",
                    ".js", ".ts", ".tsx", ".jsx", ".css", ".scss"
                )
                
                $shouldSkip = $false
                foreach ($skip in $skipModules) {
                    if ($module.StartsWith($skip) -or $module.EndsWith($skip)) {
                        $shouldSkip = $true
                        break
                    }
                }
                
                if (-not $shouldSkip -and $module -notmatch "^[./]" -and $module -ne "") {
                    $missingModules += $module
                    if ($Verbose) {
                        Write-Log "🔍 Módulo encontrado: $module" -Color Yellow
                    }
                }
            }
        }
    }
    
    return $missingModules | Sort-Object | Get-Unique
}

function Install-Modules {
    param($Modules)
    
    if ($Modules.Count -eq 0) {
        Write-Log "✅ Nenhum módulo para instalar" -Color Green
        return $true
    }
    
    Write-Log "📦 Instalando $($Modules.Count) módulos..." -Color Cyan
    
    foreach ($module in $Modules) {
        Write-Log "⬇️ Instalando: $module" -Color Blue
        
        try {
            $installOutput = & pnpm add $module 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "✅ $module instalado com sucesso" -Color Green
            } else {
                Write-Log "❌ Erro ao instalar $module" -Color Red
                if ($Verbose) {
                    Write-Log "Saída: $installOutput" -Color DarkRed
                }
            }
        }
        catch {
            Write-Log "❌ Exceção ao instalar $module`: $_" -Color Red
        }
        
        Start-Sleep -Milliseconds 500  # Pequena pausa entre instalações
    }
    
    return $true
}

function Run-Build {
    Write-Log "🔨 Executando build..." -Color Cyan
    
    try {
        # Usar timeout para evitar builds infinitos
        $buildJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD
            & pnpm run build 2>&1
        }
        
        # Aguardar até 5 minutos pelo build
        $buildOutput = Receive-Job -Job $buildJob -Wait -Timeout 300
        
        if ($buildJob.State -eq "Running") {
            Write-Log "⏰ Build excedeu timeout de 5 minutos, cancelando..." -Color Red
            Stop-Job -Job $buildJob
            Remove-Job -Job $buildJob
            return @{
                Success = $false
                Output = "Build timeout após 5 minutos"
                ExitCode = -1
            }
        }
        
        $exitCode = if ($buildJob.State -eq "Completed") { 0 } else { 1 }
        Remove-Job -Job $buildJob
        
        return @{
            Success = ($exitCode -eq 0)
            Output = $buildOutput -join "`n"
            ExitCode = $exitCode
        }
    }
    catch {
        Write-Log "❌ Erro durante build: $_" -Color Red
        return @{
            Success = $false
            Output = $_.Exception.Message
            ExitCode = -1
        }
    }
}

# Loop principal
while ($buildAttempt -lt $MaxAttempts) {
    $buildAttempt++
    
    Write-Log "🔄 Tentativa $buildAttempt de $MaxAttempts" -Color Magenta
    Write-Log "=" * 60 -Color DarkGray
    
    # Executar build
    $buildResult = Run-Build
    
    if ($buildResult.Success) {
        Write-Log "🎉 BUILD SUCEDIDO na tentativa $buildAttempt!" -Color Green
        Write-Log "✅ Todos os módulos foram instalados corretamente" -Color Green
        break
    }
    
    Write-Log "❌ Build falhou na tentativa $buildAttempt" -Color Red
    
    # Extrair módulos faltantes
    $missingModules = Extract-Missing-Modules -BuildOutput $buildResult.Output
    
    if ($missingModules.Count -eq 0) {
        Write-Log "⚠️ Nenhum módulo faltante detectado, mas build falhou" -Color Yellow
        Write-Log "Possível erro de configuração ou sintaxe" -Color Yellow
        
        if ($Verbose) {
            Write-Log "Saída completa do build:" -Color DarkYellow
            Write-Host $buildResult.Output -ForegroundColor DarkGray
        }
        
        # Salvar log de erro para análise
        $errorLogPath = "build-error-attempt-$buildAttempt.txt"
        $buildResult.Output | Out-File -FilePath $errorLogPath -Encoding UTF8
        Write-Log "📄 Log de erro salvo em: $errorLogPath" -Color Yellow
        
        break
    }
    
    # Adicionar à lista global de módulos faltantes
    $allMissingModules += $missingModules
    $allMissingModules = $allMissingModules | Sort-Object | Get-Unique
    
    Write-Log "🔍 Módulos faltantes detectados: $($missingModules.Count)" -Color Yellow
    
    if ($Verbose) {
        foreach ($module in $missingModules) {
            Write-Log "  - $module" -Color DarkYellow
        }
    }
    
    # Instalar módulos faltantes
    Install-Modules -Modules $missingModules
    
    Write-Log "⏳ Aguardando 3 segundos antes da próxima tentativa..." -Color Cyan
    Start-Sleep -Seconds 3
}

# Relatório final
Write-Log "=" * 60 -Color DarkGray
Write-Log "📊 RELATÓRIO FINAL" -Color Magenta

if ($buildAttempt -ge $MaxAttempts) {
    Write-Log "❌ FALHA: Número máximo de tentativas ($MaxAttempts) excedido" -Color Red
} else {
    Write-Log "✅ SUCESSO: Build concluído na tentativa $buildAttempt" -Color Green
}

Write-Log "📦 Total de módulos únicos instalados: $($allMissingModules.Count)" -Color Cyan

if ($allMissingModules.Count -gt 0) {
    Write-Log "📋 Lista completa de módulos instalados:" -Color Cyan
    foreach ($module in $allMissingModules) {
        Write-Log "  ✓ $module" -Color Green
    }
    
    # Salvar relatório
    $reportPath = "modules-installed-report.json"
    @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        BuildAttempts = $buildAttempt
        MaxAttempts = $MaxAttempts
        Success = ($buildAttempt -lt $MaxAttempts)
        ModulesInstalled = $allMissingModules
        TotalModules = $allMissingModules.Count
    } | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportPath -Encoding UTF8
    
    Write-Log "📄 Relatório salvo em: $reportPath" -Color Cyan
}

Write-Log "🏁 Script finalizado" -Color Magenta

# Retornar código de saída apropriado
if ($buildAttempt -lt $MaxAttempts) {
    exit 0
} else {
    exit 1
}
