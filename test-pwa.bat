@echo off
echo =====================================================
echo     SCRIPT DE TESTE PWA - NOVA IPE IMOBILIARIA
echo =====================================================
echo.

echo Limpando caches...
if exist ".next" rmdir /s /q .next

echo.
echo Compilando projeto em modo de producao...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Erro na compilacao! Verifique os erros acima.
    exit /b 1
)

echo.
echo ==============================================
echo Projeto compilado com sucesso!
echo ==============================================
echo.
echo Para testar a aplicacao, execute:
echo npm start
echo.
echo Em seguida, acesse:
echo - http://localhost:3000 - pagina principal
echo - http://localhost:3000/diagnostico - ferramentas de diagnostico
echo - http://localhost:3000/pwa-diagnostico - teste de PWA
echo - http://localhost:3000/mime-diagnostico - teste de MIME types
echo.
echo Para testes mais aprofundados de PWA, execute:
echo npm run test:pwa
echo ==============================================

choice /C YN /M "Deseja iniciar o servidor agora"

if %ERRORLEVEL% EQU 1 (
    echo.
    echo Iniciando servidor...
    npm start
)

echo Fim do script
