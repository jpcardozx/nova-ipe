@echo off
echo =====================================================
echo    TESTE DE CORREÇÃO DO TAILWINDCSS PREFLIGHT
echo =====================================================

echo.
echo [1/1] Aplicando correção do preflight...
call node scripts\fix-tailwind-preflight.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao aplicar correção do tailwindcss/preflight
    exit /b 1
)

echo.
echo Correção aplicada com sucesso! Verifique os arquivos criados em node_modules\tailwindcss.
echo Para testar com o build completo, execute: test-vercel-build.bat
echo.
