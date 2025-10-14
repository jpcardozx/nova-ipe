#!/bin/bash

# Script para organizar documentação do projeto
# Move markdowns da raiz para pastas temáticas

echo "📚 Organizando documentação do projeto..."
echo ""

# AUTENTICAÇÃO & LOGIN
echo "🔐 Movendo docs de Autenticação..."
mv ARQUITETURA_AUTH*.md docs/autenticacao/ 2>/dev/null
mv AUTENTICACAO_*.md docs/autenticacao/ 2>/dev/null
mv AUTH_*.md docs/autenticacao/ 2>/dev/null
mv *LOGIN*.md docs/autenticacao/ 2>/dev/null
mv SOLUCAO_AUTENTICACAO*.md docs/autenticacao/ 2>/dev/null
mv VALIDACAO_LOGIN*.md docs/autenticacao/ 2>/dev/null
mv CHECKLIST_VALIDACAO_AUTH.md docs/autenticacao/ 2>/dev/null
mv AUDITORIA_SEGURANCA_LOGIN.md docs/autenticacao/ 2>/dev/null
mv ANALISE_SEGURANCA_COMPARATIVA.md docs/autenticacao/ 2>/dev/null

# MIGRAÇÃO & SUPABASE
echo "🔄 Movendo docs de Migração..."
mv MIGRACAO_*.md docs/migracao/ 2>/dev/null
mv *MIGRATION*.md docs/migracao/ 2>/dev/null
mv EXECUTAR_MIGRACAO*.md docs/migracao/ 2>/dev/null
mv GUIA_MIGRACAO*.md docs/migracao/ 2>/dev/null
mv EXPLICACAO_MIGRATION*.md docs/migracao/ 2>/dev/null
mv PLANO_MIGRACAO*.md docs/migracao/ 2>/dev/null
mv GUIA_RAPIDO_MIGRATION.md docs/migracao/ 2>/dev/null
mv README_MIGRACAO.md docs/migracao/ 2>/dev/null
mv STATUS_MIGRACAO.md docs/migracao/ 2>/dev/null
mv PROXIMAS_ETAPAS_MIGRACAO.md docs/migracao/ 2>/dev/null
mv ANALISE_RISCOS_MIGRACAO.md docs/migracao/ 2>/dev/null
mv PROGRESSO_MIGRACAO*.md docs/migracao/ 2>/dev/null

# SISTEMA DE CHAVES
echo "🔑 Movendo docs de Sistema de Chaves..."
mv *KEYS*.md docs/sistema-chaves/ 2>/dev/null
mv *CHAVES*.md docs/sistema-chaves/ 2>/dev/null
mv BACKEND_SISTEMA_CHAVES.md docs/sistema-chaves/ 2>/dev/null
mv CORRECAO_ERRO_LEADS_TABLE.md docs/sistema-chaves/ 2>/dev/null

# WORDPRESS CATALOG & R2
echo "📸 Movendo docs de WordPress Catalog..."
mv *WORDPRESS*.md docs/wordpress-catalog/ 2>/dev/null
mv *R2*.md docs/wordpress-catalog/ 2>/dev/null
mv DESCOBERTA_R2*.md docs/wordpress-catalog/ 2>/dev/null
mv RELATORIO_*_MIGRACAO.md docs/wordpress-catalog/ 2>/dev/null
mv RELATORIO_STATUS_IMAGENS.md docs/wordpress-catalog/ 2>/dev/null
mv GUIA_MIGRACAO_IMAGENS*.md docs/wordpress-catalog/ 2>/dev/null
mv *CATALOG*.md docs/wordpress-catalog/ 2>/dev/null
mv IMAGENS_*.md docs/wordpress-catalog/ 2>/dev/null

# JETIMOB
echo "🏢 Movendo docs de Jetimob..."
mv JETIMOB_*.md docs/jetimob/ 2>/dev/null
mv TANSTACK_QUERY_JETIMOB*.md docs/jetimob/ 2>/dev/null

