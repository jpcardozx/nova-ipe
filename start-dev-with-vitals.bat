@echo off
echo Iniciando servidor Next.js com Web Vitals ativado...
set NEXT_PUBLIC_ENABLE_WEB_VITALS=true
set NEXT_PUBLIC_VITALS_DEBUG=true
npx next dev
