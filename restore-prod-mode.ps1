# Script para restaurar o ambiente de produção
Write-Host "🔄 Restaurando ambiente de produção..." -ForegroundColor Cyan

# Restaurar os arquivos originais
Write-Host "📦 Restaurando arquivos originais..." -ForegroundColor Yellow
Copy-Item "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\instrumentation.ts.prod" "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\instrumentation.ts" -ErrorAction SilentlyContinue
Copy-Item "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\sentry.client.config.ts.prod" "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\sentry.client.config.ts" -ErrorAction SilentlyContinue
Copy-Item "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\sentry.server.config.ts.prod" "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\sentry.server.config.ts" -ErrorAction SilentlyContinue
Copy-Item "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\app\page.tsx.prod" "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\app\page.tsx" -ErrorAction SilentlyContinue
Copy-Item "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\next.config.js.prod" "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\next.config.js" -ErrorAction SilentlyContinue

# Limpar o cache do Next.js
Write-Host "🧹 Limpando cache do Next.js..." -ForegroundColor Magenta
Remove-Item -Recurse -Force "c:\Users\João Pedro Cardozo\OneDrive\Área de Trabalho\projetos\nova-ipe\.next" -ErrorAction SilentlyContinue

Write-Host "✅ Ambiente de produção restaurado!" -ForegroundColor Green
Write-Host "ℹ️  Agora execute 'npm run dev' ou 'pnpm dev' para iniciar o servidor" -ForegroundColor Cyan
