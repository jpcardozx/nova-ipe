# ⚡ Resumo Executivo: Migração AWS

## 📊 Status

### DB Principal
- **DB:** 7.5 MB (602 KB .gz) ✅ Backup feito
- **Arquivos WordPress:** ❓ PENDENTE verificar (via FileZilla)
  - `public_html/` = themes, plugins, uploads (imagens)
  - Estimativa: 500 MB - 5 GB (depende de fotos)
- **Host:** wp_imobiliaria.mysql.dbaas.com.br (DBaaS remoto)
- **Conteúdo:** 761 propriedades, 16 páginas, 4 usuários

### Pendente
1. Listar outros 3 DBs (nomes e sizes)
2. Backup arquivos WordPress (~tamanho?)
3. Identificar emails ativos

## 🎯 Decisão: Migrar para AWS

**VIÁVEL:** ✅ SIM

**Vantagens:**
- DB pequeno = migração rápida
- Custo similar (~R$175-200/mês)
- Performance superior
- Escalável
- CloudFlare = CDN + DDoS free

**Desvantagens:**
- Gerenciamento manual
- Emails precisam ser migrados ou mantidos na LocaWeb

## 🚀 Workflow 4 Passos

### 1. BACKUP (Tempo varia com tamanho)
```bash
# ✅ DB: 7.5 MB - Feito
./scripts/wp-db-manager.sh backup

# ❌ ARQUIVOS: PENDENTE (via FileZilla)
# 1. Conectar FileZilla: imobiliariaipe1@187.45.193.173:22
# 2. Verificar tamanho de public_html/
# 3. Download completo ou apenas:
#    - wp-content/uploads/ (fotos)
#    - wp-content/themes/
#    - wp-content/plugins/
#    - wp-config.php

# Ou via SSH/SCP quando conexão estabilizar
```

### 2. AWS SETUP (3h)
```bash
# EC2 t3.small (Ubuntu 22.04 LEMP)
# RDS MySQL db.t3.micro
# Security Groups (80, 443, 22)
# Elastic IP

# Custo: ~$30-40/mês
```

### 3. CLOUDFLARE (30min)
```bash
# Adicionar domínio imobiliariaipe.com.br
# Nameservers para CloudFlare
# Registros DNS:
#   portal.imobiliariaipe.com.br → AWS Elastic IP
#   www.imobiliariaipe.com.br → AWS Elastic IP
# SSL Full (strict)
```

### 4. CUTOVER (1h)
```bash
# Instalar WordPress na AWS
# Importar DBs
# Update wp-config.php (novo DB host)
# Testar
# Update DNS
# Monitorar
```

## 📋 Próximas Ações

**Conexão SSH/FTP instável - Plano B:**

1. **Painel LocaWeb** (mais estável):
   - File Manager → Comprimir public_html/
   - Download via HTTP
   - OU solicitar backup via ticket

2. **Paralelo - Setup AWS** (DB já temos):
   - Provisionar EC2 + RDS
   - Importar DB (✅ já baixado)
   - Aguardar arquivos WordPress

3. **Depois:**
   - Upload arquivos para AWS
   - Configurar CloudFlare
   - Teste e DNS cutover

## 💡 Recomendação

**SIM, migre para AWS + CloudFlare**

Razões:
- DB de 7.5 MB é trivial
- Setup moderno vs hospedagem compartilhada
- CloudFlare Free = CDN global
- Controle total

**Única pendência:** Identificar os outros 3 DBs mencionados

---
**Próximo passo:** Me informe os nomes/sizes dos outros 3 DBs ou dê acesso ao painel LocaWeb para listar
