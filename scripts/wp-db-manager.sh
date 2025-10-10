#!/bin/bash

# 🗄️ WordPress Database Manager
# Backup e Restore do banco wp_imobiliaria

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações do banco de dados
DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
DB_USER="wp_imobiliaria"
DB_PASS="rfp183654"
DB_NAME="wp_imobiliaria"

# Diretórios
BACKUP_DIR="$HOME/db-backups"
IMPORT_DIR="$HOME/db-imports"

# Funções
print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se MySQL client está instalado
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        print_error "MySQL client não está instalado!"
        echo "Instale com: sudo apt-get install mysql-client"
        exit 1
    fi
    print_success "MySQL client encontrado"
}

# Testar conexão
cmd_test() {
    print_header "Testando Conexão com Banco de Dados"
    
    check_mysql
    
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT VERSION();" 2>/dev/null; then
        print_success "Conexão estabelecida com sucesso!"
        echo ""
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT VERSION() AS 'MySQL Version'; SELECT DATABASE() AS 'Current Database';"
    else
        print_error "Falha na conexão com o banco de dados"
        exit 1
    fi
}

# Listar tabelas
cmd_tables() {
    print_header "Listando Tabelas do Banco"
    
    check_mysql
    
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;"
    
    echo ""
    print_success "Total de tabelas:"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = '$DB_NAME';"
}

# Informações do banco
cmd_info() {
    print_header "Informações do Banco de Dados"
    
    check_mysql
    
    echo -e "${BLUE}=== Tamanho das Tabelas ===${NC}"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
    SELECT 
        table_name AS 'Tabela',
        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)',
        table_rows AS 'Linhas'
    FROM information_schema.tables 
    WHERE table_schema = '$DB_NAME' 
    ORDER BY (data_length + index_length) DESC 
    LIMIT 15;
    "
    
    echo ""
    echo -e "${BLUE}=== Estatísticas WordPress ===${NC}"
    
    # Posts publicados
    POSTS=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM wp_posts WHERE post_type='post' AND post_status='publish';")
    echo "Posts publicados: $POSTS"
    
    # Páginas
    PAGES=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM wp_posts WHERE post_type='page' AND post_status='publish';")
    echo "Páginas: $PAGES"
    
    # Usuários
    USERS=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM wp_users;")
    echo "Usuários: $USERS"
    
    # Comentários
    COMMENTS=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM wp_comments WHERE comment_approved='1';")
    echo "Comentários aprovados: $COMMENTS"
}

# Fazer backup
cmd_backup() {
    print_header "Criando Backup do Banco de Dados"
    
    check_mysql
    
    # Criar diretório se não existir
    mkdir -p "$BACKUP_DIR"
    
    # Nome do arquivo
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/wp_imobiliaria_backup_$TIMESTAMP.sql"
    BACKUP_FILE_GZ="${BACKUP_FILE}.gz"
    
    print_warning "Iniciando export do banco de dados..."
    print_warning "Isso pode levar alguns minutos dependendo do tamanho..."
    
    # Fazer dump
    if mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
        --single-transaction \
        --quick \
        --lock-tables=false \
        "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
        
        print_success "Dump criado com sucesso!"
        
        # Comprimir
        print_warning "Comprimindo arquivo..."
        gzip "$BACKUP_FILE"
        
        print_success "Backup concluído!"
        echo ""
        echo "Arquivo: $BACKUP_FILE_GZ"
        ls -lh "$BACKUP_FILE_GZ"
        
        # Calcular MD5
        if command -v md5sum &> /dev/null; then
            MD5=$(md5sum "$BACKUP_FILE_GZ" | awk '{print $1}')
            echo "MD5: $MD5"
        fi
    else
        print_error "Falha ao criar backup"
        exit 1
    fi
}

