@echo off
echo =====================================================
echo    TESTE COMPLETO DE CORRECAO DO TAILWIND PREFLIGHT
echo =====================================================

echo.
echo [1/5] Aplicando correcao do globals.css...
node -e "const fs = require('fs'); const cssPath = './app/globals.css'; let content = fs.readFileSync(cssPath, 'utf8'); content = content.replace(/@import [\"']tailwindcss\/preflight[\"'];/g, '/* @import tailwindcss/preflight removido */'); content = content.replace(/@import [\"']tailwindcss\/theme.css[\"'];/g, '/* @import tailwindcss/theme.css removido */'); fs.writeFileSync(cssPath, content); console.log('CSS atualizado com sucesso!');"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao modificar globals.css
    exit /b 1
)

echo.
echo [2/5] Aplicando correcao dos arquivos de teste...
node -e "const fs = require('fs'); const paths = ['./app/test-tailwind/test.css', './app/test-tailwind/test-v4.css']; paths.forEach(cssPath => { if (fs.existsSync(cssPath)) { let content = fs.readFileSync(cssPath, 'utf8'); content = content.replace(/@import [\"']tailwindcss\/preflight[\"'];/g, '/* @import tailwindcss/preflight removido */'); fs.writeFileSync(cssPath, content); console.log(`${cssPath} atualizado!`); } });"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao modificar arquivos de teste
    exit /b 1
)

echo.
echo [3/5] Criando stubs do Tailwind...
call node scripts/create-tailwind-stubs.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar stubs do Tailwind
    exit /b 1
)

echo.
echo [4/5] Atualizando webpack config...
node -e "const fs = require('fs'); const path = require('path'); const nextConfigPath = './next.config.js'; let content = fs.readFileSync(nextConfigPath, 'utf8'); if (!content.includes('tailwindcss/preflight')) { let updated = content.replace(/config\.resolve\.alias = {/, \"config.resolve.alias = {\n      'tailwindcss/preflight': path.join(__dirname, 'node_modules/tailwindcss/preflight.css'),\n      'tailwindcss/theme.css': path.join(__dirname, 'node_modules/tailwindcss/theme.css'),\"); fs.writeFileSync(nextConfigPath, updated); console.log('next.config.js atualizado!'); } else { console.log('next.config.js já está configurado.'); }"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao atualizar webpack config
    exit /b 1
)

echo.
echo [5/5] Verificando configuracao do Tailwind...
node -e "const fs = require('fs'); const tailwindConfigPath = './tailwind.config.js'; let content = fs.readFileSync(tailwindConfigPath, 'utf8'); if (!content.includes('preflight: true')) { let updated = content.replace(/content: \[/, \"corePlugins: {\n    preflight: true,\n  },\n  content: [\"); fs.writeFileSync(tailwindConfigPath, updated); console.log('tailwind.config.js atualizado!'); } else { console.log('tailwind.config.js já está configurado.'); }"
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao verificar configuracao do Tailwind
    exit /b 1
)

echo.
echo Todas as correcoes aplicadas com sucesso!
echo Para testar o build completo, execute: npm run build:vercel
echo.
