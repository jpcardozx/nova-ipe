# clean-service-worker.ps1
# Script para limpar caches e service worker

Write-Host "🧹 Limpando Service Worker e Caches..." -ForegroundColor Cyan

# Função para parar o Next.js se estiver rodando
function Stop-NextProcess {
    $nextProcess = Get-Process | Where-Object { $_.ProcessName -match "node" -and $_.CommandLine -match "next" }
    if ($nextProcess) {
        Write-Host "Parando processo do Next.js..." -ForegroundColor Yellow
        Stop-Process -Id $nextProcess.Id -Force
        Start-Sleep -Seconds 2
    }
}

# Limpar arquivos do Next.js
Write-Host "Limpando arquivos do Next.js..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item .next -Recurse -Force
}

# Limpar caches do navegador (Chrome/Edge)
Write-Host "Limpando caches do navegador..." -ForegroundColor Yellow
$browserCachePaths = @(
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
)

foreach ($path in $browserCachePaths) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -File | Remove-Item -Force -ErrorAction SilentlyContinue
    }
}

# Remover service worker
Write-Host "Removendo service worker..." -ForegroundColor Yellow
$swPath = "public/service-worker.js"
if (Test-Path $swPath) {
    Remove-Item $swPath -Force
}

# Reconstruir o service worker
Write-Host "Reconstruindo service worker..." -ForegroundColor Green
node build-service-worker.js

Write-Host "`n✨ Limpeza concluída! Por favor:" -ForegroundColor Green
Write-Host "1. Feche todas as abas do seu navegador" -ForegroundColor Yellow
Write-Host "2. Abra uma nova aba e acesse o projeto" -ForegroundColor Yellow
Write-Host "3. O service worker será reinstalado automaticamente`n" -ForegroundColor Yellow
