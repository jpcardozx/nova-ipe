@echo off
echo =====================================================
echo    TESTE DE BUILD UNIFICADO DA NOVA IPE PARA VERCEL
echo =====================================================

echo.
echo [1/2] Executando script unificado de preparacao para build...
node -e "try { require('./scripts/vercel-prepare-build.js'); console.log('Script executado com sucesso!'); } catch (error) { console.error('ERRO: ' + error.message); process.exit(1); }"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de preparacao
    exit /b 1
)

echo.
echo [2/2] Executando build do Next.js...
call next build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar build
    exit /b 1
)

echo.
echo Build concluido com sucesso!
echo.
