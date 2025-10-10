#!/bin/bash
# ENGENHARIA REVERSA 1: WordPress Fingerprinting Avançado

echo "🕵️ === WORDPRESS REVERSE ENGINEERING ==="

echo "🔍 1. DETECTANDO VERSÃO EXATA DO WORDPRESS:"
# Múltiplas técnicas de detecção
curl -s https://portal.imobiliariaipe.com.br/wp-includes/js/wp-emoji-release.min.js 2>/dev/null | head -1
curl -s https://portal.imobiliariaipe.com.br/readme.html 2>/dev/null | grep -i version | head -1

echo -e "\n🔍 2. DETECTANDO TEMA CUSTOMIZADO:"
curl -s https://portal.imobiliariaipe.com.br/wp-content/themes/ 2>/dev/null | grep -oP 'href="[^"]*"' | grep themes

echo -e "\n🔍 3. MAPEAMENTO DE ARQUIVOS CRÍTICOS:"
critical_files=(
    "/wp-config.php"
    "/wp-content/debug.log"
    "/.htaccess"
    "/wp-content/themes/ipeimoveis/functions.php"
    "/wp-content/themes/ipeimoveis/style.css"
)

for file in "${critical_files[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://portal.imobiliariaipe.com.br${file}")
    echo "📄 ${file}: HTTP ${response}"
done

echo -e "\n🔍 4. ENGENHARIA REVERSA DO ERROR 500:"
# Técnica: forçar diferentes tipos de erro para identificar o exato
curl -s https://portal.imobiliariaipe.com.br/?p=999999 | grep -E "(Fatal|Parse|Warning)" | head -3
curl -s https://portal.imobiliariaipe.com.br/wp-admin/ | grep -E "(database|connection)" | head -2

echo -e "\n🔍 5. DETECÇÃO DE SECURITY HEADERS:"
curl -I https://portal.imobiliariaipe.com.br 2>/dev/null | grep -E "(X-Frame|X-XSS|X-Content|Strict)"