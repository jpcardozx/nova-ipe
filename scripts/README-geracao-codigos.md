# 🏷️ Geração de Códigos de Imóveis

Este diretório contém scripts para gerar códigos internos únicos para os imóveis cadastrados no Sanity.

## 📋 Formato dos Códigos

Os códigos seguem o padrão: **[TIPO][FINALIDADE][ANO][SEQUENCIAL]**

### Exemplos:
- `CAV24001` = Casa Venda 2024 001
- `APA24002` = Apartamento Aluguel 2024 002
- `TEV24003` = Terreno Venda 2024 003
- `COA24004` = Comercial Aluguel 2024 004

### Mapeamento de Códigos:

**Tipos de Imóvel:**
- `CA` = Casa
- `AP` = Apartamento
- `TE` = Terreno
- `CO` = Comercial
- `OU` = Outro
- `IM` = Imóvel (genérico)

**Finalidades:**
- `V` = Venda
- `A` = Aluguel
- `T` = Temporada

## 🚀 Como Usar

### Opção 1: Script Node.js (Recomendado)

1. **Configure o token do Sanity:**
   ```bash
   # Windows
   set SANITY_API_WRITE_TOKEN=seu_token_aqui

   # Linux/Mac
   export SANITY_API_WRITE_TOKEN=seu_token_aqui
   ```

2. **Execute o script:**
   ```bash
   node scripts/gerar-codigos.js
   ```

### Opção 2: Interface Web

1. **Acesse a página administrativa:**
   ```
   http://localhost:3000/admin/gerar-codigos
   ```

2. **Clique em "Iniciar Geração de Códigos"**

3. **Acompanhe o progresso em tempo real**

### Opção 3: Script ES Modules

```bash
node scripts/gerar-codigos-simple.mjs
```

## 🔑 Obtendo o Token do Sanity

1. Acesse [https://sanity.io/manage](https://sanity.io/manage)
2. Selecione seu projeto
3. Vá em **API > Tokens**
4. Clique em **Add API Token**
5. Configure:
   - **Label:** Geração de Códigos
   - **Permissions:** Editor
6. Copie o token gerado

## 📊 O que o Script Faz

1. **Busca todos os imóveis** cadastrados no Sanity
2. **Identifica imóveis sem código** interno
3. **Gera códigos únicos** baseados no tipo e finalidade
4. **Atualiza os imóveis** no Sanity com os novos códigos
5. **Evita duplicatas** verificando códigos existentes
6. **Relatório detalhado** do processo

## ⚠️ Importantes

- ✅ **Seguro:** Só adiciona códigos em imóveis que não possuem
- ✅ **Único:** Verifica duplicatas antes de salvar
- ✅ **Reversível:** Não altera outros dados do imóvel
- ✅ **Log completo:** Mostra todo o processo
- ⚠️ **Requer token:** Precisa de permissão de escrita no Sanity

## 🔧 Configuração do Ambiente

Adicione no arquivo `.env.local`:

```env
# Token de escrita do Sanity (obrigatório para gerar códigos)
SANITY_API_WRITE_TOKEN=sua_chave_de_escrita_aqui

# Configurações do Sanity (já existentes)
NEXT_PUBLIC_SANITY_PROJECT_ID=wd4q9lte
NEXT_PUBLIC_SANITY_DATASET=production
```

## 📁 Estrutura dos Arquivos

- `gerar-codigos.js` - Script principal Node.js
- `gerar-codigos-simple.mjs` - Script ES modules
- `gerar-codigos-imoveis.js` - Script com cliente Sanity
- `app/admin/gerar-codigos/page.tsx` - Interface web
- `app/api/sanity/query/route.ts` - API para consultas
- `app/api/sanity/mutate/route.ts` - API para atualizações

## 📈 Exemplo de Saída

```
🚀 Iniciando geração de códigos para imóveis...

🔍 Buscando imóveis no Sanity...
📋 Encontrados 25 imóveis cadastrados

✅ Imóveis com código: 15
❌ Imóveis sem código: 10

📝 [1/10] Casa com quintal em Guararema
   📋 Tipo: Casa
   🎯 Finalidade: Venda
   🏷️  Código gerado: CAV24001
   ✅ Salvo com sucesso!

...

🎉 PROCESSO CONCLUÍDO!

📊 RESUMO:
   ✅ Sucessos: 10
   ❌ Erros: 0
   📋 Total processados: 10
   📈 Total de imóveis: 25
```

## 🆘 Solução de Problemas

### Erro de Token
```
❌ ERRO: Token do Sanity não configurado!
```
**Solução:** Configure a variável de ambiente `SANITY_API_WRITE_TOKEN`

### Erro de Permissão
```
❌ Erro ao salvar: Insufficient permissions
```
**Solução:** Verifique se o token tem permissão de **Editor** ou **Admin**

### Erro de Conexão
```
❌ Erro: getaddrinfo ENOTFOUND
```
**Solução:** Verifique sua conexão com a internet

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o token está correto
2. Confirme as permissões do token
3. Teste a conexão com a internet
4. Consulte os logs detalhados do script