# Listar backups
cmd_list() {
    print_header "Backups Disponíveis"
    
    if [ -d "$BACKUP_DIR" ]; then
        echo "Diretório: $BACKUP_DIR"
        echo ""
        ls -lhtr "$BACKUP_DIR"/*.sql.gz 2>/dev/null || print_warning "Nenhum backup encontrado"
        
        echo ""
        echo -e "${BLUE}Espaço em disco:${NC}"
        df -h "$BACKUP_DIR" | tail -1
    else
        print_warning "Diretório de backups não existe ainda"
    fi
}

# Importar banco
cmd_import() {
    print_header "Importar Banco de Dados"
    
    check_mysql
    
    # Listar arquivos disponíveis
    echo -e "${YELLOW}Arquivos disponíveis para importação:${NC}"
    echo ""
    
    if [ -d "$IMPORT_DIR" ]; then
        ls -lh "$IMPORT_DIR"/*.sql* 2>/dev/null || echo "Nenhum arquivo em $IMPORT_DIR"
    fi
    
    if [ -d "$BACKUP_DIR" ]; then
        echo ""
        echo "Backups:"
        ls -lh "$BACKUP_DIR"/*.sql* 2>/dev/null || echo "Nenhum backup disponível"
    fi
    
    echo ""
    read -p "Digite o caminho completo do arquivo SQL: " IMPORT_FILE
    
    if [ ! -f "$IMPORT_FILE" ]; then
        print_error "Arquivo não encontrado: $IMPORT_FILE"
        exit 1
    fi
    
    # Confirmar
    echo ""
    print_warning "⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!"
    echo "Arquivo: $IMPORT_FILE"
    echo "Tamanho: $(ls -lh "$IMPORT_FILE" | awk '{print $5}')"
    echo ""
    read -p "Deseja fazer backup antes de importar? (s/n): " BACKUP_CHOICE
    
    if [ "$BACKUP_CHOICE" = "s" ] || [ "$BACKUP_CHOICE" = "S" ]; then
        cmd_backup
        echo ""
    fi
    
    read -p "Tem certeza que deseja continuar? Digite 'CONFIRMAR': " CONFIRM
    
    if [ "$CONFIRM" != "CONFIRMAR" ]; then
        print_warning "Importação cancelada"
        exit 0
    fi
    
    # Importar
    print_warning "Iniciando importação..."
    print_warning "Isso pode levar vários minutos..."
    
    # Verificar se é arquivo comprimido
    if [[ "$IMPORT_FILE" == *.gz ]]; then
        if gunzip -c "$IMPORT_FILE" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" 2>/dev/null; then
            print_success "Importação concluída com sucesso!"
        else
            print_error "Falha na importação"
            exit 1
        fi
    else
        if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$IMPORT_FILE" 2>/dev/null; then
            print_success "Importação concluída com sucesso!"
        else
            print_error "Falha na importação"
            exit 1
        fi
    fi
    
    # Validar
    echo ""
    print_warning "Validando importação..."
    cmd_info
}

# Buscar e substituir URLs
cmd_search_replace() {
    print_header "Search & Replace URLs no Banco"
    
    check_mysql
    
    echo "Esta função permite trocar URLs no banco de dados"
    echo "Útil para migração de domínios"
    echo ""
    
    read -p "URL antiga (ex: http://old-domain.com): " OLD_URL
    read -p "URL nova (ex: https://new-domain.com): " NEW_URL
    
    echo ""
    print_warning "⚠️  Esta operação irá substituir:"
    echo "DE: $OLD_URL"
    echo "PARA: $NEW_URL"
    echo ""
    
    read -p "Fazer backup antes? (s/n): " BACKUP_CHOICE
    if [ "$BACKUP_CHOICE" = "s" ] || [ "$BACKUP_CHOICE" = "S" ]; then
        cmd_backup
        echo ""
    fi
    
    read -p "Continuar com search-replace? (s/n): " CONFIRM
    if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
        print_warning "Operação cancelada"
        exit 0
    fi
    
    print_warning "Executando search-replace..."
    
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" << EOF
UPDATE wp_options SET option_value = REPLACE(option_value, '$OLD_URL', '$NEW_URL');
UPDATE wp_posts SET post_content = REPLACE(post_content, '$OLD_URL', '$NEW_URL');
UPDATE wp_posts SET guid = REPLACE(guid, '$OLD_URL', '$NEW_URL');
UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, '$OLD_URL', '$NEW_URL');
EOF
    
    print_success "Search-replace concluído!"
    print_warning "Lembre-se de limpar o cache do WordPress!"
}

# Help
cmd_help() {
    cat << EOF
🗄️  WordPress Database Manager

Uso: ./scripts/wp-db-manager.sh [comando]

Comandos:
  test            - Testar conexão com banco de dados
  tables          - Listar todas as tabelas
  info            - Mostrar informações e estatísticas
  backup          - Criar backup do banco
  list            - Listar backups disponíveis
  import          - Importar banco de dados
  search-replace  - Substituir URLs no banco
  help            - Mostrar esta ajuda

Exemplos:
  # Testar conexão
  ./scripts/wp-db-manager.sh test

  # Fazer backup
  ./scripts/wp-db-manager.sh backup

  # Ver informações
  ./scripts/wp-db-manager.sh info

  # Importar backup
  ./scripts/wp-db-manager.sh import

Configuração:
  Host: $DB_HOST
  Database: $DB_NAME
  User: $DB_USER
  
Diretórios:
  Backups: $BACKUP_DIR
  Imports: $IMPORT_DIR

Para mais informações: docs/DB_CREDENTIALS_PRIVATE.md
EOF
}

# Main
main() {
    case "${1:-help}" in
        test)
            cmd_test
            ;;
        tables)
            cmd_tables
            ;;
        info)
            cmd_info
            ;;
        backup)
            cmd_backup
            ;;
        list)
            cmd_list
            ;;
        import)
            cmd_import
            ;;
        search-replace|sr)
            cmd_search_replace
            ;;
        help|*)
            cmd_help
            ;;
    esac
}

main "$@"
