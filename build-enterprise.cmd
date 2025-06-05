@echo off
echo Nova IPE - Build de Produção Enterprise
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-enterprise.ps1" -production
pause
