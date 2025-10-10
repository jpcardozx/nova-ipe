# 💾 BACKUP AUTOMÁTICO WORDPRESS - AWS LIGHTSAIL

**Status:** 🔜 **PRONTO PARA IMPLEMENTAR**  
**Servidor:** 13.223.237.99 (Bitnami WordPress)  
**Objetivo:** Backups automáticos diários do WordPress + Database

---

## 📋 ESTRATÉGIA DE BACKUP (3 NÍVEIS)

### Nível 1: Lightsail Automatic Snapshots (SISTEMA COMPLETO) 🟢
- **O que é:** Imagem completa do servidor (snapshot)
- **Frequência:** Diário automático
- **Retenção:** 7 dias
- **Custo:** ~$0.05/GB/mês (~$1-2/mês para servidor de 40GB)
- **Restauração:** Cria novo servidor idêntico
- **Prioridade:** ⭐⭐⭐⭐⭐ **ESSENCIAL**

### Nível 2: Database Backup (APENAS DADOS) 🟡
- **O que é:** Dump MySQL do WordPress
- **Frequência:** Diário (3h da manhã)
- **Retenção:** 30 dias
- **Custo:** Grátis (storage local)
- **Restauração:** Rápida, apenas database
- **Prioridade:** ⭐⭐⭐⭐ **IMPORTANTE**

### Nível 3: S3 Backup (OFFSITE CLOUD) 🔵
- **O que é:** Cópia para AWS S3 (fora do servidor)
- **Frequência:** Semanal
- **Retenção:** 90 dias
- **Custo:** ~$0.023/GB/mês (~$0.10/mês)
- **Restauração:** Manual via download
- **Prioridade:** ⭐⭐⭐ **RECOMENDADO**

---

## 🎯 IMPLEMENTAÇÃO RÁPIDA (APENAS ESSENCIAL)

### Habilitar Lightsail Snapshots (5 minutos)

**Via Console AWS:**
```
1. Acesse: https://lightsail.aws.amazon.com/
2. Clique na sua instância (WordPress)
3. Aba "Snapshots"
4. "Enable automatic snapshots"
5. Configurar:
   - Time: 03:00 (3h da manhã, horário de baixo tráfego)
   - Number of snapshots: 7 (última semana)
6. Clicar "Enable"

✅ PRONTO! Agora você tem backup diário automático!
```

**Via AWS CLI (alternativo):**
```bash
# Habilitar snapshots automáticos
aws lightsail enable-add-on \
  --region us-east-1 \
  --resource-name WordPress-512MB-Singapore \
  --add-on-request addOnType=AutoSnapshot

# Verificar status
aws lightsail get-auto-snapshots \
  --region us-east-1 \
  --resource-name WordPress-512MB-Singapore
```

**Custo estimado:**
```
Servidor: ~40GB usado
Snapshot: ~20GB comprimido (média)
Custo: $0.05/GB/mês × 20GB × 7 snapshots = ~$7/mês

⚠️ Se quiser economizar:
- Reduzir para 3 snapshots (últimos 3 dias): ~$3/mês
```

---

## 🔧 IMPLEMENTAÇÃO COMPLETA (RECOMENDADO)

### 1. Lightsail Snapshots (VIA CONSOLE - MAIS FÁCIL)

```
✅ JÁ EXPLICADO ACIMA - APENAS HABILITAR NO CONSOLE
```

### 2. Database Backup Diário (CRON JOB)

**Conectar no servidor:**
```bash
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99
```

**Criar script de backup:**
```bash
# Criar diretório para backups
mkdir -p /home/bitnami/backups/mysql
chmod 700 /home/bitnami/backups

# Criar script de backup
cat > /home/bitnami/backup-mysql.sh << 'EOF'
#!/bin/bash
##############################################
# WordPress MySQL Backup Script
# Criado: 2025-01-08
# Descrição: Backup diário do database WordPress
##############################################

# Configurações
DB_USER="wp_imobiliaria"
DB_PASS="Ipe@5084"
DB_NAME="wp_imobiliaria"
BACKUP_DIR="/home/bitnami/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/wp_backup_$DATE.sql.gz"
LOG_FILE="/home/bitnami/backups/backup.log"
RETENTION_DAYS=30

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Log início
echo "[$(date)] Iniciando backup do database..." >> $LOG_FILE

# Fazer backup comprimido
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE

# Verificar sucesso
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "[$(date)] ✅ Backup concluído: $BACKUP_FILE ($BACKUP_SIZE)" >> $LOG_FILE
    
    # Remover backups antigos (mais de 30 dias)
    find $BACKUP_DIR -name "wp_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    echo "[$(date)] 🗑️  Backups antigos removidos (>$RETENTION_DAYS dias)" >> $LOG_FILE
else
    echo "[$(date)] ❌ ERRO no backup!" >> $LOG_FILE
fi

# Estatísticas
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/wp_backup_*.sql.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo "[$(date)] 📊 Total de backups: $TOTAL_BACKUPS | Espaço usado: $TOTAL_SIZE" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
EOF

# Dar permissão de execução
chmod +x /home/bitnami/backup-mysql.sh

# Testar script
/home/bitnami/backup-mysql.sh

# Verificar se funcionou
ls -lh /home/bitnami/backups/mysql/
cat /home/bitnami/backups/backup.log
```

