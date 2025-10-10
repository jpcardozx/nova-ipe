#!/bin/bash
# Análise Forense: O que mudou recentemente?

echo "🕵️ === ANÁLISE FORENSE: SITE FUNCIONAVA ANTES ==="

echo "🔍 1. TESTANDO DIFERENTES ASPECTOS DO SERVIDOR:"

# Teste se é problema de DNS/Redirecionamento
echo "📡 DNS e Redirecionamento:"
curl -s -I https://www.imobiliariaipe.com.br | head -3
curl -s -I https://imobiliariaipe.com.br | head -3

echo -e "\n🔍 2. TESTE DE DIFERENTES PROTOCOLOS:"
# HTTP vs HTTPS
echo "HTTP:"
curl -s -I http://portal.imobiliariaipe.com.br | head -2

echo "HTTPS:"
curl -s -I https://portal.imobiliariaipe.com.br | head -2

echo -e "\n🔍 3. ANÁLISE DE TIMING - Onde exatamente falha:"
echo "Tempo para diferentes recursos:"
time curl -s -o /dev/null https://portal.imobiliariaipe.com.br/ 2>&1 | tail -3
time curl -s -o /dev/null https://portal.imobiliariaipe.com.br/wp-includes/js/jquery/jquery.js 2>&1 | tail -3

echo -e "\n🔍 4. TESTE ESPECÍFICO - ARQUIVO QUE SABEMOS QUE EXISTE:"
# Testar arquivo que funcionou na análise anterior
echo "Arquivo functions.php (deve funcionar):"
curl -s -I https://portal.imobiliariaipe.com.br/wp-content/themes/ipeimoveis/functions.php | head -2

echo -e "\n🔍 5. POSSÍVEIS MUDANÇAS RECENTES:"
echo "- ✅ Banco de dados: Funcionando"
echo "- ✅ Tema ipeimoveis: Arquivos acessíveis"
echo "- ❌ wp-config.php: Retorna erro 500"
echo "- ❌ Index.php: Retorna erro 500"

echo -e "\n🔍 6. HIPÓTESES DO PROBLEMA:"
echo "A) 🔧 Mudança no servidor/hospedagem (versão PHP, configurações)"
echo "B) 📝 Corrupção do wp-config.php no servidor"
echo "C) 🔒 Mudança nas permissões de arquivo"
echo "D) 💾 Limite de memória PHP atingido"
echo "E) 🔌 Plugin ou tema corrompido durante atualização"

echo -e "\n🔍 7. TESTE CRÍTICO - VERIFICAR SE É WORDPRESS ESPECÍFICO:"
# Criar um arquivo PHP simples para testar se o PHP funciona
echo "Testando se PHP básico funciona (deve retornar erro 404, não 500):"
curl -s -I https://portal.imobiliariaipe.com.br/test-php-basico.php | head -2