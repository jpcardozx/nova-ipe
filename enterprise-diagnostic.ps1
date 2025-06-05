# Enterprise Fix System - Diagnóstico e Verificação

<#
.SYNOPSIS
    Executa diagnóstico completo do Sistema Enterprise de correções do Next.js 14
.DESCRIPTION
    Este script realiza verificações detalhadas do ambiente, configurações e integrações
    para garantir que o Sistema Enterprise de correções esteja funcionando corretamente.
.NOTES
    Versão: 1.0.0
    Data: 4 de junho de 2025
    Autor: Equipe Nova IPE
#>

param(
    [switch]$Repair = $false,
    [switch]$Verbose = $false
)

# Configuração de cores para saída
$colors = @{
    Success = 'Green'
    Info = 'Cyan'
    Warning = 'Yellow'
    Error = 'Red'
    Title = 'Blue'
}

# Função para exibir mensagens estilizadas
function Write-StatusMessage {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [ValidateSet('Success', 'Info', 'Warning', 'Error', 'Title')]
        [string]$Type = 'Info',
        
        [int]$IndentLevel = 0
    )
    
    $indent = "  " * $IndentLevel
    $prefix = switch ($Type) {
        'Success' { '✅ ' }
        'Info'    { 'ℹ️ ' }
        'Warning' { '⚠️ ' }
        'Error'   { '❌ ' }
        'Title'   { '🔍 ' }
    }
    
    Write-Host "$indent$prefix$Message" -ForegroundColor $colors[$Type]
}

# Banner de inicialização
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $colors.Title
Write-Host "║               NEXT.JS 14 - SISTEMA ENTERPRISE            ║" -ForegroundColor $colors.Title
Write-Host "║                    DIAGNÓSTICO AVANÇADO                  ║" -ForegroundColor $colors.Title
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $colors.Title
Write-Host ""

Write-StatusMessage "Iniciando diagnóstico completo..." -Type Title

#region Verificação de Arquivos
Write-StatusMessage "Verificando estrutura de arquivos do Sistema Enterprise..." -Type Title

$enterpriseFiles = @{
    "lib/enterprise-fixes/index.ts" = $false
    "lib/enterprise-fixes/fixes/polyfill-manager.ts" = $false
    "lib/enterprise-fixes/fixes/react-ssr-compatibility.ts" = $false
    "lib/enterprise-fixes/fixes/next-context-provider.tsx" = $false
    "lib/enterprise-fixes/fixes/dev-overlay-patch.ts" = $false
}

$filesOk = $true
foreach ($file in $enterpriseFiles.Keys) {
    $filePath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $filePath) {
        $enterpriseFiles[$file] = $true
        if ($Verbose) {
            Write-StatusMessage "Arquivo encontrado: $file" -Type Success -IndentLevel 1
        }
    } else {
        $filesOk = $false
        Write-StatusMessage "Arquivo não encontrado: $file" -Type Error -IndentLevel 1
    }
}

if ($filesOk) {
    Write-StatusMessage "Todos os arquivos do sistema Enterprise estão presentes" -Type Success
} else {
    Write-StatusMessage "Estrutura de arquivos incompleta" -Type Error
}

#endregion

#region Verificação do Layout
Write-StatusMessage "Analisando configuração do layout principal..." -Type Title

$layoutPath = Join-Path -Path (Get-Location) -ChildPath "app/layout.tsx"
if (Test-Path $layoutPath) {
    $layoutContent = Get-Content -Path $layoutPath -Raw
    
    $importChecks = @{
        "EnterpriseSystem" = $layoutContent -match "import '@/lib/enterprise-fixes'"
        "NextContextProvider" = $layoutContent -match "import.*NextContextProvider.*from.*/next-context-provider"
        "ContextProviderUsed" = $layoutContent -match "<NextContextProvider>"
    }
    
    $layoutConfigured = $true
    foreach ($check in $importChecks.Keys) {
        if ($importChecks[$check]) {
            if ($Verbose) {
                Write-StatusMessage "Layout: $check - OK" -Type Success -IndentLevel 1
            }
        } else {
            $layoutConfigured = $false
            Write-StatusMessage "Layout: $check - Não encontrado" -Type Error -IndentLevel 1
        }
    }
    
    if ($layoutConfigured) {
        Write-StatusMessage "Layout configurado corretamente" -Type Success
    } else {
        Write-StatusMessage "Layout não está configurado corretamente" -Type Error
    }
} else {
    Write-StatusMessage "Arquivo de layout não encontrado em app/layout.tsx" -Type Error
}
#endregion

#region Verificação PNPM
Write-StatusMessage "Verificando configuração do PNPM..." -Type Title

$pnpmConfigured = $true
$pnpmWorkspacePath = Join-Path -Path (Get-Location) -ChildPath "pnpm-workspace.yaml"

