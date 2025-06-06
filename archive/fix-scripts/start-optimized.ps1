# Script para iniciar a aplicação com a estrutura organizada de correções
# Nova versão - 30 de Maio, 2025

# Cores para output
$greenColor = [System.ConsoleColor]::Green
$yellowColor = [System.ConsoleColor]::Yellow
$cyanColor = [System.ConsoleColor]::Cyan
$whiteColor = [System.ConsoleColor]::White
$redColor = [System.ConsoleColor]::Red

Write-Host -ForegroundColor $cyanColor "`n======================================="
Write-Host -ForegroundColor $greenColor "  Nova Ipê - Inicialização Otimizada"
Write-Host -ForegroundColor $cyanColor "======================================="

# Verificar se temos a nova estrutura no lugar
if (-Not (Test-Path "core\next-fixes\index.js")) {
    Write-Host -ForegroundColor $redColor "`n❌ Erro: Estrutura de correções não encontrada!`n"
    Write-Host "Pasta 'core/next-fixes' não existe ou está incompleta."
    exit 1
}

# Limpar cache do Next.js para garantir uma inicialização limpa
Write-Host -ForegroundColor $cyanColor "`n🧹 Limpando cache do Next.js..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host -ForegroundColor $greenColor "✅ Cache limpo com sucesso"
} else {
    Write-Host -ForegroundColor $yellowColor "⚠️ Diretório .next não encontrado. Ignorando limpeza de cache."
}

# Verificar se as correções estão aplicadas
Write-Host -ForegroundColor $cyanColor "`n🔍 Verificando estrutura de correções..."
try {
    node core/next-fixes/utils/verify.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host -ForegroundColor $redColor "`n❌ A verificação falhou. Veja os erros acima."
        $continuar = Read-Host -Prompt "Deseja continuar mesmo assim? (s/n)"
        if ($continuar -ne "s") {
            exit 1
        }
    }
} catch {
    Write-Host -ForegroundColor $yellowColor "⚠️ Erro ao executar verificação: $_"
    Write-Host -ForegroundColor $yellowColor "⚠️ Continuando mesmo assim..."
}

# Iniciar o servidor Next.js
Write-Host -ForegroundColor $greenColor "`n🚀 Iniciando servidor Next.js com correções otimizadas...`n"

npm run dev

# Verificar se o servidor inicializou corretamente
if ($LASTEXITCODE -ne 0) {
    Write-Host -ForegroundColor $redColor "`n[ERRO] Falha ao iniciar o servidor Next.js. Código: $LASTEXITCODE`n"
    exit $LASTEXITCODE
}
