# Iniciar Next.js - Com Correções Completas
# Este script limpa o cache, verifica as correções e inicia o servidor

# Cabeçalho
Write-Host "╭───────────────────────────────────────────╮" -ForegroundColor Cyan
Write-Host "│         INICIAR NEXT.JS (COM FIXES)       │" -ForegroundColor Cyan
Write-Host "╰───────────────────────────────────────────╯" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar cache
Write-Host "🧹 Limpando cache Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Cache limpo com sucesso" -ForegroundColor Green
}
else {
    Write-Host "ℹ️ Cache já estava limpo" -ForegroundColor Blue
}

# 2. Verificar se correções estão aplicadas
Write-Host ""
Write-Host "🔍 Verificando se as correções estão aplicadas corretamente..." -ForegroundColor Yellow
node verify-fixes.js

# 3. Iniciar servidor
Write-Host ""
Write-Host "🚀 Iniciando servidor Next.js..." -ForegroundColor Green
Write-Host "⚡ Aplicação iniciada com todas as correções ativadas ⚡" -ForegroundColor Magenta
Write-Host ""
npm run dev