if (Test-Path $pnpmWorkspacePath) {
    Write-StatusMessage "Arquivo pnpm-workspace.yaml encontrado" -Type Success -IndentLevel 1
} else {
    $pnpmConfigured = $false
    Write-StatusMessage "Arquivo pnpm-workspace.yaml não encontrado" -Type Warning -IndentLevel 1
}

# Verificar se PNPM está instalado
$pnpmInstalled = $null
try {
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmInstalled) {
        Write-StatusMessage "PNPM está instalado no sistema" -Type Success -IndentLevel 1
    }
} catch {
    $pnpmConfigured = $false
    Write-StatusMessage "PNPM não está instalado no sistema" -Type Error -IndentLevel 1
}

if ($pnpmConfigured) {
    Write-StatusMessage "Configuração PNPM OK" -Type Success
} else {
    Write-StatusMessage "Configuração PNPM incompleta" -Type Warning
    
    if ($Repair) {
        Write-StatusMessage "Reparando configuração PNPM..." -Type Info
        try {
            if (-not $pnpmInstalled) {
                Write-StatusMessage "Instalando PNPM globalmente..." -Type Info -IndentLevel 1
                npm install -g pnpm
            }
            
            if (-not (Test-Path $pnpmWorkspacePath)) {
                Write-StatusMessage "Criando pnpm-workspace.yaml..." -Type Info -IndentLevel 1
                @"
onlyBuiltDependencies:
  - sharp
"@ | Out-File -FilePath $pnpmWorkspacePath -Encoding utf8
            }
            
            Write-StatusMessage "Configuração PNPM reparada" -Type Success
        } catch {
            Write-StatusMessage "Falha ao reparar configuração PNPM: $_" -Type Error
        }
    }
}
#endregion

#region Verificação de Redundâncias
Write-StatusMessage "Verificando arquivos redundantes..." -Type Title

$redundantFiles = @(
    "lib/use-layout-effect-patch.ts",
    "lib/dev-mode-polyfills.js",
    "lib/dev-overlay-polyfill.js",
    "lib/next-head-polyfill.ts",
    "lib/suppress-layout-effect-warning.js",
    "lib/action-queue-provider.js",
    "ssr-polyfills.js"
)

$foundRedundant = $false
foreach ($file in $redundantFiles) {
    $filePath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $filePath) {
        $foundRedundant = $true
        Write-StatusMessage "Arquivo redundante encontrado: $file" -Type Warning -IndentLevel 1
        
        if ($Repair) {
            try {
                # Criar diretório de backup se não existir
                $backupDir = Join-Path -Path (Get-Location) -ChildPath "archive/redundant-files"
                if (-not (Test-Path $backupDir)) {
                    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
                }
                
                # Criar backup e remover arquivo
                $fileName = Split-Path $filePath -Leaf
                $backupPath = Join-Path -Path $backupDir -ChildPath $fileName
                Copy-Item -Path $filePath -Destination $backupPath -Force
                Remove-Item -Path $filePath -Force
                
                Write-StatusMessage "  → Arquivo movido para: archive/redundant-files/$fileName" -Type Success -IndentLevel 2
            } catch {
                Write-StatusMessage "  → Falha ao mover arquivo: $_" -Type Error -IndentLevel 2
            }
        }
    }
}

if (-not $foundRedundant) {
    Write-StatusMessage "Nenhum arquivo redundante encontrado" -Type Success
} elseif (-not $Repair) {
    Write-StatusMessage "Execute com -Repair para mover arquivos redundantes" -Type Info
}
#endregion

#region Análise de Conformidade
Write-StatusMessage "Analisando conformidade com padrões Enterprise..." -Type Title

# Pontuação de conformidade
$complianceScore = 100
$complianceIssues = @()

# Verificar arquivo package.json para uso consistente de PNPM
$packageJsonPath = Join-Path -Path (Get-Location) -ChildPath "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
    
    # Verificar scripts
    if ($packageJson.scripts -and ($packageJson.scripts.PSObject.Properties.Name -contains "prepare")) {
        if ($packageJson.scripts.prepare -match "npm|yarn" -and -not $packageJson.scripts.prepare -match "pnpm") {
            $complianceScore -= 5
            $complianceIssues += "Scripts usando npm/yarn em vez de pnpm"
        }
    }
    
    # Verificar dependências excessivas
    $dependencyCount = 0
    if ($packageJson.dependencies) {
        $dependencyCount += $packageJson.dependencies.PSObject.Properties.Count
    }
    if ($packageJson.devDependencies) {
        $dependencyCount += $packageJson.devDependencies.PSObject.Properties.Count
    }
    
    if ($dependencyCount -gt 60) {
        $complianceScore -= 10
        $complianceIssues += "Excesso de dependências ($dependencyCount > 60)"
    } elseif ($dependencyCount -gt 40) {
        $complianceScore -= 5
        $complianceIssues += "Número elevado de dependências ($dependencyCount > 40)"
    }
}

