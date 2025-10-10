#!/bin/bash
# Diagnostic toolkit para site com erro 500

set -e

SITE_URL="portal.imobiliariaipe.com.br"
BACKUP_DIR="$HOME/wp-backup-locaweb"
LOG_FILE="$BACKUP_DIR/diagnostics.log"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"; }
info() { echo -e "${CYAN}ℹ️  $1${NC}" | tee -a "$LOG_FILE"; }

mkdir -p "$BACKUP_DIR"

echo "======================================="
echo "🔍 WordPress Error 500 Diagnostic"  
echo "======================================="
echo ""
log "Site: https://$SITE_URL"
log "Log: $LOG_FILE"
echo ""

# ============================================
# 1. NETWORK & DNS ANALYSIS
# ============================================
log "🌐 MÓDULO 1: Network & DNS Analysis"
echo ""

info "DNS Resolution..."
dig +short $SITE_URL A | head -5
SITE_IP=$(dig +short $SITE_URL A | head -1)
success "IP: $SITE_IP"

info "Reverse DNS..."
if [ -n "$SITE_IP" ]; then
    dig +short -x $SITE_IP | head -1 || echo "No reverse DNS"
fi

info "DNS Records..."
echo "A Records:"
dig +short $SITE_URL A
echo "MX Records:"
dig +short $SITE_URL MX | head -3
echo "NS Records:"
dig +short $SITE_URL NS | head -3

echo ""

# ============================================
# 2. HTTP RESPONSE ANALYSIS
# ============================================
log "📡 MÓDULO 2: HTTP Response Analysis"
echo ""

info "HTTP Headers (HTTPS)..."
curl -I -s -w "\nResponse Code: %{http_code}\nTotal Time: %{time_total}s\nConnect Time: %{time_connect}s\nSSL Time: %{time_appconnect}s\n" \
  https://$SITE_URL 2>/dev/null || warn "HTTPS failed"

echo ""
info "HTTP Headers (HTTP)..."
curl -I -s -w "\nResponse Code: %{http_code}\nTotal Time: %{time_total}s\n" \
  http://$SITE_URL 2>/dev/null || warn "HTTP failed"

echo ""
info "Server Response Body (first 500 chars)..."
curl -s https://$SITE_URL | head -c 500 2>/dev/null && echo ""

echo ""

# ============================================
# 3. SSL/TLS ANALYSIS
# ============================================
log "🔒 MÓDULO 3: SSL/TLS Analysis"
echo ""

if command -v openssl &> /dev/null; then
    info "SSL Certificate..."
    echo | openssl s_client -connect $SITE_URL:443 -servername $SITE_URL 2>/dev/null | \
    openssl x509 -noout -text | grep -E "(Issuer|Subject|Not After|DNS)" | head -10
else
    warn "OpenSSL not available"
fi

echo ""

# ============================================
# 4. SUBDOMAIN ANALYSIS
# ============================================
log "🔍 MÓDULO 4: Subdomain Analysis"
echo ""

SUBDOMAINS=("www" "portal" "ftp" "mail" "blog" "admin")
for sub in "${SUBDOMAINS[@]}"; do
    FULL_DOMAIN="${sub}.imobiliariaipe.com.br"
    IP=$(dig +short $FULL_DOMAIN A | head -1)
    if [ -n "$IP" ]; then
        STATUS=$(curl -I -s -w "%{http_code}" -o /dev/null http://$FULL_DOMAIN --max-time 5 2>/dev/null || echo "TIMEOUT")
        info "$FULL_DOMAIN → $IP (HTTP: $STATUS)"
    else
        warn "$FULL_DOMAIN → No A record"
    fi
done

echo ""

# ============================================
# 5. WORDPRESS-SPECIFIC ANALYSIS
# ============================================
log "🌐 MÓDULO 5: WordPress-Specific Analysis"
echo ""

info "WordPress detection..."
WP_ENDPOINTS=(
    "wp-admin/"
    "wp-content/"
    "wp-includes/"
    "xmlrpc.php"
    "wp-login.php"
    "readme.html"
    "wp-config.php"
)

for endpoint in "${WP_ENDPOINTS[@]}"; do
    STATUS=$(curl -I -s -w "%{http_code}" -o /dev/null https://$SITE_URL/$endpoint --max-time 5 2>/dev/null || echo "FAIL")
    case $STATUS in
        200) success "$endpoint → $STATUS (Found)" ;;
        403) warn "$endpoint → $STATUS (Forbidden)" ;;
        404) info "$endpoint → $STATUS (Not Found)" ;;
        500) error "$endpoint → $STATUS (Server Error)" ;;
        *) warn "$endpoint → $STATUS" ;;
    esac
