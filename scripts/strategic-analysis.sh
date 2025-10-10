#!/bin/bash
# Estratégia 3: Análise Inteligente de Stack
echo "=== STRATEGIC WORDPRESS ANALYSIS ==="

echo "🔍 1. HEADER ANALYSIS - Detectando tecnologias:"
curl -I https://portal.imobiliariaipe.com.br 2>/dev/null | grep -E "(Server|X-Powered|X-Cache|X-|PHP)"

echo -e "\n🔍 2. WORDPRESS VERSION DETECTION:"
curl -s https://portal.imobiliariaipe.com.br/wp-includes/js/jquery/jquery.js 2>/dev/null | head -5 | grep -E "jQuery|version"

echo -e "\n🔍 3. THEME/PLUGIN LEAK ANALYSIS:"
curl -s https://portal.imobiliariaipe.com.br/wp-content/ 2>/dev/null | grep -E "(themes|plugins)" | head -10

echo -e "\n🔍 4. PHP ERROR EXTRACTION:"
curl -s https://portal.imobiliariaipe.com.br 2>/dev/null | grep -E "(Fatal error|Parse error|Warning|Notice)" | head -5

echo -e "\n🔍 5. DATABASE CONNECTION ERROR PATTERN:"
curl -s https://portal.imobiliariaipe.com.br 2>/dev/null | grep -iE "(database|connection|mysql|estabelecer)" | head -3