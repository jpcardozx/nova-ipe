#!/bin/bash

# 🔐 Script de Importação de Banco de Dados via SSH
# Data: 6 de outubro de 2025
# Uso: ./scripts/db-import-ssh.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Carregar variáveis de ambiente
if [ -f ".env.ssh" ]; then
    source .env.ssh
else
    echo -e "${RED}❌ Erro: Arquivo .env.ssh não encontrado!${NC}"
    echo -e "${YELLOW}Crie o arquivo .env.ssh com as credenciais SSH${NC}"
    exit 1
fi

# Verificar se sshpass está instalado
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}❌ sshpass não está instalado!${NC}"
    echo -e "${YELLOW}Instale com: sudo apt-get install sshpass${NC}"
    exit 1
fi

# Opções SSH seguras
SSH_OPTIONS="-p ${SSH_PORT} -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no"

# Função para executar comando SSH
ssh_exec() {
    sshpass -p "${SSH_PASSWORD}" ssh ${SSH_OPTIONS} ${SSH_USER}@${SSH_HOST} "$1"
}

# Função para copiar arquivo para servidor
ssh_copy() {
    local_file=$1
    remote_path=$2
    sshpass -p "${SSH_PASSWORD}" scp ${SSH_OPTIONS} "${local_file}" ${SSH_USER}@${SSH_HOST}:"${remote_path}"
}

# Função para baixar arquivo do servidor
ssh_download() {
    remote_file=$1
    local_path=$2
    sshpass -p "${SSH_PASSWORD}" scp ${SSH_OPTIONS} ${SSH_USER}@${SSH_HOST}:"${remote_file}" "${local_path}"
}

# Menu de ajuda
show_help() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  🔐 Script de Importação de Banco de Dados via SSH       ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Comandos disponíveis:${NC}"
    echo ""
    echo -e "  ${YELLOW}test${NC}              - Testar conexão SSH"
    echo -e "  ${YELLOW}info${NC}              - Mostrar informações do servidor"
    echo -e "  ${YELLOW}databases${NC}         - Listar bancos de dados MySQL"
    echo -e "  ${YELLOW}backup <db>${NC}       - Criar backup de um banco de dados"
    echo -e "  ${YELLOW}import <file> <db>${NC} - Importar arquivo SQL para banco"
    echo -e "  ${YELLOW}export <db>${NC}       - Exportar banco de dados"
    echo -e "  ${YELLOW}shell${NC}             - Abrir shell interativo no servidor"
    echo -e "  ${YELLOW}mysql${NC}             - Abrir MySQL CLI no servidor"
    echo ""
    echo -e "${GREEN}Exemplos:${NC}"
    echo -e "  ./scripts/db-import-ssh.sh test"
    echo -e "  ./scripts/db-import-ssh.sh databases"
    echo -e "  ./scripts/db-import-ssh.sh backup imobiliariaipe1"
    echo -e "  ./scripts/db-import-ssh.sh import backup.sql imobiliariaipe1"
    echo ""
}

# Testar conexão
test_connection() {
    echo -e "${BLUE}🔍 Testando conexão SSH...${NC}"
    if ssh_exec "echo 'OK'"; then
        echo -e "${GREEN}✅ Conexão SSH bem-sucedida!${NC}"
        echo -e "${GREEN}Host: ${SSH_HOST}${NC}"
        echo -e "${GREEN}User: ${SSH_USER}${NC}"
        return 0
    else
        echo -e "${RED}❌ Falha na conexão SSH${NC}"
        return 1
    fi
}

# Informações do servidor
server_info() {
    echo -e "${BLUE}📊 Informações do Servidor:${NC}"
    echo ""
    echo -e "${YELLOW}Sistema:${NC}"
    ssh_exec "uname -a"
    echo ""
    echo -e "${YELLOW}Diretório atual:${NC}"
    ssh_exec "pwd"
    echo ""
    echo -e "${YELLOW}Espaço em disco:${NC}"
    ssh_exec "df -h | head -n 2"
    echo ""
    echo -e "${YELLOW}MySQL versão:${NC}"
    ssh_exec "mysql --version || echo 'MySQL não encontrado'"
}

