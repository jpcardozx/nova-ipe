#!/bin/bash
# SEO Smoke Test - Verifica noindex e 403 para Googlebot
# Uso: ./scripts/seo-smoke-test.sh [URL]

set -e

URL="${1:-https://www.imobiliariaipe.com.br/}"
GOOGLEBOT_UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

echo "🔍 SEO Smoke Test para: $URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check HTTP Status
echo ""
echo "1️⃣ Verificando Status HTTP como Googlebot..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -A "$GOOGLEBOT_UA" "$URL")
echo "   Status: $STATUS"

if [[ "$STATUS" == "403" || "$STATUS" == "401" ]]; then
    echo "   ❌ ERRO: Googlebot está recebendo $STATUS!"
    exit 1
elif [[ "$STATUS" != "200" ]]; then
    echo "   ⚠️  AVISO: Status não é 200"
fi

# 2. Check X-Robots-Tag Header
echo ""
echo "2️⃣ Verificando X-Robots-Tag Header..."
HEADERS=$(curl -sI -A "$GOOGLEBOT_UA" "$URL")
if echo "$HEADERS" | grep -iq "x-robots-tag:.*noindex"; then
    echo "   ❌ ERRO: X-Robots-Tag com noindex encontrado!"
    echo "$HEADERS" | grep -i "x-robots-tag"
    exit 2
else
    echo "   ✅ Nenhum X-Robots-Tag noindex encontrado"
fi

# 3. Check Meta Robots Tag
echo ""
echo "3️⃣ Verificando <meta name=\"robots\"> no HTML..."
HTML=$(curl -s -A "$GOOGLEBOT_UA" "$URL")
if echo "$HTML" | grep -iq '<meta[^>]*name="robots"[^>]*content="[^"]*noindex'; then
    echo "   ❌ ERRO: Meta tag robots com noindex encontrada!"
    echo "$HTML" | grep -io '<meta[^>]*name="robots"[^>]*>'
    exit 3
else
    echo "   ✅ Nenhuma meta robots noindex encontrada"
fi

# 4. Check Canonical Tag
echo ""
echo "4️⃣ Verificando Canonical URL..."
CANONICAL=$(echo "$HTML" | grep -io '<link[^>]*rel="canonical"[^>]*href="[^"]*"' | sed -n 's/.*href="\([^"]*\)".*/\1/p')
if [ -n "$CANONICAL" ]; then
    echo "   ✅ Canonical encontrada: $CANONICAL"
    
    # Verificar se canonical aponta para vercel.app (preview)
    if echo "$CANONICAL" | grep -q "vercel\.app"; then
        echo "   ⚠️  AVISO: Canonical aponta para domínio Vercel Preview!"
    fi
else
    echo "   ⚠️  AVISO: Nenhuma canonical encontrada"
fi

# 5. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Teste concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Teste no Google Search Console"
echo "   2. Solicite indexação via 'Inspecionar URL'"
echo "   3. Monitore logs do Googlebot"
