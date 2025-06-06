@echo off
echo Nova IPE - Validacao do Sistema Enterprise
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0validate-enterprise-fix.ps1" %*
pause
