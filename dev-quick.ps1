# Nova Ipê - Aplicar Correções e Iniciar Servidor
# Este script aplica todas as correções e inicia o servidor de desenvolvimento rápido
# Versão PowerShell sem dependências

$ErrorActionPreference = "Stop"
$ScriptRoot = $PSScriptRoot

Write-Host "🛠️ Nova Ipê - Assistente de Inicialização Rápida" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor DarkCyan

# 1. Executar script de correção completa
Write-Host "1. Aplicando correções ao projeto..." -ForegroundColor Yellow
try {
    node $ScriptRoot\scripts\fix-everything.js
    if ($LASTEXITCODE -ne 0) { throw "Falha ao executar o script de correção" }
    Write-Host "✅ Correções aplicadas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao aplicar correções: $_" -ForegroundColor Red
    exit 1
}

# 2. Limpar cache do Next.js
Write-Host "`n2. Limpando cache do Next.js..." -ForegroundColor Yellow
$NextCacheDir = Join-Path -Path $ScriptRoot -ChildPath ".next"
if (Test-Path $NextCacheDir) {
    try {
        Remove-Item -Path $NextCacheDir -Recurse -Force
        Write-Host "✅ Cache do Next.js limpo com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao limpar cache do Next.js: $_" -ForegroundColor Red
        # Não falha se houver erro, apenas avisa
    }
} else {
    Write-Host "✅ Não há cache do Next.js para limpar" -ForegroundColor Gray
}

# 3. Verificar imagens necessárias
Write-Host "`n3. Verificando recursos essenciais..." -ForegroundColor Yellow
$ImagesDir = Join-Path -Path $ScriptRoot -ChildPath "public\images"
$OgImagePath = Join-Path -Path $ImagesDir -ChildPath "og-image-2025.jpg"

if (-not (Test-Path $OgImagePath)) {
    Write-Host "⚠️ Imagem OG não encontrada!" -ForegroundColor Yellow
    Write-Host "   Verificando se há um placeholder..." -ForegroundColor Gray
    
    $PlaceholderPath = Join-Path -Path $ImagesDir -ChildPath "PLACEHOLDER-og-image-2025.txt"
    if (-not (Test-Path $PlaceholderPath)) {
        # Criar diretório se não existir
        if (-not (Test-Path $ImagesDir)) {
            New-Item -Path $ImagesDir -ItemType Directory -Force | Out-Null
        }
        
        # Criar arquivo de placeholder com instruções
        $PlaceholderText = "Placeholder para og-image-2025.jpg - Por favor, adicione uma imagem real com este nome."
        Set-Content -Path $PlaceholderPath -Value $PlaceholderText
        Write-Host "✅ Arquivo placeholder criado: $PlaceholderPath" -ForegroundColor Green
    } else {
        Write-Host "✅ Placeholder já existente: $PlaceholderPath" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Imagem OG encontrada: $OgImagePath" -ForegroundColor Green
}

# 4. Iniciar servidor de desenvolvimento
Write-Host "`n4. Iniciando servidor de desenvolvimento rápido..." -ForegroundColor Yellow

# Definir variáveis de ambiente para otimização
$env:FAST_DEV = "true"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_DISABLE_SOURCEMAPS = "true"
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings"

# Iniciar o servidor
Write-Host "🚀 Iniciando o servidor Next.js..." -ForegroundColor Green
Write-Host "`nO servidor será executado com as seguintes otimizações:" -ForegroundColor Gray
Write-Host "  • Compilação rápida para desenvolvimento" -ForegroundColor Gray
Write-Host "  • Otimizações de produção desativadas" -ForegroundColor Gray
Write-Host "  • Cache otimizado" -ForegroundColor Gray
Write-Host "`nPressione Ctrl+C para encerrar o servidor quando terminar." -ForegroundColor Gray
Write-Host "`n-------------------------------------------------" -ForegroundColor DarkGray

# Executar o comando npm run dev
npm run dev
