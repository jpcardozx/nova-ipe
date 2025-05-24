@echo off
echo 🚀 Nova Ipê - Inicialização Rápida
echo ===================================
echo.

echo 1. Aplicando correções e criando arquivos necessários...
call node scripts\fix-everything.js
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Erro ao aplicar correções
  pause
  exit /b 1
)

echo.
echo 2. Limpando cache do Next.js...
if exist .next (
  rmdir /s /q .next
  echo ✅ Cache limpo com sucesso
) else (
  echo ℹ️ Não há cache para limpar
)

echo.
echo 3. Iniciando servidor de desenvolvimento rápido...
echo ⚡ As otimizações de produção foram desativadas para desenvolvimento mais rápido

:: Configurar variáveis de ambiente
set FAST_DEV=true
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_SOURCEMAPS=true

:: Iniciar o servidor
npm run dev
