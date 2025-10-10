#!/bin/bash
# ENGENHARIA REVERSA 2: Timing & Pattern Analysis

echo "⏱️ === TIMING ATTACK & PATTERN ANALYSIS ==="

echo "🔍 1. TIMING ANALYSIS - Identificando onde falha:"
echo "Medindo tempo de resposta para diferentes endpoints..."

endpoints=(
    "/"
    "/wp-admin/"
    "/wp-login.php" 
    "/wp-content/"
    "/wp-includes/"
    "/xmlrpc.php"
    "/?author=1"
)

for endpoint in "${endpoints[@]}"; do
    timing=$(curl -s -o /dev/null -w "%{time_total}" "https://portal.imobiliariaipe.com.br${endpoint}")
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://portal.imobiliariaipe.com.br${endpoint}")
    echo "⏱️ ${endpoint}: ${timing}s (HTTP ${status})"
done

echo -e "\n🔍 2. ERROR PATTERN RECOGNITION:"
# Capturar padrões específicos do erro
error_content=$(curl -s https://portal.imobiliariaipe.com.br)
echo "🚨 Error type detected:"
echo "$error_content" | grep -E "(Fatal|Parse|database|connection|memory|timeout)" | head -5

echo -e "\n🔍 3. SERVER RESPONSE PATTERN:"
# Análise das respostas do servidor
for i in {1..3}; do
    response_time=$(curl -s -o /dev/null -w "%{time_total}" https://portal.imobiliariaipe.com.br)
    echo "🌐 Request $i: ${response_time}s"
done

echo -e "\n🔍 4. REVERSE ENGINEERING VIA HTTP METHODS:"
methods=("GET" "POST" "HEAD" "OPTIONS")
for method in "${methods[@]}"; do
    status=$(curl -s -X "$method" -o /dev/null -w "%{http_code}" https://portal.imobiliariaipe.com.br)
    echo "🔧 $method: HTTP $status"
done

echo -e "\n🔍 5. CACHE & CDN DETECTION:"
curl -I https://portal.imobiliariaipe.com.br 2>/dev/null | grep -E "(Cache|CDN|CloudFlare|Age|ETag)"