#!/bin/bash

# 🗄️ Database Import Helper Script
# Usage: ./scripts/db-import-helper.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
SSH_HOST="187.45.193.173"
SSH_PORT="22"
SSH_USER="imobiliariaipe1"
SSH_OPTIONS="-o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa"

# Functions
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

# Command: connect
cmd_connect() {
    print_header "Connecting to Server via SSH"
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST
}

# Command: test
cmd_test() {
    print_header "Testing SSH Connection"
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST "echo 'Connection successful!' && pwd && hostname && date"
}

# Command: check-db
cmd_check_db() {
    print_header "Checking Database Installation"
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST << 'ENDSSH'
        echo "=== MySQL/MariaDB ==="
        mysql --version 2>/dev/null || echo "MySQL not found in PATH"
        
        echo ""
        echo "=== PostgreSQL ==="
        psql --version 2>/dev/null || echo "PostgreSQL not found in PATH"
        
        echo ""
        echo "=== Finding Config Files ==="
        find ~/public_html -maxdepth 3 -name "wp-config.php" -o -name ".env" -o -name "config.php" 2>/dev/null | head -10
        
        echo ""
        echo "=== Disk Space ==="
        df -h ~/ | tail -1
ENDSSH
}

# Command: backup
cmd_backup() {
    print_header "Creating Database Backup"
    read -p "Enter database username: " DB_USER
    read -p "Enter database name: " DB_NAME
    
    print_warning "You will be prompted for the database password..."
    
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST << ENDSSH
        mkdir -p ~/backups/\$(date +%Y%m%d)
        BACKUP_FILE=~/backups/\$(date +%Y%m%d)/backup_\$(date +%H%M%S).sql.gz
        
        echo "Creating backup: \$BACKUP_FILE"
        mysqldump -u $DB_USER -p $DB_NAME | gzip > \$BACKUP_FILE
        
        echo "Backup created successfully!"
        ls -lh \$BACKUP_FILE
ENDSSH
    
    print_success "Backup completed!"
}

# Command: upload
cmd_upload() {
    print_header "Uploading Database File"
    read -p "Enter local file path: " LOCAL_FILE
    
    if [ ! -f "$LOCAL_FILE" ]; then
        print_error "File not found: $LOCAL_FILE"
        exit 1
    fi
    
    print_warning "Creating import directory on server..."
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST "mkdir -p ~/import"
    
    print_warning "Uploading file..."
    scp -P $SSH_PORT $SSH_OPTIONS "$LOCAL_FILE" $SSH_USER@$SSH_HOST:~/import/
    
    print_success "Upload completed!"
    
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST "ls -lh ~/import/"
}

# Command: import
cmd_import() {
    print_header "Importing Database"
    read -p "Enter database username: " DB_USER
    read -p "Enter database name: " DB_NAME
    read -p "Enter import file name (in ~/import/): " IMPORT_FILE
    
    print_warning "You will be prompted for the database password..."
    
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST << ENDSSH
        if [ ! -f ~/import/$IMPORT_FILE ]; then
            echo "Error: File ~/import/$IMPORT_FILE not found!"
            exit 1
        fi
        
        echo "File size:"
        ls -lh ~/import/$IMPORT_FILE
        
        echo ""
        echo "Starting import..."
        
        if [[ "$IMPORT_FILE" == *.gz ]]; then
            gunzip -c ~/import/$IMPORT_FILE | mysql -u $DB_USER -p $DB_NAME
        else
            mysql -u $DB_USER -p $DB_NAME < ~/import/$IMPORT_FILE
        fi
        
        echo "Import completed!"
ENDSSH
    
    print_success "Database imported successfully!"
}

# Command: validate
cmd_validate() {
    print_header "Validating Database"
    read -p "Enter database username: " DB_USER
    read -p "Enter database name: " DB_NAME
    
    ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST << ENDSSH
        echo "=== Tables in database ==="
        mysql -u $DB_USER -p $DB_NAME -e "SHOW TABLES;"
        
        echo ""
        echo "=== Database size ==="
        mysql -u $DB_USER -p $DB_NAME -e "SELECT table_name AS 'Table', ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = '$DB_NAME' ORDER BY (data_length + index_length) DESC LIMIT 10;"
ENDSSH
}

# Command: cleanup
cmd_cleanup() {
    print_header "Cleaning Up Import Files"
    print_warning "This will remove files from ~/import/ directory"
    read -p "Are you sure? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" = "yes" ]; then
        ssh -p $SSH_PORT $SSH_OPTIONS $SSH_USER@$SSH_HOST "rm -rf ~/import/* && echo 'Cleanup completed!'"
        print_success "Import directory cleaned!"
    else
        print_warning "Cleanup cancelled."
    fi
}

# Command: help
cmd_help() {
    cat << EOF
🗄️  Database Import Helper Script

Usage: ./scripts/db-import-helper.sh [command]

Commands:
  connect     - Connect to server via SSH
  test        - Test SSH connection
  check-db    - Check database installation and config files
  backup      - Create backup of current database
  upload      - Upload database file to server
  import      - Import database from uploaded file
  validate    - Validate imported database
  cleanup     - Clean up import directory
  help        - Show this help message

Example Workflow:
  1. ./scripts/db-import-helper.sh test
  2. ./scripts/db-import-helper.sh check-db
  3. ./scripts/db-import-helper.sh backup
  4. ./scripts/db-import-helper.sh upload
  5. ./scripts/db-import-helper.sh import
  6. ./scripts/db-import-helper.sh validate
  7. ./scripts/db-import-helper.sh cleanup

For detailed documentation, see: docs/DATABASE_IMPORT_SSH_GUIDE.md
EOF
}

# Main script logic
main() {
    case "${1:-help}" in
        connect)
            cmd_connect
            ;;
        test)
            cmd_test
            ;;
        check-db)
            cmd_check_db
            ;;
        backup)
            cmd_backup
            ;;
        upload)
            cmd_upload
            ;;
        import)
            cmd_import
            ;;
        validate)
            cmd_validate
            ;;
        cleanup)
            cmd_cleanup
            ;;
        help|*)
            cmd_help
            ;;
    esac
}

main "$@"
