# Runs all Nova Ipê website fixes and optimizations
# Versão simplificada para evitar problemas com dependências

Write-Host "🛠️ Nova Ipê - Aplicando correções e otimizações" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor DarkCyan

# Criar arquivos CSS críticos
Write-Host "🎨 Criando arquivos CSS críticos..." -ForegroundColor Yellow
node scripts/create-critical-css.js

# Limpar cache do Next.js
Write-Host "🧹 Limpando cache do Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  Cache do Next.js limpo com sucesso!" -ForegroundColor Green
} else {
    Write-Host "  Diretório .next não encontrado, nenhuma limpeza necessária." -ForegroundColor Gray
}

# Verificar estrutura do projeto
Write-Host "🔍 Verificando estrutura do projeto..." -ForegroundColor Yellow

# Verificar mappers de imóveis
$mapperFiles = @(
    "lib\mapImovelToClient.ts",
    "core\mapImovelToClient.ts"
)

foreach ($file in $mapperFiles) {
    $path = Join-Path -Path $PSScriptRoot -ChildPath $file
    if (Test-Path $path) {
        Write-Host "  ✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file não encontrado!" -ForegroundColor Red
    }
}

# Verificar se a pasta public/images existe
$imagesDir = Join-Path -Path $PSScriptRoot -ChildPath "public\images"
if (-not (Test-Path $imagesDir)) {
    Write-Host "  📁 Criando diretório de imagens..." -ForegroundColor Yellow
    New-Item -Path $imagesDir -ItemType Directory -Force | Out-Null
}

# Verificar imagem OG
$ogImage = Join-Path -Path $imagesDir -ChildPath "og-image-2025.jpg"
if (-not (Test-Path $ogImage)) {
    Write-Host "  🖼️ Imagem OG não encontrada, criando placeholder..." -ForegroundColor Yellow
    
    # Criar um arquivo de texto indicando necessidade de uma imagem real
    $placeholderText = "Este é um placeholder para a imagem OG. Por favor, adicione uma imagem real chamada og-image-2025.jpg neste diretório."
    Set-Content -Path "$imagesDir\PLACEHOLDER-og-image-2025.txt" -Value $placeholderText
    
    Write-Host "  ℹ️ Placeholder de texto criado. Adicione uma imagem real quando possível." -ForegroundColor Gray
} else {
    Write-Host "  ✅ Imagem OG encontrada: $ogImage" -ForegroundColor Green
}

Write-Host "✅ Preparações concluídas!" -ForegroundColor Green
Write-Host ""
Write-Host "➡️ Agora execute './fast-dev.ps1' para iniciar o servidor em modo rápido" -ForegroundColor Cyan
