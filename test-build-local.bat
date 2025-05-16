@echo off
REM Script para testar o processo de build localmente
REM Este script simula o ambiente Vercel tanto quanto possivel

echo [Test] Simulando build em ambiente similar ao Vercel
echo ====================================================

REM Definir variáveis de ambiente semelhantes ao Vercel
set VERCEL=1
set VERCEL_ENV=production
set NODE_ENV=production
set NEXT_TELEMETRY_DISABLED=1
set TAILWIND_MODE=build

echo [Test] Executando verificação de ambiente...
call node scripts\vercel-environment-check.js

IF %ERRORLEVEL% NEQ 0 (
  echo [Test] Verificação de ambiente falhou!
  exit /b 1
)

echo [Test] Executando build otimizado...
call node scripts\vercel-optimized-build.js

IF %ERRORLEVEL% NEQ 0 (
  echo [Test] Build falhou!
  exit /b 1
)

echo [Test] Processo de build concluído com sucesso!
echo [Test] O site deve estar pronto no diretório .next
exit /b 0
