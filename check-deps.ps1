param(
    [switch]$Install
)

Write-Host "VERIFICADOR DE PEER DEPENDENCIES" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js nao encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

try {
    $pnpmVersion = pnpm --version
    Write-Host "pnpm: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "pnpm nao encontrado. Instale com: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

Write-Host ""

if ($Install) {
    Write-Host "Executando verificacao com instalacao automatica..." -ForegroundColor Yellow
    node check-missing-deps.js --install
} else {
    Write-Host "Executando verificacao..." -ForegroundColor Cyan
    node check-missing-deps.js
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro durante a execucao!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Se houver dependencias criticas, execute: .\check-deps.ps1 -Install" -ForegroundColor White
Write-Host "2. Apos instalar as deps, execute: pnpm build" -ForegroundColor White
Write-Host "3. Se ainda houver erros, execute novamente o script" -ForegroundColor White