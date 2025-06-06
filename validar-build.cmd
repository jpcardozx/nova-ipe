@echo off
echo ===================================================
echo       Nova Ipe - Validação de Build Limpa
echo ===================================================
echo.

:: Limpar cache
call rimraf .next
echo ✅ Cache limpo

:: Executar validação de remediação
echo Verificando remediação...
call node validate-remediation-v2.js

echo.
echo ===================================================
echo         Construindo aplicação para produção
echo ===================================================
echo.

:: Iniciar build
call npm run build

echo.
echo Se a build foi concluída com sucesso, a remediação está funcionando corretamente!
echo.
pause
