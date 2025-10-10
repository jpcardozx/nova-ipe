#!/bin/bash

# WordPress Database Password Tester
# Testa diferentes senhas para identificar qual está no wp-config.php atual

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações do banco
DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
DB_NAME="wp_imobiliaria"
DB_USER="wp_imobiliaria"

echo -e "${BLUE}=======================================
🔍 WordPress Database Password Tester
=======================================${NC}"

echo -e "\n${YELLOW}🔍 Testando diferentes senhas de banco de dados${NC}"

# Lista de senhas para testar
PASSWORDS=(
    "Ipe@4693"                    # Senha atual confirmada
    "IpeImoveis@46933003"        # Senha FTP mencionada
    "Ipe@46933003"               # Variação
    "ipe@4693"                   # Minúscula
    "IPE@4693"                   # Maiúscula
    "wp_imobiliaria"             # Mesmo nome do usuário
    "123456"                     # Senha padrão simples
    ""                           # Senha vazia
)

echo -e "${BLUE}Testando ${#PASSWORDS[@]} senhas possíveis...${NC}\n"

for i in "${!PASSWORDS[@]}"; do
    password="${PASSWORDS[$i]}"
    password_display="${password:-'(vazia)'}"
    
    printf "${YELLOW}[$((i+1))/${#PASSWORDS[@]}] Testando: ${password_display}${NC}"
    
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$password" "$DB_NAME" -e "SELECT 'OK' as test;" &>/dev/null; then
        echo -e " ${GREEN}✅ FUNCIONA!${NC}"
        
        if [ "$password" = "Ipe@4693" ]; then
            echo -e "\n${GREEN}✅ A senha correta JÁ É a que temos: Ipe@4693${NC}"
            echo -e "${YELLOW}🔧 O problema NO É a senha do banco, é outra coisa!${NC}"
        else
            echo -e "\n${RED}⚠️  PROBLEMA IDENTIFICADO!${NC}"
            echo -e "Senha no servidor: ${RED}$password_display${NC}"
            echo -e "Senha correta: ${GREEN}Ipe@4693${NC}"
            echo -e "\n${BLUE}📝 Solução: Atualizar wp-config.php no servidor LocaWeb${NC}"
        fi
        
        break
    else
        echo -e " ${RED}❌${NC}"
    fi
done

echo -e "\n${YELLOW}🔍 Verificando se todas as senhas falharam...${NC}"

# Se chegou até aqui, nenhuma senha funcionou
all_failed=true
for password in "${PASSWORDS[@]}"; do
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$password" "$DB_NAME" -e "SELECT 'OK';" &>/dev/null; then
        all_failed=false
        break
    fi
done

if [ "$all_failed" = true ]; then
    echo -e "${RED}❌ Nenhuma senha testada funcionou!${NC}"
    echo -e "${YELLOW}Isso pode indicar:${NC}"
    echo "1. 🔒 Credenciais do banco mudaram"
    echo "2. 🌐 Firewall bloqueando conexões"
    echo "3. 🚫 Usuário foi desativado"
    echo "4. 💾 Servidor de banco indisponível"
fi

echo -e "\n${BLUE}=======================================
📊 Teste de senhas concluído!
=======================================${NC}"

# Verificar conexão atual mais uma vez
echo -e "\n${YELLOW}🔍 Teste final com nossa senha confirmada:${NC}"
if mysql -h "$DB_HOST" -u "$DB_USER" -p"Ipe@4693" "$DB_NAME" -e "SELECT 'Connection successful' as result, NOW() as timestamp;" 2>/dev/null; then
    echo -e "${GREEN}✅ Nossa senha Ipe@4693 AINDA FUNCIONA${NC}"
    echo -e "${RED}❌ O problema NÃO é a senha do banco de dados${NC}"
    echo -e "\n${YELLOW}🔧 Outras possíveis causas do erro 500:${NC}"
    echo "1. 📝 wp-config.php com sintaxe incorreta"
    echo "2. 🔌 Plugin conflito (W3 Total Cache, WPL Real Estate)"
    echo "3. 🎨 Tema 'ipeimoveis' com erros PHP"
    echo "4. 🚫 Permissões de arquivos incorretas"
    echo "5. 💾 Limite de memória PHP excedido"
    echo "6. 🔗 URL mismatch nas configurações"
else
    echo -e "${RED}❌ Conexão falhou - problema nas credenciais${NC}"
fi