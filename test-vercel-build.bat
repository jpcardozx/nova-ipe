@echo off
echo =====================================================
echo    TESTE DE BUILD DA NOVA IPE PARA VERCEL
echo =====================================================

echo.
echo [1/9] Verificando next.config.js...
call node scripts\verify-next-config.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao verificar next.config.js
    exit /b 1
)

echo.
echo [2/9] Diagnosticando e corrigindo paths...
call node scripts\diagnose-and-fix-paths.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao diagnosticar e corrigir paths
    exit /b 1
)

echo.
echo [3/9] Corrigindo módulo require-hook do Next.js...
call node scripts\fix-next-require-hook.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao corrigir módulo require-hook
    exit /b 1
)

echo.
echo [4/9] Corrigindo importações de módulos...
call node scripts\fix-module-imports.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao corrigir importações de módulos
    exit /b 1
)

echo.
echo [5/9] Criando stubs para componentes ausentes...
call node scripts\create-missing-stubs.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar stubs para componentes
    exit /b 1
)

echo.
echo [6/9] Corrigindo carousel otimizado...
call node scripts\fix-optimized-carousel.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao corrigir carousel otimizado
    exit /b 1
)

echo.
echo [7/9] Executando script de correcao do Autoprefixer...
call node scripts\autoprefixer-vercel-fix.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de correcao do Autoprefixer
    exit /b 1
)

echo.
echo [8/9] Sobrescrevendo processamento de CSS do Next.js...
call node scripts\override-nextjs-css-processing.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao sobrescrever processamento de CSS do Next.js
    exit /b 1
)

echo.
echo [9/9] Limpando cache do Next.js...
if exist .next (
    echo [INFO] Removendo pasta .next para garantir build limpo
    rd /s /q .next
)

echo.
echo Executando build otimizado...
echo [INFO] Este processo pode demorar alguns minutos
call node scripts\vercel-optimized-build.js
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha no build otimizado
    echo [RECUPERACAO] Tentando abordagem alternativa com modo de depuracao...
    
    echo.
    echo [DEBUG] Exibindo modulos instalados:
    call npm list tailwindcss postcss autoprefixer
    
    echo.
    echo [DEBUG] Verificando arquivos no diretorio node_modules\tailwindcss:
    if exist node_modules\tailwindcss dir node_modules\tailwindcss
    
    echo.
    echo [DEBUG] Tentando build com opcoes de depuracao...
    set NODE_OPTIONS=--trace-warnings --trace-deprecation
    call node scripts\vercel-optimized-build.js
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERRO CRITICO] Falha em todas as tentativas de build
        exit /b 1
    )
)

echo.
echo =====================================================
echo    BUILD CONCLUIDO COM SUCESSO!
echo =====================================================
echo.
echo O projeto esta pronto para deploy na Vercel.
echo.
echo Verificando arquivos CSS gerados:
if exist .next\static\css dir .next\static\css /b

echo.
pause
exit /b 0
