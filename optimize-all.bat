@echo off
REM Full performance optimization script
REM This script runs all optimization steps for the Nova IPE project

echo ===================================================
echo NOVA IPE - OTIMIZACAO COMPLETA DE DESEMPENHO
echo ===================================================

echo.
echo [1/5] Limpando caches e arquivos temporarios...
call pnpm run dev:clean

echo.
echo [2/5] Gerando imagens placeholder...
call pnpm run fix:placeholder

echo.
echo [3/5] Otimizando formatos de imagem...
call pnpm run optimize:images

echo.
echo [4/5] Verificando melhorias de desempenho...
call pnpm run check:performance

echo.
echo [5/5] Iniciando servidor otimizado...
set FAST_DEV=true
set NEXT_DISABLE_SOURCEMAPS=true
set NEXT_PUBLIC_ENABLE_WEB_VITALS=true

echo.
echo Iniciando servidor com monitoramento de performance...
call pnpm run dev:turbo

echo.
echo Otimizacao completa! O site agora deve carregar muito mais rapido.
