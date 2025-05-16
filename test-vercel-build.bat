@echo off
echo =====================================================
echo    TESTE DE BUILD DA NOVA IPE PARA VERCEL
echo =====================================================

echo.
echo [1/6] Executando script de correcao do Autoprefixer...
call node scripts\autoprefixer-vercel-fix.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de correcao do Autoprefixer
    exit /b 1
)

echo.
echo [2/6] Executando script de criacao de links para modulos criticos...
call node scripts\create-critical-module-links.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de criacao de links
    exit /b 1
)

echo.
echo [3/6] Executando script de correcao do CSS Loader...
call node scripts\fix-css-loader.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de correcao do CSS Loader
    exit /b 1
)

echo.
echo [4/6] Verificando instalacao do Tailwind CSS...
call npx tailwindcss --help > nul 2>&1
if %errorlevel% neq 0 (
    echo [ALERTA] Tailwind CSS nao esta acessivel. Tentando instalar...
    call npm install -D tailwindcss@3.3.5 postcss autoprefixer
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar Tailwind CSS
        exit /b 1
    )
) else (
    echo [INFO] Tailwind CSS esta instalado e acessivel
)

echo.
echo [5/6] Limpando cache do Next.js...
if exist .next (
    echo [INFO] Removendo pasta .next para garantir build limpo
    rd /s /q .next
)

echo.
echo [6/6] Executando build otimizado...
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
