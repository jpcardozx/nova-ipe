#!/bin/bash

# ESTRATÉGIA ALTERNATIVA: Download via WordPress API e URLs diretas
# Quando SSH/FTP não funcionam

echo "🎯 === ESTRATÉGIA ALTERNATIVA DE RECUPERAÇÃO ==="

echo "🔍 MÉTODO 1: Explorar URLs diretas (LocaWeb patterns)"

echo "Testando URLs comuns LocaWeb:"
locaweb_urls=(
    "https://hm2662.locaweb.com.br"           # IP reverso do DNS
    "https://cpanel.hm2662.locaweb.com.br"    # cPanel no IP
    "https://webmail.imobiliariaipe.com.br"   # Webmail
    "https://ftp.imobiliariaipe.com.br"       # FTP web interface
)

for url in "${locaweb_urls[@]}"; do
    echo "Testando: $url"
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url")
    if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        echo "✅ $url - HTTP $response (ACESSÍVEL!)"
    else
        echo "❌ $url - HTTP $response"
    fi
done

echo ""
echo "🔍 MÉTODO 2: WordPress REST API (se ativo)"

echo "Testando WordPress REST API:"
curl -s https://www.imobiliariaipe.com.br/wp-json/ | head -200

echo ""
echo "🔍 MÉTODO 3: Procurar arquivos expostos/listáveis"

directories_to_test=(
    "/wp-content/"
    "/wp-content/themes/"
    "/wp-content/plugins/"
    "/wp-content/uploads/"
    "/wp-includes/"
    "/backups/"
    "/backup/"
    "/files/"
)

for dir in "${directories_to_test[@]}"; do
    echo "Testando diretório: $dir"
    response=$(curl -s "https://www.imobiliariaipe.com.br$dir" | grep -i "index of\|directory listing" | head -1)
    if [ -n "$response" ]; then
        echo "✅ $dir - Listável!"
    else
        echo "❌ $dir - Protegido"
    fi
done

echo ""
echo "🔍 MÉTODO 4: Tentar URLs específicas de backups automáticos"

backup_files=(
    "/backup.zip"
    "/site-backup.zip"
    "/wordpress-backup.zip"
    "/backup.sql"
    "/database.sql"
    "/wp-backup.zip"
    "/backup/latest.zip"
)

echo "Procurando arquivos de backup:"
for backup in "${backup_files[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://www.imobiliariaipe.com.br$backup")
    if [ "$status" = "200" ]; then
        echo "🎉 ENCONTRADO: $backup"
    fi
done

echo ""
echo "📋 MÉTODO 5: Contatos e Support LocaWeb"
echo ""
echo "Se métodos técnicos falharem, use suporte LocaWeb:"
echo "📞 Telefone: 0800 804 7778"
echo "💬 Chat: https://www.locaweb.com.br (canto inferior direito)"
echo "📧 Email: suporte@locaweb.com.br"
echo ""
echo "Informações para o suporte:"
echo "- Domínio: imobiliariaipe.com.br / portal.imobiliariaipe.com.br"
echo "- Problema: SSH e FTP não funcionam, precisa acessar arquivos"
echo "- Servidor: hm2662.locaweb.com.br (IP: 187.45.193.173)"
echo "- Solicitar: Ativar acesso SSH ou disponibilizar backup completo"