#!/bin/bash

# Plano de Migração LocaWeb - Sem SSH/FTP
# Alternativas para acessar arquivos do servidor

echo "🚀 === PLANO DE MIGRAÇÃO LOCAWEB ==="

echo "📋 ETAPA 1: MÉTODOS DE ACESSO AOS ARQUIVOS"
echo ""
echo "A) 🌐 PAINEL LOCAWEB WEB:"
echo "   - https://painel.locaweb.com.br"
echo "   - Login: [seu_usuario_locaweb]"
echo "   - Procure: 'Gerenciador de Arquivos' ou 'File Manager'"
echo ""
echo "B) 📂 CPANEL (se disponível):"
echo "   - https://imobiliariaipe.com.br:2083"
echo "   - https://portal.imobiliariaipe.com.br:2083"
echo "   - Login com credenciais LocaWeb"
echo ""
echo "C) 🔧 PLESK (alternativa):"
echo "   - https://imobiliariaipe.com.br:8443"
echo "   - Interface de administração web"

echo ""
echo "📋 ETAPA 2: ARQUIVOS CRÍTICOS PARA BAIXAR"
echo ""
echo "Prioridade MÁXIMA:"
echo "✅ /wp-config.php (configurações do banco)"
echo "✅ /.htaccess (regras de URL)"
echo "✅ /wp-content/themes/ipeimoveis/ (tema customizado)"
echo "✅ /wp-content/plugins/ (plugins ativos)"
echo "✅ /wp-content/uploads/ (imagens/arquivos)"
echo ""
echo "Prioridade MÉDIA:"
echo "- /wp-content/mu-plugins/ (plugins obrigatórios)"
echo "- backup files (*.sql, *.zip)"
echo "- logs de erro (error.log, debug.log)"

echo ""
echo "📋 ETAPA 3: TESTE DE CONECTIVIDADE ALTERNATIVA"

# Teste WebDAV se disponível
echo "🔍 Testando WebDAV..."
curl -s -I https://imobiliariaipe.com.br/.well-known/carddav 2>/dev/null | head -1

echo ""
echo "🔍 Testando interfaces administrativas comuns:"

# Testar diferentes portas/interfaces
interfaces=(
    "https://imobiliariaipe.com.br:2083"  # cPanel
    "https://imobiliariaipe.com.br:8443"  # Plesk
    "https://imobiliariaipe.com.br:2082"  # cPanel inseguro
    "https://painel.imobiliariaipe.com.br"  # Painel customizado
)

for interface in "${interfaces[@]}"; do
    echo "Testando: $interface"
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$interface")
    if [ "$response" != "000" ]; then
        echo "✅ Resposta: HTTP $response"
    else
        echo "❌ Sem resposta"
    fi
done

echo ""
echo "📋 ETAPA 4: ESTRATÉGIAS DE RECUPERAÇÃO"
echo ""
echo "PLANO A - Painel Web LocaWeb:"
echo "1. Login no painel LocaWeb"
echo "2. Procurar 'Sites' ou 'Hospedagem'"
echo "3. Selecionar domínio imobiliariaipe.com.br"
echo "4. Abrir 'Gerenciador de Arquivos'"
echo "5. Navegar para public_html/"
echo "6. Baixar arquivos críticos"
echo ""
echo "PLANO B - Via cPanel/Plesk:"
echo "1. Acessar interface administrativa"
echo "2. Procurar 'File Manager' ou 'Arquivos'"
echo "3. Criar backup compactado (.zip)"
echo "4. Baixar via HTTP"
echo ""
echo "PLANO C - Via WordPress Admin (se funcionar):"
echo "1. Acessar https://www.imobiliariaipe.com.br/wp-admin/"
echo "2. Usar plugin de backup (Updraft, BackWPup)"
echo "3. Gerar e baixar backup completo"

echo ""
echo "📋 ETAPA 5: COMANDOS DE TESTE IMEDIATOS"
echo ""

echo "🔍 Verificando se WordPress Admin está acessível:"
curl -s -I https://www.imobiliariaipe.com.br/wp-admin/ | head -2

echo ""
echo "🔍 Verificando se temos acesso a arquivos específicos:"
critical_files=(
    "/wp-config.php"
    "/.htaccess"  
    "/wp-content/themes/ipeimoveis/style.css"
    "/wp-content/themes/ipeimoveis/functions.php"
)

for file in "${critical_files[@]}"; do
    echo "Testando: $file"
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://www.imobiliariaipe.com.br$file")
    echo "Status: HTTP $response"
done

echo ""
echo "✅ PRÓXIMAS AÇÕES RECOMENDADAS:"
echo "1. 🌐 Tentar acessar painel.locaweb.com.br"
echo "2. 📁 Procurar 'Gerenciador de Arquivos' no painel"
echo "3. 💾 Baixar wp-config.php e .htaccess"
echo "4. 🎨 Baixar pasta completa /wp-content/themes/ipeimoveis/"
echo "5. 🔌 Verificar plugins ativos em /wp-content/plugins/"