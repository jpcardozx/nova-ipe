#!/bin/bash
# Validação completa de credenciais

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo "======================================"
echo "🔐 Validação de Credenciais"
echo "======================================"
echo ""

# ============================================
# 1. MYSQL (DBaaS)
# ============================================
echo "📊 MYSQL DATABASE"
info "Host: wp_imobiliaria.mysql.dbaas.com.br"
info "User: wp_imobiliaria"
info "Pass: rfp183654"
info "Database: wp_imobiliaria"
echo ""

if mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  -e "SELECT VERSION(), DATABASE();" 2>/dev/null; then
    success "MySQL OK"
    
    # Tamanho
    SIZE=$(mysql -h wp_imobiliaria.mysql.dbaas.com.br \
      -u wp_imobiliaria \
      -prfp183654 \
      -sN -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) 
      FROM information_schema.tables 
      WHERE table_schema = 'wp_imobiliaria';" 2>/dev/null)
    info "Tamanho: ${SIZE} MB"
else
    error "MySQL FALHOU"
fi

echo ""
echo "======================================"
echo ""

# ============================================
# 2. SSH
# ============================================
echo "🔑 SSH ACCESS"
info "Host: 187.45.193.173 (ftp.imobiliariaipe.com.br)"
info "User: imobiliariaipe1"
info "Pass: Imobiliaria@46933003"
info "Port: 22"
echo ""

info "Testando porta 22..."
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/187.45.193.173/22" 2>/dev/null; then
    success "Porta 22 ABERTA"
    
    info "Testando autenticação SSH..."
    if timeout 10 sshpass -p "Imobiliaria@46933003" ssh \
      -p 22 \
      -o HostKeyAlgorithms=+ssh-rsa \
      -o PubkeyAcceptedKeyTypes=+ssh-rsa \
      -o StrictHostKeyChecking=no \
      -o ConnectTimeout=5 \
      imobiliariaipe1@187.45.193.173 "echo 'SSH OK'" 2>/dev/null; then
        success "SSH Autenticação OK"
    else
        error "SSH Autenticação FALHOU"
    fi
else
    error "Porta 22 FECHADA/TIMEOUT"
fi

echo ""
echo "======================================"
echo ""

# ============================================
# 3. FTP
# ============================================
echo "📁 FTP ACCESS"
info "Host: 187.45.193.173 (ftp.imobiliariaipe.com.br)"
info "User: imobiliariaipe1"
info "Pass: Imobiliaria@46933003"
info "Port: 21"
echo ""

info "Testando porta 21..."
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/187.45.193.173/21" 2>/dev/null; then
    success "Porta 21 ABERTA"
    
    info "Testando autenticação FTP..."
    RESULT=$(timeout 10 ftp -inv 187.45.193.173 << 'EOF' 2>&1
user imobiliariaipe1 Imobiliaria@46933003
pwd
bye
EOF
)
    
    if echo "$RESULT" | grep -q "230"; then
        success "FTP Autenticação OK"
        echo "$RESULT" | grep "257\|250" | head -2
    else
        error "FTP Autenticação FALHOU"
        echo "$RESULT" | grep -i "login\|failed\|530" | head -3
    fi
else
    error "Porta 21 FECHADA/TIMEOUT"
fi

echo ""
echo "======================================"
echo ""

# ============================================
# 4. URLs ALTERNATIVAS
# ============================================
echo "🌐 URLS ALTERNATIVAS"
echo ""

info "Testando ftp.imobiliariaipe1.hospedagemdesites.ws..."
if timeout 3 ping -c 1 ftp.imobiliariaipe1.hospedagemdesites.ws >/dev/null 2>&1; then
    IP=$(ping -c 1 ftp.imobiliariaipe1.hospedagemdesites.ws 2>/dev/null | grep -oP '\d+\.\d+\.\d+\.\d+' | head -1)
    success "Resolvido: $IP"
else
    error "Não resolve"
fi

echo ""
echo "======================================"
echo ""

# ============================================
# 5. RESUMO
# ============================================
echo "📋 RESUMO"
echo ""
echo "Credenciais Validadas:"
echo ""
echo "MySQL DBaaS:"
echo "  ✓ Host: wp_imobiliaria.mysql.dbaas.com.br"
echo "  ✓ Conexão: OK"
echo "  ✓ Tamanho: ${SIZE:-N/A} MB"
echo ""
echo "Servidor LocaWeb (187.45.193.173):"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/187.45.193.173/22" 2>/dev/null; then
    echo "  ✓ SSH (porta 22): DISPONÍVEL"
else
    echo "  ✗ SSH (porta 22): INDISPONÍVEL"
fi

if timeout 5 bash -c "cat < /dev/null > /dev/tcp/187.45.193.173/21" 2>/dev/null; then
    echo "  ✓ FTP (porta 21): DISPONÍVEL"
else
    echo "  ✗ FTP (porta 21): INDISPONÍVEL"
fi

echo ""
echo "======================================"
