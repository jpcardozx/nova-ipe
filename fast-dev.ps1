# Fast Development Starter Script for PowerShell
# Este script executa o Next.js em modo de desenvolvimento rápido
# com otimizações específicas para melhorar o tempo de inicialização

Write-Host "🚀 Nova Ipê - Inicializando em modo ultrarrápido..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor DarkCyan

# Configurações para otimizar desenvolvimento
$env:FAST_DEV = "true"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_DISABLE_SOURCEMAPS = "true"
$env:NEXT_MINIMAL_LOGGING = "1"
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings"

# Limpeza condicional do cache
if ($args -contains "--clean") {
    Write-Host "🧹 Limpando cache do Next.js..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cache limpo com sucesso!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Usando cache existente. Use --clean para limpar o cache." -ForegroundColor Gray
}

Write-Host "🔍 Verificando arquivos necessários..." -ForegroundColor Yellow

# Verificar e criar placeholder de imagem se script existir
if (Test-Path "scripts/create-simple-placeholder.js") {
    Write-Host "🖼️ Gerando placeholders de imagem..." -ForegroundColor Yellow
    node scripts/create-simple-placeholder.js
} else {
    Write-Host "⚠️ Script de placeholder não encontrado. Ignorando..." -ForegroundColor DarkYellow
}

# Verificar arquivos CSS que estavam faltando
$cssFiles = @(
    "app/styles/critical/critical.css",
    "app/styles/cls-optimizations.css",
    "app/styles/tailwind-compat.css",
    "app/cls-prevention.css"
)

foreach ($file in $cssFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "⚠️ $file não encontrado!" -ForegroundColor Red
    }
}

# Iniciar servidor de desenvolvimento otimizado
Write-Host "⚡ Iniciando servidor de desenvolvimento ultrarrápido..." -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor DarkCyan
pnpm run dev:turbo
