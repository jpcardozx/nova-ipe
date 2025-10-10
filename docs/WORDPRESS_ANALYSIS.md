# 📊 Análise Completa do WordPress

**Fonte:** Banco de dados MySQL  
**Data:** 6 de outubro de 2025

## 🌐 Informações do Site

```
Nome: Imobiliária em Guararema - Ipê Imóveis
URL Atual: https://www.imobiliariaipe.com.br
URL Antiga: http://wp.imobiliariaipe.com.br
```

## 🎨 Theme

```
Nome: ipeimoveis (tema custom)
Localização: wp-content/themes/ipeimoveis/
Status: CUSTOM (não é tema público)
```

**⚠️ CRÍTICO:** Theme custom precisa ser baixado!

## 🔌 Plugins Ativos (4)

1. **Google Universal Analytics** (`google-universal-analytics`)
2. **WPL - Real Estate Listing** (`real-estate-listing-realtyna-wpl`) ⭐ PRINCIPAL
3. **W3 Total Cache** (`w3-total-cache`)
4. **Yoast SEO** (`wordpress-seo`)

## 📁 Estrutura de Uploads

```
wp-content/uploads/
├── 2016/
│   ├── 07/ (logos, background)
│   └── 08/ (última atualização: 08/08/2016)
└── wpl/ (imagens de imóveis do plugin WPL)

Total de anexos: 7 arquivos apenas
Último upload: 08/08/2016
```

**⚠️ ATENÇÃO:** Apenas 7 anexos no wp_posts, mas WPL armazena fotos de imóveis em estrutura própria!

## 🏠 Dados de Imóveis

```
Plugin: Realtyna WPL (Real Estate)
Propriedades: 761 imóveis
Tabela: wp_wpl_properties (4.17 MB)
Itens: wp_wpl_items (6843 registros, 1.66 MB)
```

**Fotos dos imóveis:** Provavelmente em `wp-content/uploads/wpl/` (não via wp_posts)

## 👥 Usuários (4)

| Login | Email | Cadastro |
|-------|-------|----------|
| admin | rfpaula2005@gmail.com | 16/07/2016 |
| jlpaula | jlpaula@terra.com.br | 16/07/2016 |
| corretor01 | ipeimoveis@imobiliariaipe.com.br | 16/07/2016 |
| rfpaula | rfpaula.2005@gmail.com | 08/08/2016 |

## 📦 O que PRECISAMOS baixar

### CRÍTICO (Insubstituível):
```
✅ Banco de dados (JÁ TEMOS)
❌ wp-content/themes/ipeimoveis/ (tema custom)
❌ wp-content/uploads/wpl/ (fotos dos 761 imóveis)
❌ wp-content/plugins/real-estate-listing-realtyna-wpl/ (custom config)
```

### Importante:
```
❌ wp-content/uploads/2016/ (logos, backgrounds)
❌ wp-content/plugins/ (todos, com configurações)
❌ wp-config.php (configurações)
❌ .htaccess (regras de URL)
```

### Opcional (pode reinstalar):
```
- WordPress core (pode baixar limpo)
- W3 Total Cache (plugin público)
- Yoast SEO (plugin público)
- Google Analytics (plugin público)
```

## 🎯 Plano de Ação

### Sem SSH/FTP (Firewall bloqueado):

**Opção 1: Painel LocaWeb**
1. Login: https://painel.locaweb.com.br
2. File Manager
3. Comprimir apenas essenciais:
   - `wp-content/themes/ipeimoveis/`
   - `wp-content/uploads/`
   - `wp-content/plugins/real-estate-listing-realtyna-wpl/`
   - `wp-config.php`

**Opção 2: Contato Suporte**
- Solicitar backup completo
- Ou liberar IP no firewall

### Com acesso restaurado:
```bash
# Download seletivo (essencial)
./scripts/backup-essentials.sh
# ~500 MB - 2 GB estimado
```

## 📊 Estimativa de Tamanho

```
Banco de dados: 8.32 MB ✅ JÁ TEMOS
Theme custom: ~10-50 MB
Plugin WPL + fotos: 200 MB - 2 GB
Outros plugins: 50-200 MB
Uploads gerais: 10-50 MB

Total estimado: 500 MB - 2.5 GB
```

## 🚨 Prioridade Máxima

1. **Theme ipeimoveis** (design do site)
2. **Fotos WPL** (761 imóveis)
3. **Plugin WPL** (funcionalidade core)

Sem esses 3, o site não funciona!

---

**Próximo passo:** Acessar painel LocaWeb para download manual