# UI/UX & DESIGN
echo "🎨 Movendo docs de UI/UX..."
mv *UI_UX*.md docs/ui-ux/ 2>/dev/null
mv *DESIGN*.md docs/ui-ux/ 2>/dev/null
mv APRIMORAMENTOS_UI_UX.md docs/ui-ux/ 2>/dev/null
mv MELHORIAS_UI_UX*.md docs/ui-ux/ 2>/dev/null
mv *REDESIGN*.md docs/ui-ux/ 2>/dev/null
mv *GLASSMORPHISM*.md docs/ui-ux/ 2>/dev/null
mv *CARROSSEL*.md docs/ui-ux/ 2>/dev/null
mv *HERO*.md docs/ui-ux/ 2>/dev/null
mv *HEADER*.md docs/ui-ux/ 2>/dev/null
mv *HOMEPAGE*.md docs/ui-ux/ 2>/dev/null
mv BADGES_USP*.md docs/ui-ux/ 2>/dev/null
mv CORRECOES_DESIGN*.md docs/ui-ux/ 2>/dev/null
mv *CARDS*.md docs/ui-ux/ 2>/dev/null
mv PROPOSTAS_OTIMIZACAO*.md docs/ui-ux/ 2>/dev/null
mv *MOBILE*.md docs/ui-ux/ 2>/dev/null
mv *DARK_MODE*.md docs/ui-ux/ 2>/dev/null

# PERFORMANCE
echo "⚡ Movendo docs de Performance..."
mv *PERFORMANCE*.md docs/performance/ 2>/dev/null
mv *OTIMIZACAO*.md docs/performance/ 2>/dev/null
mv BUNDLE_OPTIMIZATION.md docs/performance/ 2>/dev/null
mv KNIP_ANALISE*.md docs/performance/ 2>/dev/null
mv RELATORIO_LIMPEZA*.md docs/performance/ 2>/dev/null
mv *LAZY_LOADING*.md docs/performance/ 2>/dev/null

# TROUBLESHOOTING & FIXES
echo "🔧 Movendo docs de Troubleshooting..."
mv FIX_*.md docs/troubleshooting/ 2>/dev/null
mv *DEBUG*.md docs/troubleshooting/ 2>/dev/null
mv CORRECAO_*.md docs/troubleshooting/ 2>/dev/null
mv CORRECOES_*.md docs/troubleshooting/ 2>/dev/null
mv DIAGNOSTICO_*.md docs/troubleshooting/ 2>/dev/null
mv SOLUCAO_*.md docs/troubleshooting/ 2>/dev/null
mv *ERROR*.md docs/troubleshooting/ 2>/dev/null
mv *ERRORS*.md docs/troubleshooting/ 2>/dev/null
mv PROBLEMA_*.md docs/troubleshooting/ 2>/dev/null
mv QUOTA_*.md docs/troubleshooting/ 2>/dev/null
mv ACAO_IMEDIATA*.md docs/troubleshooting/ 2>/dev/null
mv QUICK_FIX*.md docs/troubleshooting/ 2>/dev/null
mv *OVERFLOW*.md docs/troubleshooting/ 2>/dev/null
mv COOKIE_*.md docs/troubleshooting/ 2>/dev/null
mv NOTIFICACOES_CORRECOES.md docs/troubleshooting/ 2>/dev/null

