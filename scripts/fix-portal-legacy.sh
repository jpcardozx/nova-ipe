#!/bin/bash

# Script de Correção Remota do Portal Legado
# Baseado na análise técnica realizada

set -e

PORTAL_URL="portal.imobiliariaipe.com.br"
PORTAL_IP="187.45.193.173"
SERVER_HOST="hm2662.locaweb.com.br"

echo "🛠️  SCRIPT DE CORREÇÃO REMOTA - PORTAL LEGADO"
echo "=============================================="
echo "Servidor: $PORTAL_URL ($PORTAL_IP)"
echo "Hospedagem: Locaweb ($SERVER_HOST)"
echo "Data: $(date)"
echo ""

# Função para testar conectividade
test_connectivity() {
    echo "🔍 Testando conectividade..."
    
    # Teste HTTP
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$PORTAL_URL || echo "000")
    echo "HTTP Status: $HTTP_STATUS"
    
    # Teste HTTPS
    HTTPS_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://$PORTAL_URL || echo "000")
    echo "HTTPS Status: $HTTPS_STATUS"
    
    return 0
}

# Função para extrair informações detalhadas do erro
analyze_error() {
    echo ""
    echo "🔍 Analisando erro detalhado..."
    
    # Capturar resposta HTTP completa
    HTTP_RESPONSE=$(curl -s http://$PORTAL_URL 2>/dev/null || echo "Falha na requisição")
    
    echo "Resposta do servidor:"
    echo "===================="
    echo "$HTTP_RESPONSE"
    echo "===================="
    
    # Extrair informações específicas do suPHP
    if echo "$HTTP_RESPONSE" | grep -q "suPHP"; then
        echo ""
        echo "✅ Erro suPHP confirmado!"
        
        # Extrair o caminho do script
        SCRIPT_PATH=$(echo "$HTTP_RESPONSE" | grep -o '"/[^"]*index\.php"' | tr -d '"' || echo "Não identificado")
        echo "Caminho do script: $SCRIPT_PATH"
        
        # Extrair versão do suPHP
        SUPHP_VERSION=$(echo "$HTTP_RESPONSE" | grep -o 'suPHP [0-9.]*' || echo "Não identificado")
        echo "Versão suPHP: $SUPHP_VERSION"
    fi
}

# Função para tentar diferentes abordagens de acesso
try_access_methods() {
    echo ""
    echo "🔧 Tentando diferentes métodos de acesso..."
    
    # 1. Tentar acessar diretórios específicos
    echo "1. Testando acesso a diretórios comuns..."
    
    COMMON_PATHS=("admin" "wp-admin" "administrator" "manager" "phpmyadmin" "cpanel" "webmail")
    
    for path in "${COMMON_PATHS[@]}"; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$PORTAL_URL/$path" 2>/dev/null || echo "000")
        if [ "$STATUS" != "500" ] && [ "$STATUS" != "000" ]; then
            echo "  ✅ /$path - Status: $STATUS"
        else
            echo "  ❌ /$path - Status: $STATUS"
        fi
    done
    
    # 2. Tentar arquivos estáticos
    echo ""
    echo "2. Testando arquivos estáticos..."
    
    STATIC_FILES=("robots.txt" "favicon.ico" "sitemap.xml" ".htaccess")
    
    for file in "${STATIC_FILES[@]}"; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$PORTAL_URL/$file" 2>/dev/null || echo "000")
        echo "  $file - Status: $STATUS"
    done
}

# Função para gerar comandos de correção específicos
generate_fix_commands() {
    echo ""
    echo "🔧 COMANDOS DE CORREÇÃO PARA O ADMINISTRADOR"
    echo "============================================"
    
    echo ""
    echo "# 1. ACESSO VIA SSH/FTP (Locaweb)"
    echo "# Usar credenciais da conta de hospedagem Locaweb"
    echo "ssh usuario@$SERVER_HOST"
    echo "# ou via FTP:"
    echo "ftp $PORTAL_IP"
    
    echo ""
    echo "# 2. VERIFICAR ESTRUTURA DE ARQUIVOS"
    echo "ls -la /home/httpd/html/"
    echo "ls -la /home/httpd/html/index.php"
    echo "stat /home/httpd/html/index.php"
    
    echo ""
    echo "# 3. VERIFICAR CONFIGURAÇÃO SUPHP"
    echo "find /etc -name 'suphp.conf' 2>/dev/null"
    echo "grep -n min_uid /etc/suphp/suphp.conf"
    echo "cat /etc/suphp/suphp.conf"
    
    echo ""
    echo "# 4. CORREÇÃO COMUM - AJUSTAR PROPRIETÁRIO"
    echo "# Descobrir usuário da conta:"
    echo "id \$(whoami)"
    echo "ls -la /home/httpd/"
    echo ""
    echo "# Corrigir proprietário (adaptar usuario_conta):"
    echo "chown -R usuario_conta:usuario_conta /home/httpd/html/"
    echo "chmod 755 /home/httpd/html/"
    echo "find /home/httpd/html/ -name '*.php' -exec chmod 644 {} \\;"
    echo "find /home/httpd/html/ -type d -exec chmod 755 {} \\;"
    
    echo ""
    echo "# 5. CORREÇÃO ALTERNATIVA - AJUSTAR SUPHP"
    echo "# (Menos recomendado - verificar com suporte Locaweb)"
    echo "# Editar /etc/suphp/suphp.conf"
    echo "# Alterar min_uid para um valor menor (ex: 100)"
    echo "# Reiniciar Apache: service apache2 restart"
    
    echo ""
    echo "# 6. VERIFICAR LOGS"
    echo "tail -f /var/log/apache2/error.log"
    echo "tail -f /var/log/suphp.log"
    echo "grep 'suPHP' /var/log/apache2/error.log"
    
    echo ""
    echo "# 7. TESTE APÓS CORREÇÃO"
    echo "curl -I http://$PORTAL_URL"
    echo "curl -s http://$PORTAL_URL | head -20"
}

# Função para contato com suporte
generate_support_info() {
    echo ""
    echo "📞 INFORMAÇÕES PARA CONTATO COM SUPORTE LOCAWEB"
    echo "==============================================="
    
    echo ""
    echo "Domínio: $PORTAL_URL"
    echo "IP: $PORTAL_IP"
    echo "Servidor: $SERVER_HOST"
    echo ""
    echo "Problemas relatados:"
    echo "1. Erro suPHP: 'UID of script \"/home/httpd/html/index.php\" is smaller than min_uid'"
    echo "2. Certificado SSL incorreto (*.websiteseguro.com ao invés de portal.imobiliariaipe.com.br)"
    echo "3. HTTP 500 Internal Server Error em todas as requisições PHP"
    echo ""
    echo "Ações necessárias:"
    echo "1. Corrigir proprietário dos arquivos PHP ou ajustar configuração suPHP"
    echo "2. Instalar certificado SSL válido para portal.imobiliariaipe.com.br"
    echo ""
    echo "Contato Locaweb: https://www.locaweb.com.br/ajuda/"
    echo "Telefone: 4004-4040"
}

# Executar todas as funções
main() {
    test_connectivity
    analyze_error
    try_access_methods
    generate_fix_commands
    generate_support_info
    
    echo ""
    echo "✅ Diagnóstico completo realizado!"
    echo "📋 Próximos passos:"
    echo "   1. Contatar administrador/Locaweb com as informações acima"
    echo "   2. Executar comandos de correção"
    echo "   3. Verificar funcionamento"
    echo "   4. Instalar certificado SSL correto"
}

# Executar script principal
main