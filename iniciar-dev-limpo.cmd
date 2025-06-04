@echo off
echo ===================================================
echo           Nova Ipe - Ambiente Limpo
echo ===================================================
echo.
echo Preparando ambiente de desenvolvimento otimizado...
echo.

:: Verificar remediação
echo Verificando estado da remediação...
call node validate-remediation-v2.js

:: Limpar cache
call rimraf .next
echo ✅ Cache limpo

:: Verificar instalacao de dependencias
if not exist node_modules (
  echo ⚠️ Instalando dependências (isso pode demorar um pouco)...
  call npm install
) else (
  echo ✅ Dependências já instaladas
)

echo.
echo ===================================================
echo           Iniciando servidor de desenvolvimento
echo ===================================================
echo.

:: Iniciar Next.js
call npm run dev
