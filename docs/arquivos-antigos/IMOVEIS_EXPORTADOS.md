# ✅ FICHAS DE IMÓVEIS EXPORTADAS COM SUCESSO

**Data:** 8 de outubro de 2025, 10:27 UTC  
**Localização:** `/home/jpcardozx/projetos/nova-ipe/exports/imoveis/`  
**Status:** ✅ **COMPLETO**

---

## 📦 O QUE FOI EXPORTADO

### Arquivo Principal:
```
📁 /home/jpcardozx/projetos/nova-ipe/exports/imoveis/
├── imoveis-export-20251008.tar.gz (552KB) ✅
└── imoveis-export-20251008/ (extraído)
    ├── README.txt (instruções completas)
    ├── database/
    │   └── imoveis-completo.sql (6.7MB)
    ├── relatorio/
    │   ├── lista-imoveis.txt (lista formatada)
    │   └── pastas-imoveis.txt (índice de fotos)
    └── fotos-completas/
        └── (vazio - download separado)
```

---

## 📊 CONTEÚDO EXPORTADO

### 1. Database (6.7MB)
```sql
Arquivo: database/imoveis-completo.sql

Contém:
✅ wp_wpl_properties (761 imóveis)
   - ID, tipo, localização, preço, quartos, banheiros, etc
✅ wp_wpl_items (características dos imóveis)
   - Área, descrição, recursos, comodidades
✅ wp_wpl_addons (extensões WPL)
   - Configurações adicionais do plugin

Pode importar em qualquer MySQL:
mysql -u usuario -p database < imoveis-completo.sql
```

### 2. Relatório Formatado
```
Arquivo: relatorio/lista-imoveis.txt

Formato: Tabela texto com colunas
- ID do imóvel
- Tipo (listing: 0=venda, 1=aluguel, etc)
- Cidade (location1_name)
- Bairro (location2_name)
- Número de fotos (pic_numb)
- Data de cadastro

Exemplo:
ID | Tipo_Listing | Cidade | Bairro | Num_Fotos | Data_Cadastro
---+-------------+--------+--------+-----------+--------------
100| 0           | Guara  | Centro | 5         | 2020-12-13
```

### 3. Índice de Fotos
```
Arquivo: relatorio/pastas-imoveis.txt

Lista de todas as 763 pastas de imóveis com tamanho:
100 1.9M
102 234K
104 156K
...
```

### 4. Fotos (4.2GB - NÃO incluídas no pacote)
```
Localização no servidor: /opt/bitnami/wordpress/wp-content/uploads/WPL/

Estrutura de cada imóvel (exemplo ID 100):
WPL/
└── 100/
    ├── img_foto01.jpg (192KB) ← Original
    ├── img_foto02.jpg (202KB)
    ├── img_foto03.jpg (217KB)
    ├── thimg_foto01_105x80.jpg (5.7KB) ← Thumbnail pequeno
    ├── thimg_foto01_300x300.jpg (39KB) ← Thumbnail médio
    ├── thimg_foto01_640x480.jpg (90KB) ← Thumbnail grande
    └── thumbnail/
        └── img_foto01.jpg (cópia reduzida)

Total: ~763 pastas, ~4.2GB
```

---

## 📥 COMO BAIXAR AS FOTOS (OPCIONAL)

### Opção 1: Download Completo (4.2GB)
```bash
# Baixar TODAS as fotos dos imóveis
cd /home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/fotos-completas

scp -r -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/ \
  ./

# Tempo estimado: 30-60 minutos (depende da internet)
```

### Opção 2: Download Seletivo (apenas imóveis específicos)
```bash
# Exemplo: baixar apenas fotos dos imóveis 100, 102, 104
cd /home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/fotos-completas

for id in 100 102 104; do
  scp -r -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem \
    bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/$id \
    ./
done
```

### Opção 3: Download via RSYNC (mais eficiente)
```bash
# Usa rsync para download incremental (retoma se cair)
rsync -avz --progress \
  -e "ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem" \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/ \
  /home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/fotos-completas/
```