# Verificar next.config.js
$nextConfigPath = Join-Path -Path (Get-Location) -ChildPath "next.config.js"
if (Test-Path $nextConfigPath) {
    $nextConfigContent = Get-Content -Path $nextConfigPath -Raw
    
    # Verificar complexidade da configuração
    $configLines = ($nextConfigContent -split "`n").Count
    
    if ($configLines -gt 100) {
        $complianceScore -= 15
        $complianceIssues += "Arquivo next.config.js muito complexo ($configLines linhas > 100)"
    } elseif ($configLines -gt 50) {
        $complianceScore -= 5
        $complianceIssues += "Arquivo next.config.js moderadamente complexo ($configLines linhas > 50)"
    }
    
    # Verificar uso excessivo de configurações experimentais
    if ($nextConfigContent -match "experimental" -and $nextConfigContent -match "transpilePackages") {
        $complianceScore -= 5
        $complianceIssues += "Uso excessivo de configurações experimentais"
    }
}

# Exibir pontuação de conformidade
Write-StatusMessage "Pontuação de conformidade Enterprise: $complianceScore/100" -Type $(
    if ($complianceScore -ge 90) { "Success" }
    elseif ($complianceScore -ge 70) { "Info" }
    elseif ($complianceScore -ge 50) { "Warning" }
    else { "Error" }
)

if ($complianceIssues.Count -gt 0) {
    Write-StatusMessage "Problemas identificados:" -Type Warning
    foreach ($issue in $complianceIssues) {
        Write-StatusMessage $issue -Type Warning -IndentLevel 1
    }
}
#endregion

#region Resumo Final
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $colors.Title
Write-Host "║                    RESUMO DO DIAGNÓSTICO                 ║" -ForegroundColor $colors.Title
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $colors.Title
Write-Host ""

$overallStatus = "Success"
if (-not $filesOk -or -not $layoutConfigured -or -not $pnpmConfigured -or $complianceScore -lt 50) {
    $overallStatus = "Error"
} elseif ($foundRedundant -or $complianceScore -lt 80) {
    $overallStatus = "Warning"
}

Write-StatusMessage "Estrutura de arquivos: $(if ($filesOk) {"OK"} else {"Incompleta"})" -Type $(if ($filesOk) {"Success"} else {"Error"})
Write-StatusMessage "Configuração do layout: $(if ($layoutConfigured) {"OK"} else {"Problemas encontrados"})" -Type $(if ($layoutConfigured) {"Success"} else {"Error"})
Write-StatusMessage "Configuração PNPM: $(if ($pnpmConfigured) {"OK"} else {"Problemas encontrados"})" -Type $(if ($pnpmConfigured) {"Success"} else {"Warning"})
Write-StatusMessage "Arquivos redundantes: $(if ($foundRedundant) {"Encontrados"} else {"Não encontrados"})" -Type $(if ($foundRedundant) {"Warning"} else {"Success"})
Write-StatusMessage "Conformidade Enterprise: $complianceScore/100" -Type $(
    if ($complianceScore -ge 90) { "Success" }
    elseif ($complianceScore -ge 70) { "Info" }
    elseif ($complianceScore -ge 50) { "Warning" }
    else { "Error" }
)

Write-Host ""
if ($overallStatus -eq "Success") {
    Write-Host "🎉 Sistema Enterprise implementado com sucesso! 🎉" -ForegroundColor $colors.Success
    Write-Host "   Sua aplicação está pronta para produção." -ForegroundColor $colors.Success
} elseif ($overallStatus -eq "Warning") {
    Write-Host "⚠️ Sistema Enterprise implementado com avisos! ⚠️" -ForegroundColor $colors.Warning
    Write-Host "   Revise os avisos acima para melhorar a configuração." -ForegroundColor $colors.Warning
    Write-Host "   Para corrigir problemas automaticamente, execute: ./enterprise-diagnostic.ps1 -Repair" -ForegroundColor $colors.Info
} else {
    Write-Host "❌ Sistema Enterprise com problemas críticos! ❌" -ForegroundColor $colors.Error
    Write-Host "   Corrija os erros mencionados acima antes de prosseguir." -ForegroundColor $colors.Error
    Write-Host "   Para tentar corrigir automaticamente, execute: ./enterprise-diagnostic.ps1 -Repair" -ForegroundColor $colors.Info
}

Write-Host ""
Write-Host "Próximos passos:"
Write-Host "1. Execute 'pnpm dev' para testar o servidor de desenvolvimento" -ForegroundColor $colors.Info
Write-Host "2. Execute 'pnpm build' para validar o build de produção" -ForegroundColor $colors.Info
Write-Host "3. Monitore o console para garantir que não há erros" -ForegroundColor $colors.Info
Write-Host ""
#endregion
