# 🚀 Acesso Rápido ao WordPress no Lightsail

**TL;DR**: Execute isso e pronto.

## Setup Inicial (Uma vez só)

```bash
cd /home/jpcardozx/projetos/nova-ipe

# Instalar dependências e configurar AWS
./scripts/setup.sh
```

## Obter Senha do WordPress

```bash
# Executar script de acesso
./scripts/lightsail-access.sh

# Ele vai mostrar:
# - URL do wp-admin
# - Usuário (geralmente "user")
# - Senha
```

## Migrar Site

```bash
# Executar helper de migração
./scripts/wp-migration-helper.sh

# Menu interativo para:
# 1. Upload SQL
# 2. Upload wp-content
# 3. Search-replace URLs
# 4. Corrigir permissões
# etc.
```

## Comandos Diretos (se preferir manual)

### Acessar SSH

```bash
# Via script (recomendado)
./scripts/lightsail-access.sh
# Opção 1: Conectar via SSH

# Ou manual
ssh -i .lightsail-access/key.pem \
  -o UserKnownHostsFile=.lightsail-access/known_hosts \
  bitnami@SEU_IP
```

### Criar Novo Admin no WordPress

```bash
# Dentro da instância SSH
cd /opt/bitnami/wordpress
sudo wp user create admin admin@email.com \
  --role=administrator \
  --user_pass='SuaSenhaForte123!' \
  --allow-root
```

### Importar Banco

```bash
# Upload do .sql
scp -i .lightsail-access/key.pem backup.sql bitnami@SEU_IP:/tmp/

# SSH na instância
ssh -i .lightsail-access/key.pem bitnami@SEU_IP

# Importar
cd /opt/bitnami/wordpress
sudo wp db import /tmp/backup.sql --allow-root
```

### Atualizar URLs

```bash
# DRY RUN (sempre primeiro!)
sudo wp search-replace 'http://old.com' 'https://new.com' \
  --all-tables --dry-run --allow-root

# Executar
sudo wp search-replace 'http://old.com' 'https://new.com' \
  --all-tables --allow-root
```

### Configurar HTTPS

```bash
# Depois que DNS estiver apontado
ssh -i .lightsail-access/key.pem bitnami@SEU_IP
sudo /opt/bitnami/bncert-tool
```

## Estrutura dos Arquivos

```
scripts/
├── setup.sh                    # Setup inicial (AWS CLI, jq, config)
├── lightsail-access.sh         # Obter senha e SSH
└── wp-migration-helper.sh      # Ferramentas de migração

docs/
├── README_WORDPRESS_TOOLKIT.md           # Guia completo
├── MIGRACAO_WORDPRESS_LIGHTSAIL.md       # Passo a passo migração
├── QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md # Comandos úteis
└── START_HERE.md                         # Este arquivo
```

## Troubleshooting Rápido

### AWS CLI não configurado
```bash
aws configure
# Preencha: Access Key, Secret Key, Region (us-east-1)
```

### Senha não encontrada
```bash
# Via SSH, crie nova senha
sudo wp user update user --user_pass='NovaSenha!' --allow-root
```

### Permalinks quebrados
```bash
sudo wp rewrite flush --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### Imagens não aparecem
```bash
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads
sudo chmod -R 755 /opt/bitnami/wordpress/wp-content/uploads
```

## Documentação Completa

Leia: [`docs/README_WORDPRESS_TOOLKIT.md`](./README_WORDPRESS_TOOLKIT.md)

---

**Dúvida?** Consulte a [Quick Reference](./QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md) para todos os comandos.