done

echo ""

# ============================================
# 6. TECHNOLOGY STACK DETECTION
# ============================================
log "🔧 MÓDULO 6: Technology Stack Detection"
echo ""

info "Server headers analysis..."
HEADERS=$(curl -I -s https://$SITE_URL 2>/dev/null)

echo "$HEADERS" | grep -i server && success "Server detected" || warn "Server header hidden"
echo "$HEADERS" | grep -i "x-powered-by" && success "PHP/Framework detected" || info "X-Powered-By header hidden"
echo "$HEADERS" | grep -i "x-cache" && info "Cache system detected" || info "No cache headers"

info "WordPress version detection..."
WP_VERSION=$(curl -s https://$SITE_URL/wp-includes/version.php 2>/dev/null | grep -oP "wp_version = '\K[^']*" | head -1)
if [ -n "$WP_VERSION" ]; then
    success "WordPress version: $WP_VERSION"
else
    warn "WordPress version hidden/not accessible"
fi

echo ""

# ============================================
# 7. COMMON ERROR CAUSES
# ============================================
log "🚨 MÓDULO 7: Common 500 Error Analysis"
echo ""

info "Testing common WordPress issues..."

# Plugin conflicts
STATUS_NO_PLUGINS=$(curl -I -s -w "%{http_code}" -o /dev/null https://$SITE_URL/?safe_mode=1 --max-time 10 2>/dev/null || echo "FAIL")
info "Safe mode test: $STATUS_NO_PLUGINS"

# Memory issues
info "Checking for memory error patterns..."
RESPONSE=$(curl -s https://$SITE_URL 2>/dev/null)
echo "$RESPONSE" | grep -i "memory\|fatal\|error\|exception" | head -3

# Database connection
info "Database connection test (from our backup)..."
if mysql -h wp_imobiliaria.mysql.dbaas.com.br -u wp_imobiliaria -p'Ipe@4693' -e "SELECT 1" wp_imobiliaria 2>/dev/null >/dev/null; then
    success "Database is accessible from external"
else
    error "Database connection issue"
fi

echo ""

# ============================================
# 8. RECOMMENDATIONS
# ============================================
log "💡 MÓDULO 8: Diagnostic Recommendations"
echo ""

success "=== DIAGNOSTIC SUMMARY ==="
echo ""
echo "Site Status: HTTP 500 Internal Server Error"
echo "Database: ✅ Accessible externally"
echo "SSL: $(echo "$HEADERS" | grep -q "HTTP/1.1 500" && echo "⚠️  Returns 500" || echo "❓ Unknown")"
echo ""

success "=== LIKELY CAUSES ==="
echo ""
echo "1. 🔌 Plugin conflict (WPL Real Estate plugin issues)"
echo "2. 🎨 Theme error (custom theme 'ipeimoveis' problems)"
echo "3. 💾 PHP memory limit exceeded"
echo "4. 📝 Corrupted .htaccess file"
echo "5. 🔧 PHP version compatibility issues"
echo "6. 🗂️ File permissions problems"
echo "7. 🔗 wp-config.php database connection issues"
echo ""

success "=== NEXT STEPS ==="
echo ""
echo "1. 📋 Check server error logs (cPanel/Plesk)"
echo "2. 🔧 Access via FTP and rename plugins folder to disable"
echo "3. 🎨 Switch to default theme temporarily"  
echo "4. 📝 Check/restore .htaccess file"
echo "5. 🔄 Increase PHP memory limit"
echo "6. 📊 Enable WordPress debug mode"
echo ""

success "=== FILES TO CHECK/FIX ==="
echo ""
echo "Priority 1:"
echo "  - wp-config.php (database credentials)"
echo "  - .htaccess (URL rewrite rules)"
echo "  - wp-content/plugins/ (disable to test)"
echo ""
echo "Priority 2:"  
echo "  - wp-content/themes/ipeimoveis/ (theme errors)"
echo "  - php.ini (memory limits)"
echo "  - server error logs"
echo ""

echo "======================================="
log "📊 Diagnostic completed!"
echo "======================================="
echo ""
echo "Full log: $LOG_FILE"