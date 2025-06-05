param (
    [switch]$production = $false
)

Write-Host "🚀 Iniciando configuração do ambiente de desenvolvimento Nova IPE..." -ForegroundColor Cyan

# Verificar se PNPM está instalado
$pnpmInstalled = $null
try {
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
} catch {
    # PNPM não está instalado
}

if (-not $pnpmInstalled) {
    Write-Host "⚠️ PNPM não encontrado. Instalando PNPM globalmente..." -ForegroundColor Yellow
    try {
        npm install -g pnpm
        Write-Host "✅ PNPM instalado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Falha ao instalar PNPM. Por favor, instale manualmente: npm install -g pnpm" -ForegroundColor Red
        exit 1
    }
}

# Limpar caches e pastas de build
Write-Host "🧹 Limpando caches e artefatos de build anteriores..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

# Remover package-lock.json e yarn.lock se existirem
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    Write-Host "   📝 package-lock.json removido" -ForegroundColor Gray
}

if (Test-Path "yarn.lock") {
    Remove-Item -Force "yarn.lock" -ErrorAction SilentlyContinue
    Write-Host "   📝 yarn.lock removido" -ForegroundColor Gray
}

# Gerar pnpm-lock.yaml se não existir
if (-not (Test-Path "pnpm-lock.yaml")) {
    Write-Host "🔧 Gerando pnpm-lock.yaml..." -ForegroundColor Cyan
    pnpm install --prefer-offline --frozen-lockfile=false
} else {
    # Instalar dependências com PNPM
    Write-Host "📦 Instalando dependências com PNPM..." -ForegroundColor Cyan
    pnpm install --prefer-offline
}

# Verificar se tudo foi instalado corretamente
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências. Verifique os logs acima." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green

# Iniciar o servidor de desenvolvimento ou construir para produção
if ($production) {
    Write-Host "🏗️ Construindo aplicação para produção..." -ForegroundColor Cyan
    pnpm build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🚀 Build concluído com sucesso! Execute 'pnpm start' para iniciar o servidor de produção." -ForegroundColor Green
    } else {
        Write-Host "❌ Falha no build. Verifique os erros acima." -ForegroundColor Red
    }
} else {
    Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Cyan
    Write-Host "💻 O aplicativo estará disponível em http://localhost:3000" -ForegroundColor Green
    pnpm dev
}
