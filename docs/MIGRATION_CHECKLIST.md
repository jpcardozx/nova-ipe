# ✅ Checklist Migração Completa

## 📦 O que migrar (WordPress completo)

### 1. Banco de Dados ✅ 
- **DB:** wp_imobiliaria (7.5 MB)
- **Backup:** ~/db-backups/wp_imobiliaria_backup_20251006_183343.sql.gz

### 2. Arquivos WordPress ❌ PENDENTE
```
public_html/
├── wp-admin/          (WordPress core - ~15 MB)
├── wp-includes/       (WordPress core - ~30 MB)
├── wp-content/
│   ├── uploads/       ⚠️ CRÍTICO - Fotos dos imóveis (500 MB - 5 GB?)
│   ├── themes/        ⚠️ CRÍTICO - Design do site (~50 MB)
│   ├── plugins/       ⚠️ CRÍTICO - Funcionalidades (~100-300 MB)
│   └── cache/         (pode ignorar)
├── wp-config.php      ⚠️ CRÍTICO - Configurações
└── .htaccess          ⚠️ CRÍTICO - URLs amigáveis
```

**Total estimado:** 1-5 GB (depende das fotos)

### 3. Outros DBs ❌ PENDENTE
- Você mencionou "3 auxiliares" - quais são?

### 4. Emails ❌ PENDENTE
- Contas ativas?
- Onde estão hospedados?

## 🎯 Ação Imediata

### Via FileZilla (Recomendado)
```
Host: 187.45.193.173
Port: 22 (SFTP)
User: imobiliariaipe1
Pass: Imobiliaria@46933003
```

**Verificar tamanho:**
1. Conectar
2. Ir em `public_html/`
3. Ver tamanho de `wp-content/uploads/`
4. Anotar aqui o tamanho total

### Se SSH funcionar
```bash
# Tamanho total
du -sh public_html/

# Por pasta
du -sh public_html/wp-content/uploads/
du -sh public_html/wp-content/themes/
du -sh public_html/wp-content/plugins/

# Criar backup completo
cd ~
tar -czf wordpress_full_$(date +%Y%m%d).tar.gz public_html/

# Download depois
scp -P 22 imobiliariaipe1@187.45.193.173:~/wordpress_full_*.tar.gz ./
```

## 💡 Estratégia Otimizada

### Backup Seletivo (mais rápido)
```bash
# Apenas essencial
tar -czf wp_essencial.tar.gz \
  public_html/wp-content/uploads/ \
  public_html/wp-content/themes/ \
  public_html/wp-content/plugins/ \
  public_html/wp-config.php \
  public_html/.htaccess

# WordPress core pode re-instalar limpo na AWS
```

## ⏱️ Tempo Estimado Real

| Item | Tamanho | Tempo Download (10 Mbps) |
|------|---------|--------------------------|
| DB | 602 KB | 1 segundo |
| wp-core | 45 MB | 36 segundos |
| plugins | 300 MB | 4 minutos |
| themes | 50 MB | 40 segundos |
| uploads | **2 GB** | **27 minutos** |
| **TOTAL** | **~2.5 GB** | **~30 min** |

Se uploads > 5 GB → Usar rsync incremental ou S3 transfer

---
**Me informe:** Qual o tamanho de `public_html/wp-content/uploads/` via FileZilla?
