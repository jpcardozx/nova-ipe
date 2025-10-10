#!/bin/bash
# Monitor de Migração em Tempo Real

while true; do
    clear
    echo "=========================================="
    echo "  MONITOR DE MIGRAÇÃO - $(date '+%H:%M:%S')"
    echo "=========================================="
    echo ""
    
    # Progresso
    if [ -f ~/wp-migration-validated-*/progress.txt ]; then
        cat ~/wp-migration-validated-*/progress.txt
    else
        echo "❌ Arquivo de progresso não encontrado"
    fi
    
    echo ""
    echo "----------------------------------------"
    echo "ÚLTIMAS ATIVIDADES:"
    echo "----------------------------------------"
    
    # Últimas 10 linhas do log
    if [ -f ~/wp-migration-validated-*/migration.log ]; then
        tail -10 ~/wp-migration-validated-*/migration.log | sed 's/^/  /'
    fi
    
    echo ""
    echo "----------------------------------------"
    echo "TAMANHO DOS BACKUPS:"
    echo "----------------------------------------"
    
    # Tamanho dos arquivos
    if [ -d ~/wp-migration-validated-* ]; then
        find ~/wp-migration-validated-* -type f \( -name "*.tar.gz" -o -name "*.sql.gz" \) -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $9 ": " $5}'
    fi
    
    echo ""
    echo "Atualizando a cada 5 segundos... (Ctrl+C para sair)"
    sleep 5
done