**Agendar execução diária (cron):**
```bash
# Editar crontab do usuário bitnami
crontab -e

# Adicionar linha (executar às 3h da manhã todo dia):
0 3 * * * /home/bitnami/backup-mysql.sh

# Salvar e sair (Ctrl+X, Y, Enter no nano)

# Verificar agendamento
crontab -l
```

**Testar manualmente:**
```bash
# Executar backup agora
/home/bitnami/backup-mysql.sh

# Ver resultado
ls -lh /home/bitnami/backups/mysql/
cat /home/bitnami/backups/backup.log

# Verificar conteúdo do backup
gunzip -c /home/bitnami/backups/mysql/wp_backup_*.sql.gz | head -20
```

### 3. Files Backup (UPLOADS WPL - OPCIONAL)

**Backup das fotos dos imóveis (4.2GB):**

```bash
# Criar script de backup de arquivos
cat > /home/bitnami/backup-files.sh << 'EOF'
#!/bin/bash
##############################################
# WordPress Files Backup Script
# Foco: Uploads WPL (fotos imóveis)
##############################################

BACKUP_DIR="/home/bitnami/backups/files"
WP_UPLOADS="/opt/bitnami/wordpress/wp-content/uploads"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/home/bitnami/backups/backup.log"

mkdir -p $BACKUP_DIR

echo "[$(date)] Iniciando backup de arquivos..." >> $LOG_FILE

# Backup incremental (apenas mudanças)
rsync -a --delete $WP_UPLOADS/ $BACKUP_DIR/uploads_latest/

# Criar snapshot semanal (todo domingo)
if [ $(date +%u) -eq 7 ]; then
    tar -czf $BACKUP_DIR/uploads_snapshot_$DATE.tar.gz -C $BACKUP_DIR uploads_latest/
    echo "[$(date)] 📸 Snapshot semanal criado" >> $LOG_FILE
    
    # Manter apenas últimos 4 snapshots (1 mês)
    ls -t $BACKUP_DIR/uploads_snapshot_*.tar.gz | tail -n +5 | xargs -r rm
fi

echo "[$(date)] ✅ Backup de arquivos concluído" >> $LOG_FILE
EOF

chmod +x /home/bitnami/backup-files.sh

# Agendar para executar todo dia às 4h (após backup MySQL)
crontab -e
# Adicionar:
0 4 * * * /home/bitnami/backup-files.sh
```

**⚠️ Atenção:**
- Backup de arquivos ocupa muito espaço (4.2GB)
- Considere apenas se disk space permitir
- Alternativa: usar S3 para arquivos (abaixo)

---

## 🌐 BACKUP S3 (OFFSITE - SEGURANÇA EXTRA)

### Por que S3?
```
✅ Fora do servidor (se Lightsail cair, S3 continua)
✅ Durabilidade 99.999999999% (11 noves)
✅ Versionamento automático
✅ Custo baixo (~$0.10/mês para 4GB)
✅ Integração fácil com AWS CLI
```

### Implementação:

**1. Criar bucket S3:**
```bash
# Criar bucket (nome único global)
aws s3 mb s3://backup-imobiliariaipe-wordpress --region us-east-1

# Ativar versionamento
aws s3api put-bucket-versioning \
  --bucket backup-imobiliariaipe-wordpress \
  --versioning-configuration Status=Enabled

# Configurar lifecycle (remover após 90 dias)
cat > lifecycle.json << 'EOF'
{
  "Rules": [
    {
      "Id": "Delete old backups",
      "Status": "Enabled",
      "Expiration": {
        "Days": 90
      },
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
  --bucket backup-imobiliariaipe-wordpress \
  --lifecycle-configuration file://lifecycle.json
```

