# 🚀 Migração LocaWeb → AWS + CloudFlare

## 📊 Status Atual

### Banco Principal (portal.imobiliariaipe.com.br)
- **Tamanho:** ~7.5 MB (602 KB comprimido)
- **Tabelas:** 761 propriedades, 6843 items
- **Backup:** ✅ Concluído
- **Viável:** ✅ SIM - Download via SSH é rápido

### Pendências
- [ ] Identificar 3 DBs auxiliares
- [ ] Backup arquivos WordPress (wp-content)
- [ ] Backup emails (se houver)
- [ ] DNS atual

## 🎯 Workflow Otimizado

### 1. Inventário Completo (1h)
```bash
# Listar todos os sites no servidor
ls -la ~/public_html/
ls -la ~/www/

# Backup completo de arquivos
tar -czf wordpress_files_$(date +%Y%m%d).tar.gz public_html/

# Download
scp -P 22 -o HostKeyAlgorithms=+ssh-rsa wordpress_files_*.tar.gz local/
```

### 2. AWS Setup (2-3h)
- **EC2:** t3.small (2 vCPU, 2 GB RAM) ~$15/mês
- **RDS MySQL:** db.t3.micro ~$15/mês
- **S3:** Media storage
- **CloudFront:** CDN opcional
- **Total:** ~$30-50/mês vs LocaWeb

### 3. CloudFlare DNS (30min)
- Transferir nameservers
- Configurar registros A/CNAME
- SSL automático
- Cache rules

### 4. Migração (2-4h)
```bash
# Instalar WordPress na AWS
# Importar DBs
# Configurar nginx/apache
# Testar
# Update DNS
```

## 📋 Checklist Migração

### LocaWeb → AWS
- [ ] Backup DBs (todos)
- [ ] Backup arquivos WordPress
- [ ] Backup emails
- [ ] Lista de domínios/subdominios
- [ ] Configurações DNS atuais
- [ ] Certificados SSL

### AWS Setup
- [ ] EC2 instance (Ubuntu 22.04 + LEMP)
- [ ] RDS MySQL instance
- [ ] Security Groups
- [ ] Elastic IP
- [ ] S3 buckets (opcional)

### CloudFlare
- [ ] Adicionar domínio
- [ ] Configurar nameservers
- [ ] Registros DNS
- [ ] SSL/TLS Full (strict)
- [ ] Page Rules
- [ ] Firewall rules

### Pós-Migração
- [ ] Testar todos os sites
- [ ] Configurar backups automáticos
- [ ] Monitoring (CloudWatch)
- [ ] Otimizações (cache, CDN)
- [ ] Cancelar LocaWeb

## 💰 Custo Comparativo

### LocaWeb Atual
- Hospedagem: ~R$ 50-150/mês
- **Limitações:** recursos compartilhados

### AWS Proposto
- EC2 t3.small: $15/mês
- RDS db.t3.micro: $15/mês
- Transfer/Storage: $5-10/mês
- **Total:** ~$35-40/mês (R$ 175-200)
- **Vantagens:** escalável, performance, controle total

### CloudFlare
- Free plan: $0
- Pro (opcional): $20/mês
- **Vantagens:** CDN global, DDoS protection, analytics

## ⚡ Comandos Rápidos

### Backup Completo
```bash
# Criar script de backup completo
cat > /tmp/full_backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Arquivos WordPress
tar -czf $BACKUP_DIR/wordpress_files.tar.gz public_html/

# Tamanho
du -sh $BACKUP_DIR/*
EOF

# Executar no servidor
sshpass -p "Imobiliaria@46933003" ssh -p 22 -o HostKeyAlgorithms=+ssh-rsa imobiliariaipe1@187.45.193.173 "bash -s" < /tmp/full_backup.sh

# Download
scp -P 22 -o HostKeyAlgorithms=+ssh-rsa imobiliariaipe1@187.45.193.173:~/backups/20251006/wordpress_files.tar.gz ./
```

### AWS EC2 Setup
```bash
# Ubuntu 22.04 LEMP Stack
sudo apt update && sudo apt upgrade -y
sudo apt install nginx mysql-client php8.1-fpm php8.1-mysql php8.1-xml php8.1-gd -y

# WordPress
cd /var/www/html
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
```

## 🔍 Próximos Passos

1. **AGORA:** Identificar outros 3 DBs
2. **AGORA:** Backup completo de arquivos (tar.gz)
3. **HOJE:** Setup AWS EC2 + RDS
4. **HOJE:** Configurar CloudFlare
5. **AMANHÃ:** Migração e testes
6. **AMANHÃ:** DNS cutover

## 🎯 Decisão

**Migração AWS + CloudFlare é VIÁVEL:**
- ✅ DB pequeno (7.5 MB) - download em segundos
- ✅ Custo similar ou menor
- ✅ Performance superior
- ✅ Escalabilidade
- ✅ Controle total

**Falta da LocaWeb:**
- Emails (migrar para AWS SES ou manter LocaWeb só email)
- Suporte técnico (resolver internamente)

---
**Próximo comando:** Identificar outros DBs e fazer backup de arquivos
