@echo off
echo Nova IPE - Limpeza de Correcoes Legadas
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0cleanup-legacy-fixes.ps1" %*
pause
