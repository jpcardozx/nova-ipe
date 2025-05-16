@echo off
echo =====================================================
echo    TESTE DE BUILD DA NOVA IPE PARA VERCEL
echo =====================================================

echo.
echo [1/6] Executando script de fixacao do Rollup...
call node scripts\rollup-vercel-fix.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de fixacao do Rollup
    exit /b 1
)

echo.
echo [2/6] Executando script de fixacao do Tailwind CSS...
call node scripts\fix-tailwind.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de fixacao do Tailwind CSS
    exit /b 1
)

echo.
echo [3/6] Executando script de fixacao de importacoes...
call node scripts\fix-imports.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar script de fixacao de importacoes
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
echo [6/6] Executando build...
echo [INFO] Este processo pode demorar alguns minutos
call next build
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha no build do Next.js
    exit /b 1
)

echo.
echo =====================================================
echo    BUILD CONCLUIDO COM SUCESSO!
echo =====================================================
echo.
echo O projeto esta pronto para deploy na Vercel.
echo.

exit /b 0
