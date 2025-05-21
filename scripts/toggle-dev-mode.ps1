# Toggle Development Mode
# Este script alterna entre diferentes modos de desenvolvimento para otimizar o tempo de compilação
# 
# Uso:
# .\scripts\toggle-dev-mode.ps1 -mode [fast|full]
# 
# Modo fast: Usa componentes leves e configuração mínima para compilação rápida
# Modo full: Restaura todos os componentes e configurações para desenvolvimento completo

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("fast", "full")]
    [string]$mode
)

$projectRoot = $PSScriptRoot + "\.."
$appFolder = "$projectRoot\app"
$versionsFolder = "$appFolder\_versoes"
$configsFolder = "$projectRoot"

function Backup-File {
    param($path)
    if (Test-Path $path) {
        Copy-Item -Path $path -Destination "$path.bak" -Force
        Write-Host "Backup criado: $path.bak" -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "`n========== MODO DE DESENVOLVIMENTO ATUAL ==========" -ForegroundColor Cyan
    if (Test-Path "$appFolder\page.tsx.prod") {
        Write-Host "Modo rápido ativado" -ForegroundColor Green
    } else {
        Write-Host "Modo completo ativado" -ForegroundColor Magenta
    }
    Write-Host "================================================`n" -ForegroundColor Cyan
}

# Função para aplicar modo rápido
function Set-FastMode {
    Write-Host "Aplicando modo de desenvolvimento RÁPIDO..." -ForegroundColor Green

    # Backup de arquivos importantes antes de substituir
    Backup-File "$appFolder\page.tsx"
    Backup-File "$projectRoot\next.config.js"
    Backup-File "$projectRoot\instrumentation.ts"
    
    # Substituir página principal pela versão simplificada
    Copy-Item -Path "$versionsFolder\page.tsx.dev" -Destination "$appFolder\page.tsx" -Force
    
    # Usar configurações simplificadas se existirem
    if (Test-Path "$configsFolder\next.config.js.dev") {
        Copy-Item -Path "$configsFolder\next.config.js.dev" -Destination "$configsFolder\next.config.js" -Force
    }
    
    if (Test-Path "$configsFolder\instrumentation.ts.dev") {
        Copy-Item -Path "$configsFolder\instrumentation.ts.dev" -Destination "$configsFolder\instrumentation.ts" -Force
    }
    
    Write-Host "Modo de desenvolvimento rápido aplicado com sucesso!" -ForegroundColor Green
    Write-Host "Compilação será significativamente mais rápida agora." -ForegroundColor Green
}

# Função para restaurar modo completo
function Set-FullMode {
    Write-Host "Restaurando modo de desenvolvimento COMPLETO..." -ForegroundColor Magenta
    
    # Restaurar backups, se existirem
    if (Test-Path "$appFolder\page.tsx.bak") {
        Copy-Item -Path "$appFolder\page.tsx.bak" -Destination "$appFolder\page.tsx" -Force
    } else {
        # Se não houver backup, usar a versão .prod
        Copy-Item -Path "$versionsFolder\page.tsx.prod" -Destination "$appFolder\page.tsx" -Force
    }
    
    if (Test-Path "$configsFolder\next.config.js.bak") {
        Copy-Item -Path "$configsFolder\next.config.js.bak" -Destination "$configsFolder\next.config.js" -Force
    } elseif (Test-Path "$configsFolder\next.config.js.prod") {
        Copy-Item -Path "$configsFolder\next.config.js.prod" -Destination "$configsFolder\next.config.js" -Force
    }
    
    if (Test-Path "$configsFolder\instrumentation.ts.bak") {
        Copy-Item -Path "$configsFolder\instrumentation.ts.bak" -Destination "$configsFolder\instrumentation.ts" -Force
    } elseif (Test-Path "$configsFolder\instrumentation.ts.prod") {
        Copy-Item -Path "$configsFolder\instrumentation.ts.prod" -Destination "$configsFolder\instrumentation.ts" -Force
    }
    
    Write-Host "Modo de desenvolvimento completo restaurado." -ForegroundColor Magenta
    Write-Host "Aviso: A compilação será mais lenta, mas todas as funcionalidades estão disponíveis." -ForegroundColor Yellow
}

# Limpar cache para garantir compilação limpa
function Clear-NextCache {
    Write-Host "Limpando cache do Next.js..." -ForegroundColor Blue
    
    # Apagar pasta .next
    if (Test-Path "$projectRoot\.next") {
        Remove-Item -Path "$projectRoot\.next" -Recurse -Force
    }
    
    # Apagar cache do node_modules
    if (Test-Path "$projectRoot\node_modules\.cache") {
        Remove-Item -Path "$projectRoot\node_modules\.cache" -Recurse -Force
    }
    
    Write-Host "Cache limpo com sucesso!" -ForegroundColor Blue
}

# Executar a função apropriada com base no modo escolhido
if ($mode -eq "fast") {
    Set-FastMode
} else {
    Set-FullMode
}

# Limpar cache
Clear-NextCache

# Mostrar status
Show-Status

# Próximos passos
Write-Host "Pronto! Execute 'npm run dev' para iniciar o servidor de desenvolvimento." -ForegroundColor Green