---

## 🔍 COMO USAR OS DADOS EXPORTADOS

### Ver Lista de Imóveis:
```bash
cd /home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008

# Ver todos imóveis
cat relatorio/lista-imoveis.txt

# Ver apenas primeiros 20
head -20 relatorio/lista-imoveis.txt

# Buscar por cidade
grep "Guararema" relatorio/lista-imoveis.txt

# Contar imóveis por tipo
cut -d'|' -f2 relatorio/lista-imoveis.txt | sort | uniq -c
```

### Importar Database:
```bash
# Se tiver MySQL local instalado
mysql -u root -p seu_database < database/imoveis-completo.sql

# Ou conectar em outro servidor
mysql -h servidor.com -u usuario -p database < database/imoveis-completo.sql
```

### Ver Estatísticas:
```bash
# Tamanho total
du -sh imoveis-export-20251008/

# Número de arquivos
find imoveis-export-20251008/ -type f | wc -l

# Ver estrutura
tree imoveis-export-20251008/ (se tiver tree instalado)
```

---

## 📊 ESTATÍSTICAS DA EXPORTAÇÃO

```
Total de imóveis: 761
Pastas de fotos: 763
Database: 6.7MB
Fotos (não incluídas): 4.2GB
Pacote compactado: 552KB

Tabelas exportadas:
- wp_wpl_properties (dados principais)
- wp_wpl_items (características)
- wp_wpl_addons (configurações)

Localização no PC:
/home/jpcardozx/projetos/nova-ipe/exports/imoveis/
```

---

## 🎯 PRÓXIMOS PASSOS

### 1. ✅ Exportação Concluída
- [x] Database exportado (6.7MB)
- [x] Relatórios gerados
- [x] Índice de fotos criado
- [x] Pacote baixado para PC
- [x] Extraído e organizado

### 2. ⏳ Fotos (Opcional - 4.2GB)
- [ ] Decidir se quer baixar TODAS as fotos
- [ ] Ou apenas fotos de imóveis específicos
- [ ] Executar comando de download (30-60 min)

### 3. 🎯 Uso dos Dados
- [ ] Análise dos imóveis
- [ ] Backup local seguro
- [ ] Importação em outro sistema (se necessário)
- [ ] Relatórios personalizados

---

## 💡 DICAS

### Backup dos Dados:
```bash
# Copiar para um HD externo ou nuvem
cp -r exports/imoveis/ /media/seu-hd-externo/backup-ipe/

# Ou sincronizar com nuvem (Dropbox, Google Drive, etc)
```

### Buscar Imóvel Específico:
```bash
# Por ID
grep "^100|" relatorio/lista-imoveis.txt

# Por cidade
grep "Guararema" relatorio/lista-imoveis.txt

# Com mais de 5 fotos
awk -F'|' '$5 > 5' relatorio/lista-imoveis.txt
```

### Converter para outros formatos:
```bash
# SQL para CSV (usando MySQL)
mysql -u usuario -p -e "SELECT * FROM wp_wpl_properties" database > imoveis.csv

# Ou importar o SQL e exportar via ferramentas gráficas
# (MySQL Workbench, phpMyAdmin, etc)
```

---

## ✅ CONCLUSÃO

**Exportação bem-sucedida!** ✅

Você agora tem:
- ✅ Todos os 761 imóveis exportados
- ✅ Database completo (6.7MB)
- ✅ Relatórios organizados
- ✅ Índice de fotos
- ✅ Pacote no seu PC

**Fotos (4.2GB):**
- ⏳ Ficaram no servidor (disponíveis para download)
- ⏳ Baixar quando necessário (opcional)
- ⏳ Já funcionando no site do Lightsail

---

**Localização final no seu PC:**
```
/home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/
```

**Quer baixar as fotos agora (4.2GB, ~30-60 min)?** 
- SIM → Execute o comando da Opção 1 acima
- NÃO → Deixe para depois, os dados já estão seguros no Lightsail
