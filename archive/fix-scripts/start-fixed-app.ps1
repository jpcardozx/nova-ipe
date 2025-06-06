# Script para iniciar a aplicação com as correções definitivas

# Cores para output
$greenColor = [System.ConsoleColor]::Green
$yellowColor = [System.ConsoleColor]::Yellow
$cyanColor = [System.ConsoleColor]::Cyan
$whiteColor = [System.ConsoleColor]::White
$redColor = [System.ConsoleColor]::Red

Write-Host -ForegroundColor $greenColor "`nIniciando a aplicação com as correções definitivas de hydration e webpack`n"

# Verificar se as correções estão aplicadas
Write-Host -ForegroundColor $cyanColor "✅ Verificando correções..."
try {
    node verify-definitive-fix.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host -ForegroundColor $redColor "❌ Verificação de correções falhou. Abortando inicialização."
        exit 1
    }
}
catch {
    Write-Host -ForegroundColor $yellowColor "⚠️ Script de verificação não encontrado, continuando mesmo assim."
}

# Limpar cache
Write-Host -ForegroundColor $cyanColor "`n🧹 Limpando cache do Next.js..."
npm run clean

# Iniciar servidor de desenvolvimento
Write-Host -ForegroundColor $greenColor "`n🚀 Iniciando servidor de desenvolvimento com correções aplicadas...`n"
npm run dev
