# Script para iniciar o servidor Next.js com Web Vitals ativado
Write-Host "Iniciando servidor Next.js com Web Vitals ativado..." -ForegroundColor Green

# Definir variáveis de ambiente para Web Vitals
$env:NEXT_PUBLIC_ENABLE_WEB_VITALS = "true"
$env:NEXT_PUBLIC_VITALS_DEBUG = "true"

# Iniciar o servidor Next.js
npx next dev
