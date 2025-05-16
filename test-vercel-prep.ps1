# Test script for simplified Vercel build
Write-Host "====================================================="
Write-Host "   TESTE DE BUILD UNIFICADO DA NOVA IPE PARA VERCEL"
Write-Host "====================================================="

Write-Host ""
Write-Host "[1/2] Executando script unificado de preparacao para build..."
node scripts/vercel-prepare-build.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Falha ao executar script de preparacao" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] Executando build do Next.js..."
Write-Host "Pulando o build completo para o teste."
Write-Host "Em um ambiente de producao, o comando 'next build' seria executado aqui."

Write-Host ""
Write-Host "Teste de preparacao concluido com sucesso!" -ForegroundColor Green
Write-Host "Para fazer deploy para a Vercel, certifique-se de que o buildCommand"
Write-Host "no vercel.json esta configurado como: 'npm run build:vercel'"