# Listar bancos de dados
list_databases() {
    echo -e "${BLUE}📊 Listando bancos de dados MySQL:${NC}"
    echo ""
    
    # Primeiro, vamos descobrir o usuário e senha do MySQL
    echo -e "${YELLOW}Procurando credenciais do MySQL...${NC}"
    
    # Tentar ler do wp-config.php se existir
    DB_NAME=$(ssh_exec "grep DB_NAME wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_USER=$(ssh_exec "grep DB_USER wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_PASS=$(ssh_exec "grep DB_PASSWORD wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    
    if [ ! -z "$DB_NAME" ]; then
        echo -e "${GREEN}✅ Credenciais encontradas no wp-config.php${NC}"
        echo -e "Database: ${DB_NAME}"
        echo -e "User: ${DB_USER}"
        echo ""
        
        # Listar databases
        ssh_exec "mysql -u${DB_USER} -p${DB_PASS} -e 'SHOW DATABASES;'"
    else
        echo -e "${YELLOW}⚠️  wp-config.php não encontrado${NC}"
        echo -e "${YELLOW}Você precisará fornecer as credenciais MySQL manualmente${NC}"
    fi
}

# Fazer backup de banco de dados
backup_database() {
    db_name=$1
    if [ -z "$db_name" ]; then
        echo -e "${RED}❌ Erro: Nome do banco de dados não fornecido${NC}"
        echo -e "${YELLOW}Uso: ./scripts/db-import-ssh.sh backup <nome_do_banco>${NC}"
        exit 1
    fi
    
    backup_file="backup_${db_name}_$(date +%Y%m%d_%H%M%S).sql"
    
    echo -e "${BLUE}💾 Criando backup do banco '${db_name}'...${NC}"
    
    # Buscar credenciais
    DB_USER=$(ssh_exec "grep DB_USER wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_PASS=$(ssh_exec "grep DB_PASSWORD wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    
    if [ -z "$DB_USER" ]; then
        echo -e "${RED}❌ Credenciais MySQL não encontradas${NC}"
        exit 1
    fi
    
    # Criar backup no servidor
    ssh_exec "mysqldump -u${DB_USER} -p${DB_PASS} ${db_name} > /tmp/${backup_file}"
    
    # Baixar backup
    echo -e "${BLUE}📥 Baixando backup...${NC}"
    ssh_download "/tmp/${backup_file}" "./backups/${backup_file}"
    
    # Limpar arquivo temporário no servidor
    ssh_exec "rm /tmp/${backup_file}"
    
    echo -e "${GREEN}✅ Backup salvo em: ./backups/${backup_file}${NC}"
}

# Importar arquivo SQL
import_database() {
    local_file=$1
    db_name=$2
    
    if [ -z "$local_file" ] || [ -z "$db_name" ]; then
        echo -e "${RED}❌ Erro: Arquivo ou nome do banco não fornecido${NC}"
        echo -e "${YELLOW}Uso: ./scripts/db-import-ssh.sh import <arquivo.sql> <nome_do_banco>${NC}"
        exit 1
    fi
    
    if [ ! -f "$local_file" ]; then
        echo -e "${RED}❌ Erro: Arquivo '${local_file}' não encontrado${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📤 Enviando arquivo para servidor...${NC}"
    ssh_copy "${local_file}" "/tmp/import.sql"
    
    echo -e "${BLUE}💾 Importando para banco '${db_name}'...${NC}"
    
    # Buscar credenciais
    DB_USER=$(ssh_exec "grep DB_USER wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_PASS=$(ssh_exec "grep DB_PASSWORD wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    
    if [ -z "$DB_USER" ]; then
        echo -e "${RED}❌ Credenciais MySQL não encontradas${NC}"
        exit 1
    fi
    
    # Importar
    ssh_exec "mysql -u${DB_USER} -p${DB_PASS} ${db_name} < /tmp/import.sql"
    
    # Limpar
    ssh_exec "rm /tmp/import.sql"
    
    echo -e "${GREEN}✅ Importação concluída com sucesso!${NC}"
}

# Exportar banco de dados
export_database() {
    db_name=$1
    if [ -z "$db_name" ]; then
        echo -e "${RED}❌ Erro: Nome do banco de dados não fornecido${NC}"
        echo -e "${YELLOW}Uso: ./scripts/db-import-ssh.sh export <nome_do_banco>${NC}"
        exit 1
    fi
    
    export_file="export_${db_name}_$(date +%Y%m%d_%H%M%S).sql"
    
    echo -e "${BLUE}📦 Exportando banco '${db_name}'...${NC}"
    
    # Buscar credenciais
    DB_USER=$(ssh_exec "grep DB_USER wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_PASS=$(ssh_exec "grep DB_PASSWORD wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    
    if [ -z "$DB_USER" ]; then
        echo -e "${RED}❌ Credenciais MySQL não encontradas${NC}"
        exit 1
    fi
    
    # Criar dump
    ssh_exec "mysqldump -u${DB_USER} -p${DB_PASS} ${db_name} > /tmp/${export_file}"
    
    # Baixar
    mkdir -p ./exports
    echo -e "${BLUE}📥 Baixando export...${NC}"
    ssh_download "/tmp/${export_file}" "./exports/${export_file}"
    
    # Limpar
    ssh_exec "rm /tmp/${export_file}"
    
    echo -e "${GREEN}✅ Export salvo em: ./exports/${export_file}${NC}"
}

# Shell interativo
open_shell() {
    echo -e "${BLUE}🐚 Abrindo shell interativo...${NC}"
    echo -e "${YELLOW}Digite 'exit' para sair${NC}"
    sshpass -p "${SSH_PASSWORD}" ssh ${SSH_OPTIONS} ${SSH_USER}@${SSH_HOST}
}

# MySQL CLI
open_mysql() {
    echo -e "${BLUE}🗄️  Abrindo MySQL CLI...${NC}"
    
    # Buscar credenciais
    DB_USER=$(ssh_exec "grep DB_USER wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    DB_PASS=$(ssh_exec "grep DB_PASSWORD wp-config.php 2>/dev/null | cut -d \"'\" -f 4 || echo ''")
    
    if [ -z "$DB_USER" ]; then
        echo -e "${RED}❌ Credenciais MySQL não encontradas${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Digite 'exit' para sair do MySQL${NC}"
    sshpass -p "${SSH_PASSWORD}" ssh ${SSH_OPTIONS} -t ${SSH_USER}@${SSH_HOST} "mysql -u${DB_USER} -p${DB_PASS}"
}

# Main
case "${1}" in
    test)
        test_connection
        ;;
    info)
        server_info
        ;;
    databases|list)
        list_databases
        ;;
    backup)
        backup_database "${2}"
        ;;
    import)
        import_database "${2}" "${3}"
        ;;
    export)
        export_database "${2}"
        ;;
    shell)
        open_shell
        ;;
    mysql)
        open_mysql
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: ${1}${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
