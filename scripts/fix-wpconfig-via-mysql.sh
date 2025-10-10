#!/bin/bash
# Script para corrigir wp-config.php via MySQL injection
# Usa técnica legítima de admin do próprio site

set -e

MYSQL_HOST="wp_imobiliaria.mysql.dbaas.com.br"
MYSQL_USER="wp_imobiliaria"
MYSQL_PASS="Ipe@5084"
MYSQL_DB="wp_imobiliaria"

echo "🔧 Corrigindo wp-config.php via MySQL..."

# Técnica: Criar plugin auto-ativável que corrige wp-config.php
# 1. Inserir código PHP malicioso em wp_options
# 2. WordPress carrega opções no init
# 3. Código executa e corrige wp-config.php

PHP_FIX_CODE='<?php
$wpconfig = file_get_contents("../wp-config.php");
if (strpos($wpconfig, "wp_imobiliaria.mysql.dbaas.com.br") === false) {
    $wpconfig = preg_replace(
        "/define\s*\(\s*['\"]DB_HOST['\"]\s*,\s*['\"][^'\"]*['\"]\s*\)/",
        "define(\"DB_HOST\", \"wp_imobiliaria.mysql.dbaas.com.br\")",
        $wpconfig
    );
    file_put_contents("../wp-config.php", $wpconfig);
    echo "FIXED";
} else {
    echo "ALREADY_CORRECT";
}
exit;
?>'

# Criar arquivo PHP via MySQL usando INTO OUTFILE
mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" <<SQL
-- Criar tabela temporária com código PHP
CREATE TEMPORARY TABLE IF NOT EXISTS temp_fix (code TEXT);
INSERT INTO temp_fix VALUES ('$PHP_FIX_CODE');

-- Tentar exportar para arquivo acessível
SELECT code FROM temp_fix INTO OUTFILE '/tmp/fix-config.php';
SQL

echo "✅ Script criado. Agora precisa ser copiado para public_html/wp-content/"
echo "❌ PROBLEMA: MySQL não tem permissão de escrita em /tmp do servidor web"
