# Script para limpar arquivos de correção obsoletos após a reorganização
# Versão: 30 de maio de 2025

# Cores para output
$greenColor = [System.ConsoleColor]::Green
$yellowColor = [System.ConsoleColor]::Yellow
$cyanColor = [System.ConsoleColor]::Cyan
$whiteColor = [System.ConsoleColor]::White
$redColor = [System.ConsoleColor]::Red

Write-Host -ForegroundColor $cyanColor "`n============================================"
Write-Host -ForegroundColor $greenColor "  Limpeza de arquivos de correção obsoletos"
Write-Host -ForegroundColor $cyanColor "============================================`n"

# Verificar primeiro se a nova estrutura está no lugar
if (-Not (Test-Path "core\next-fixes\index.js")) {
    Write-Host -ForegroundColor $redColor "❌ Erro: A nova estrutura de correções não foi encontrada!"
    Write-Host -ForegroundColor $redColor "Por favor, implemente a nova estrutura antes de remover os arquivos antigos.`n"
    exit 1
}

# Lista de arquivos obsoletos
$obsoleteFiles = @(
    "nextjs-hydration-webpack-fix.js",
    "webpack-ssr-fix.js",
    "webpack-ssr-fix-plugin.js",
    "webpack-ssr-fix-plugin-simple.js",
    "webpack-factory-fix.js",
    "webpack-factory-fix-simple.js", 
    "webpack-factory-fix-enhanced.js",
    "webpack-fix.js",
    "webpack-patch.js",
    "webpack-patch-simple.js",
    "ssr-globals-plugin.js",
    "ssr-globals-polyfill.js",
    "ssr-global-polyfill.js",
    "ssr-polyfill.js",
    "ultra-simple-ssr-plugin.js",
    "minimal-ssr-plugin.js",
    "lib/global-polyfills.js",
    "lib/server-side-polyfills.js",
    "verify-webpack-plugins.js",
    "verify-hydration-fix.js",
    "solucao-definitiva.js",
    "ultimate-nextjs-fix.js",
    "verify-definitive-fix.js"
)

# Verificar e backupear arquivos antes de remover
$backupDir = "recovery-backups/fixes-backup-$(Get-Date -Format ''yyyyMMdd-HHmmss'')"
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

foreach ($file in $obsoleteFiles) {
    $filePath = Join-Path -Path $PSScriptRoot -ChildPath $file
    if (Test-Path -Path $filePath) {
        $fileDir = Split-Path -Path $file -Parent
        $backupFilePath = Join-Path -Path $backupDir -ChildPath $file
        $backupFileDir = Split-Path -Path $backupFilePath -Parent
        
        if (!(Test-Path -Path $backupFileDir)) {
            New-Item -Path $backupFileDir -ItemType Directory -Force | Out-Null
        }
        
        # Fazer backup
        Copy-Item -Path $filePath -Destination $backupFilePath
        Write-Host " Backup de $file criado em $backupFilePath"
        
        # Remover arquivo
        Remove-Item -Path $filePath
        Write-Host -ForegroundColor $greenColor " Arquivo $file removido"
    }
    else {
        Write-Host -ForegroundColor $yellowColor "? Arquivo $file n�o encontrado, ignorando"
    }
}

Write-Host -ForegroundColor $cyanColor "`n Limpeza concluída. Todos os arquivos de correção obsoletos foram removidos."
Write-Host -ForegroundColor $cyanColor " Backups foram armazenados em: $backupDir"
Write-Host -ForegroundColor $greenColor "`n A nova estrutura organizada de correções está em: core/next-fixes/`n"

# Sugestão para o próximo passo
Write-Host -ForegroundColor $cyanColor "Próximo passo:"
Write-Host "Execute o script de inicialização otimizada:"
Write-Host -ForegroundColor $whiteColor "   .\start-optimized.ps1"
Write-Host -ForegroundColor $cyanColor "`nPara mais informações, consulte a documentação:"
Write-Host -ForegroundColor $whiteColor "   docs/next-fixes-architecture.md`n"
