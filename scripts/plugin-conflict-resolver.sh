#!/bin/bash

# Plugin Conflict Resolver
# Desativa plugins específicos que podem causar erro 500

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
DB_PASS="Ipe@4693"

SITE_URL="https://portal.imobiliariaipe.com.br"
LOG_FILE="$HOME/wp-backup-locaweb/plugin-debug.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

echo -e "${BLUE}=======================================
🔌 WordPress Plugin Conflict Resolver
=======================================${NC}"

echo -e "\n${YELLOW}🔍 STEP 1: Analyzing Current Plugins${NC}"

# Backup dos plugins ativos
log "Fazendo backup da configuração atual de plugins"
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
SELECT option_value FROM wp_options WHERE option_name = 'active_plugins';
" > "$HOME/wp-backup-locaweb/plugins-backup-$(date +%Y%m%d_%H%M%S).txt"

echo -e "${GREEN}✅ Backup dos plugins criado${NC}"

echo -e "\n${YELLOW}🔍 STEP 2: Disabling All Plugins${NC}"

# Desativar todos os plugins
log "Desativando todos os plugins temporariamente"
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
UPDATE wp_options SET option_value = '' WHERE option_name = 'active_plugins';
"

echo -e "${GREEN}✅ Todos os plugins desativados${NC}"

echo -e "\n${YELLOW}🔍 STEP 3: Testing Site${NC}"

# Testar site sem plugins
sleep 3
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
log "Site response without plugins: $RESPONSE"

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ SUCESSO! Site funciona sem plugins${NC}"
    echo -e "${YELLOW}O problema é causado por conflito de plugins${NC}"
    
    echo -e "\n${YELLOW}🔍 STEP 4: Testing Plugins Individually${NC}"
    
    # Lista de plugins para testar individualmente
    PLUGINS=(
        "google-universal-analytics/googleanalytics.php"
        "real-estate-listing-realtyna-wpl/WPL.php" 
        "w3-total-cache/w3-total-cache.php"
        "wordpress-seo/wp-seo.php"
    )
    
    for plugin in "${PLUGINS[@]}"; do
        echo -e "\n${BLUE}Testando plugin: $plugin${NC}"
        
        # Ativar apenas este plugin
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        UPDATE wp_options SET option_value = 'a:1:{i:0;s:${#plugin}:\"$plugin\";}' WHERE option_name = 'active_plugins';
        "
        
        sleep 2
        PLUGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
        
        if [ "$PLUGIN_RESPONSE" = "200" ]; then
            echo -e "${GREEN}✅ Plugin OK: $plugin${NC}"
            log "Plugin OK: $plugin"
        else
            echo -e "${RED}❌ Plugin PROBLEMA: $plugin (Status: $PLUGIN_RESPONSE)${NC}"
            log "Plugin PROBLEM: $plugin (Status: $PLUGIN_RESPONSE)"
        fi
        
        # Desativar novamente
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        UPDATE wp_options SET option_value = '' WHERE option_name = 'active_plugins';
        "
    done
    
elif [ "$RESPONSE" = "500" ]; then
    echo -e "${RED}❌ Site ainda com erro 500 mesmo sem plugins${NC}"
    echo -e "${YELLOW}O problema pode ser:${NC}"
    echo "1. 🎨 Tema customizado 'ipeimoveis'"
    echo "2. 📝 wp-config.php com problemas"
    echo "3. 🔧 Configurações do servidor PHP"
    echo "4. 📁 Permissões de arquivos"
    
    echo -e "\n${YELLOW}🔍 STEP 4: Testing Default Theme${NC}"
    
    # Trocar para tema padrão
    log "Tentando trocar para tema padrão"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
    UPDATE wp_options SET option_value = 'twentytwentyfour' WHERE option_name = 'template';
    UPDATE wp_options SET option_value = 'twentytwentyfour' WHERE option_name = 'stylesheet';
    "
    
    sleep 3
    THEME_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
    
    if [ "$THEME_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ SUCESSO! Problema era no tema customizado 'ipeimoveis'${NC}"
        log "Theme issue confirmed: ipeimoveis theme causing 500 error"
    else
        echo -e "${RED}❌ Ainda com erro. Problema mais profundo (wp-config/servidor)${NC}"
        log "Deeper issue: not theme related (Status: $THEME_RESPONSE)"
    fi
    
else
    echo -e "${YELLOW}⚠️ Status inesperado: $RESPONSE${NC}"
    log "Unexpected response: $RESPONSE"
fi

echo -e "\n${YELLOW}🔍 STEP 5: Recommendations${NC}"

cat << EOF

${GREEN}✅ === DIAGNÓSTICO DE PLUGINS CONCLUÍDO ====${NC}

${BLUE}📋 ARQUIVOS DE LOG CRIADOS:${NC}
- plugin-debug.log (log completo da análise)
- plugins-backup-*.txt (backup da configuração original)

${YELLOW}🔧 PRÓXIMAS AÇÕES RECOMENDADAS:${NC}

Se o problema foi identificado:
1. 🔌 Reativar apenas plugins funcionais
2. 🎨 Corrigir/substituir tema problemático
3. ⚙️ Verificar configurações PHP do servidor

Se problema persiste:
1. 📝 Verificar wp-config.php no servidor
2. 🔍 Acessar logs de erro do Apache
3. 🛠️ Verificar permissões de arquivos (755/644)

EOF

log "Plugin conflict analysis completed"

echo -e "\n${BLUE}=======================================
📊 Análise de plugins finalizada!
=======================================${NC}"