**2. Script de backup para S3:**
```bash
# No servidor Lightsail
cat > /home/bitnami/backup-to-s3.sh << 'EOF'
#!/bin/bash
##############################################
# Backup para AWS S3
# Executa semanalmente (todo domingo)
##############################################

S3_BUCKET="s3://backup-imobiliariaipe-wordpress"
BACKUP_DIR="/home/bitnami/backups"
DATE=$(date +%Y%m%d)
LOG_FILE="/home/bitnami/backups/backup.log"

echo "[$(date)] Iniciando upload para S3..." >> $LOG_FILE

# Upload do último backup MySQL
LATEST_MYSQL=$(ls -t $BACKUP_DIR/mysql/wp_backup_*.sql.gz | head -1)
aws s3 cp $LATEST_MYSQL $S3_BUCKET/mysql/wp_backup_$DATE.sql.gz

# Upload dos arquivos (se houver)
if [ -d "$BACKUP_DIR/files/uploads_latest" ]; then
    aws s3 sync $BACKUP_DIR/files/uploads_latest/ $S3_BUCKET/uploads/$DATE/ --delete
fi

echo "[$(date)] ✅ Upload S3 concluído" >> $LOG_FILE
EOF

chmod +x /home/bitnami/backup-to-s3.sh

# Agendar para executar todo domingo às 5h
crontab -e
# Adicionar:
0 5 * * 0 /home/bitnami/backup-to-s3.sh
```

**3. Configurar IAM (permissões):**
```bash
# Criar usuário IAM para backups
aws iam create-user --user-name lightsail-backup-user

# Criar policy
cat > s3-backup-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::backup-imobiliariaipe-wordpress",
        "arn:aws:s3:::backup-imobiliariaipe-wordpress/*"
      ]
    }
  ]
}
EOF

aws iam put-user-policy \
  --user-name lightsail-backup-user \
  --policy-name S3BackupAccess \
  --policy-document file://s3-backup-policy.json

# Criar access keys
aws iam create-access-key --user-name lightsail-backup-user
# Anotar: ACCESS_KEY_ID e SECRET_ACCESS_KEY

# Configurar no servidor
ssh bitnami@13.223.237.99
aws configure
# Inserir access key, secret, region: us-east-1
```

---

## 🔄 COMO RESTAURAR BACKUPS

### Restaurar Lightsail Snapshot (SISTEMA COMPLETO)

**Via Console:**
```
1. AWS Lightsail Console → sua instância
2. Aba "Snapshots"
3. Selecionar snapshot desejado
4. Clicar "Create new instance from snapshot"
5. Escolher plano (mesmo ou maior)
6. Criar instância
7. Atualizar DNS para novo IP (se mudou)

⚠️ Cria nova instância - manter antiga até confirmar
```

**Via CLI:**
```bash
# Listar snapshots disponíveis
aws lightsail get-instance-snapshots --region us-east-1

# Criar nova instância do snapshot
aws lightsail create-instances-from-snapshot \
  --instance-snapshot-name "WordPress-2025-01-08" \
  --instance-names "WordPress-Restored" \
  --availability-zone us-east-1a \
  --bundle-id nano_2_0
```

### Restaurar Database Backup (APENAS DADOS)

**Restaurar backup local:**
```bash
# SSH no servidor
ssh bitnami@13.223.237.99

# Listar backups disponíveis
ls -lh /home/bitnami/backups/mysql/

# Escolher backup (exemplo: 20250108_030000)
BACKUP_FILE="/home/bitnami/backups/mysql/wp_backup_20250108_030000.sql.gz"

# Restaurar
gunzip -c $BACKUP_FILE | mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria

# Verificar
mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria -e "SELECT COUNT(*) FROM wp_wpl_properties;"

# Limpar cache WordPress
cd /opt/bitnami/wordpress
sudo wp cache flush --allow-root

# Reiniciar serviços
sudo systemctl restart bitnami
```

**Restaurar backup do S3:**
```bash
# Baixar do S3
aws s3 cp s3://backup-imobiliariaipe-wordpress/mysql/wp_backup_20250108.sql.gz /tmp/

# Restaurar
gunzip -c /tmp/wp_backup_20250108.sql.gz | mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria
```

### Restaurar Arquivos (UPLOADS)

**Do backup local:**
```bash
# Restaurar uploads
rsync -a /home/bitnami/backups/files/uploads_latest/ /opt/bitnami/wordpress/wp-content/uploads/

# Corrigir permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads/
sudo chmod -R 755 /opt/bitnami/wordpress/wp-content/uploads/
```

**Do S3:**
```bash
# Baixar do S3
aws s3 sync s3://backup-imobiliariaipe-wordpress/uploads/20250108/ /opt/bitnami/wordpress/wp-content/uploads/

# Corrigir permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads/
```

---

## 📊 MONITORAMENTO DE BACKUPS