# ARQUIVOS ANTIGOS/CONCLUÍDOS
echo "📦 Movendo arquivos antigos..."
mv ANALISE_*.md docs/arquivos-antigos/ 2>/dev/null
mv RESUMO_*.md docs/arquivos-antigos/ 2>/dev/null
mv RELATORIO_*.md docs/arquivos-antigos/ 2>/dev/null
mv SUMARIO_*.md docs/arquivos-antigos/ 2>/dev/null
mv STATUS_*.md docs/arquivos-antigos/ 2>/dev/null
mv ENTREGA_*.md docs/arquivos-antigos/ 2>/dev/null
mv ESTADO_*.md docs/arquivos-antigos/ 2>/dev/null
mv TESTE_*.md docs/arquivos-antigos/ 2>/dev/null
mv VALIDACAO_*.md docs/arquivos-antigos/ 2>/dev/null
mv SYSTEM_*.md docs/arquivos-antigos/ 2>/dev/null
mv *SINGLETON*.md docs/arquivos-antigos/ 2>/dev/null
mv CONCLUIDO.txt docs/arquivos-antigos/ 2>/dev/null
mv *IMPLEMENTATION*.md docs/arquivos-antigos/ 2>/dev/null
mv TODO_*.md docs/arquivos-antigos/ 2>/dev/null
mv ISSUE_*.md docs/arquivos-antigos/ 2>/dev/null
mv *RECOVERY*.md docs/arquivos-antigos/ 2>/dev/null
mv *RESTAURACAO*.md docs/arquivos-antigos/ 2>/dev/null
mv TYPECHECK_REPORT.md docs/arquivos-antigos/ 2>/dev/null
mv *MODERNIZACAO*.md docs/arquivos-antigos/ 2>/dev/null
mv RETRY_LOGIC*.md docs/arquivos-antigos/ 2>/dev/null
mv TRABALHO_REALIZADO*.md docs/arquivos-antigos/ 2>/dev/null

# CLOUDFLARE & INFRAESTRUTURA
echo "☁️  Movendo docs de Infraestrutura..."
mv CLOUDFLARE_*.md docs/migracao/ 2>/dev/null
mv GUIA_CLOUDFLARE.md docs/migracao/ 2>/dev/null
mv *DNS*.md docs/migracao/ 2>/dev/null
mv INFORMACOES_*.md docs/migracao/ 2>/dev/null
mv EXPLICACAO_LIGHTSAIL*.md docs/migracao/ 2>/dev/null
mv *BACKUP*.md docs/migracao/ 2>/dev/null

# GUIAS GERAIS
echo "📖 Movendo guias gerais..."
mv GUIA_*.md docs/arquivos-antigos/ 2>/dev/null
mv *GUIA*.md docs/arquivos-antigos/ 2>/dev/null

# DASHBOARD
echo "📊 Movendo docs de Dashboard..."
mv DASHBOARD_*.md docs/ui-ux/ 2>/dev/null
mv PROXIMOS_PASSOS_DASHBOARD.md docs/arquivos-antigos/ 2>/dev/null

# WPL & CATEGORIAS
echo "🏠 Movendo docs específicos..."
mv WPL_*.md docs/arquivos-antigos/ 2>/dev/null
mv CATEGORIAS_*.md docs/arquivos-antigos/ 2>/dev/null
mv IMOVEIS_*.md docs/arquivos-antigos/ 2>/dev/null

# SSR/CSR & SESSION
echo "⚙️  Movendo docs técnicos..."
mv *SSR*.md docs/autenticacao/ 2>/dev/null
mv *SESSION*.md docs/autenticacao/ 2>/dev/null
mv *TOKENS*.md docs/autenticacao/ 2>/dev/null

# STUDIO
echo "🎬 Movendo docs de Studio..."
mv *STUDIO*.md docs/performance/ 2>/dev/null

echo ""
echo "✅ Organização concluída!"
echo ""
echo "📂 Estrutura criada:"
echo "   docs/autenticacao/       - Autenticação, login, auth"
echo "   docs/migracao/          - Migrações, Supabase, infraestrutura"
echo "   docs/sistema-chaves/    - Gestão de entregas de chaves"
echo "   docs/wordpress-catalog/ - WordPress, R2, fotos"
echo "   docs/jetimob/           - Integração Jetimob"
echo "   docs/ui-ux/             - Design, UI/UX, componentes visuais"
echo "   docs/performance/       - Otimizações, performance"
echo "   docs/troubleshooting/   - Correções, fixes, debug"
echo "   docs/arquivos-antigos/  - Relatórios, resumos, arquivos históricos"
echo ""