### Verificar backups locais:
```bash
# SSH no servidor
ssh bitnami@13.223.237.99

# Ver últimos 10 backups MySQL
ls -lth /home/bitnami/backups/mysql/ | head -11

# Ver log de backups
tail -50 /home/bitnami/backups/backup.log

# Espaço usado por backups
du -sh /home/bitnami/backups/

# Verificar cron jobs ativos
crontab -l
```

### Verificar Lightsail snapshots:
```bash
# Via CLI
aws lightsail get-auto-snapshots \
  --region us-east-1 \
  --resource-name WordPress-512MB-Singapore

# Ou via console:
# https://lightsail.aws.amazon.com/ → Snapshots tab
```

### Verificar backups S3:
```bash
# Listar backups no S3
aws s3 ls s3://backup-imobiliariaipe-wordpress/mysql/ --recursive --human-readable

# Ver tamanho total
aws s3 ls s3://backup-imobiliariaipe-wordpress --recursive --summarize
```

---

## ⚠️ ALERTAS E NOTIFICAÇÕES (OPCIONAL)

### Email quando backup falhar:

```bash
# Instalar mailutils (se necessário)
sudo apt-get update
sudo apt-get install -y mailutils

# Modificar script de backup para enviar email em caso de erro
cat > /home/bitnami/backup-mysql.sh << 'EOF'
#!/bin/bash
# ... (script anterior) ...

# Adicionar no final:
if [ $? -ne 0 ]; then
    echo "ERRO no backup do database WordPress!" | mail -s "⚠️ Backup Falhou - $(date)" contato@imobiliariaipe.com.br
fi
EOF
```

### CloudWatch Alarms (avançado):
```bash
# Criar alarm para disk space
aws cloudwatch put-metric-alarm \
  --alarm-name wordpress-disk-space-critical \
  --alarm-description "Disk space acima de 80%" \
  --metric-name DiskSpaceUsed \
  --namespace AWS/Lightsail \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 💰 CUSTOS ESTIMADOS

### Configuração Mínima (ESSENCIAL):
```
Lightsail Snapshots: $3-7/mês
Database Backup Local: Grátis (storage local)
TOTAL: ~$3-7/mês
```

### Configuração Recomendada:
```
Lightsail Snapshots: $3-7/mês
Database Backup Local: Grátis
S3 Backup (4GB): ~$0.10/mês
TOTAL: ~$3-7/mês
```

### Configuração Completa:
```
Lightsail Snapshots: $3-7/mês
Database Backup Local: Grátis
Files Backup Local: Grátis (se houver espaço)
S3 Backup (4GB DB + 4GB files): ~$0.20/mês
CloudWatch Alarms: Grátis (10 primeiros)
TOTAL: ~$3-7/mês
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Essencial (5 minutos) ⭐⭐⭐⭐⭐
- [ ] Habilitar Lightsail automatic snapshots via console
  - [ ] Time: 03:00
  - [ ] Retention: 7 days
  - [ ] Verificar primeiro snapshot criado

### Fase 2: Importante (30 minutos) ⭐⭐⭐⭐
- [ ] SSH no servidor
- [ ] Criar diretório `/home/bitnami/backups`
- [ ] Criar script `backup-mysql.sh`
- [ ] Testar script manualmente
- [ ] Configurar cron job (3h da manhã)
- [ ] Verificar log no dia seguinte

### Fase 3: Recomendado (1 hora) ⭐⭐⭐
- [ ] Criar bucket S3
- [ ] Configurar lifecycle rules
- [ ] Criar usuário IAM
- [ ] Configurar AWS CLI no servidor
- [ ] Criar script `backup-to-s3.sh`
- [ ] Testar upload manual
- [ ] Configurar cron job semanal

### Fase 4: Opcional (avançado)
- [ ] Script de backup de arquivos
- [ ] Configurar email alerts
- [ ] CloudWatch alarms
- [ ] Documentar procedimentos de restore

---

## ✅ PRONTO PARA COMEÇAR?

### Opção 1: MÍNIMO ESSENCIAL (VOCÊ FAZ SOZINHO - 5 MIN)
```
1. Acesse: https://lightsail.aws.amazon.com/
2. Clique na sua instância
3. Aba "Snapshots" → "Enable automatic snapshots"
4. Pronto! ✅
```

### Opção 2: COMPLETO (EU AJUDO - 1 HORA)
```
1. Me avise quando estiver pronto
2. Eu conecto via SSH
3. Configuro tudo:
   - Lightsail snapshots
   - Database backup cron
   - S3 backup (opcional)
   - Scripts de restore
   - Documentação
4. Testo tudo
5. Deixo funcionando ✅
```

---

**Qual opção prefere?** 
- Opção 1: Rápido, você faz agora (5 min)
- Opção 2: Completo, eu configuro (1 hora)

**ME AVISE QUANDO QUISER IMPLEMENTAR!** 🚀
