
# 🎯 Jetimob API - Endpoints Oficiais Corretos

**Fonte:** https://jetimob.docs.apiary.io

## 📍 Estrutura Base da API

```
Base URL: https://api.jetimob.com/webservice/{WEBSERVICE_KEY}
Método: GET apenas (API somente leitura)
Formato: JSON
Parâmetro obrigatório: v=v6 (versão da API)
```

## ✅ ENDPOINTS FUNCIONAIS CONFIRMADOS

### 1. **Listar Imóveis**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/imoveis?v=v6
```

### 2. **Buscar Imóvel Específico**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}?v=v6
```

### 3. **Listar Portais**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/portais?v=v5
```

### 4. **Listar Anúncios (Publicações)**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/anuncios?v=v5
```

### 5. **Listar Leads**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/leads?v=v5
```

### 6. **Buscar Lead Específico**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/lead/{ID}?v=v5
```

### 7. **Listar Fotos de Imóvel**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/fotos?v=v6
```

### 8. **Listar Corretores**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/corretores?v=v5
```

### 9. **Buscar Corretor Específico**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/corretor/{ID}?v=v5
```

### 10. **Estatísticas Gerais**
```
GET https://api.jetimob.com/webservice/{WEBSERVICE_KEY}/estatisticas?v=v5&periodo={hoje|semana|mes|ano}
```

## ❌ IMPORTANTE: API É SOMENTE LEITURA

A API da Jetimob **NÃO suporta**:
- ❌ POST - Criar registros
- ❌ PUT - Atualizar registros  
- ❌ DELETE - Deletar registros
- ❌ PATCH - Atualizar parcialmente

**Todas as operações de escrita devem ser feitas no painel web da Jetimob.**

## 🎯 10 FUNCIONALIDADES PRINCIPAIS PARA DASHBOARD

### TAB 1: 📊 OVERVIEW (Dashboard)
1. **Estatísticas Gerais** - `/estatisticas?v=v5&periodo=mes`
2. **Resumo de Imóveis** - Count de `/imoveis?v=v6`
3. **Resumo de Leads** - Count de `/leads?v=v5`
4. **Portais Ativos** - Status de `/portais?v=v5`

### TAB 2: 🏠 IMÓVEIS (Properties)
1. **Lista de Imóveis** - `/imoveis?v=v6`
2. **Detalhes do Imóvel** - `/imovel/{codigo}?v=v6`
3. **Galeria de Fotos** - `/imovel/{codigo}/fotos?v=v6`
4. **Filtros e Busca** - Implementação client-side

### TAB 3: 👥 LEADS (Contacts)
1. **Lista de Leads** - `/leads?v=v5`
2. **Detalhes do Lead** - `/lead/{id}?v=v5`
3. **Filtro por Status** - Implementação client-side
4. **Filtro por Portal** - Implementação client-side

### TAB 4: 🌐 PORTAIS (Portals)
1. **Status dos Portais** - `/portais?v=v5`
2. **Anúncios Publicados** - `/anuncios?v=v5`
3. **Performance por Portal** - Análise client-side
4. **Links para Anúncios** - Extração de URLs

### TAB 5: ⚙️ CONFIGURAÇÕES (Settings)
1. **Info da Conta** - Display de credenciais
2. **Corretores da Equipe** - `/corretores?v=v5`
3. **Sincronização Manual** - Refresh de dados
4. **Documentação e Ajuda** - Links úteis

## 📋 ESTRUTURA DE RESPOSTA DA API

### Imóveis
```json
{
  "imoveis": [
    {
      "Codigo": "123",
      "TipoImovel": "Apartamento",
      "Finalidade": "Venda",
      "Valor": "500000",
      "ValorCondominio": "600",
      "QuartoQtd": "3",
      "BanheiroQtd": "2",
      "VagaQtd": "2",
      "AreaTotal": "120",
      "Endereco": "Rua Exemplo, 100",
      "Bairro": "Centro",
      "Cidade": "São Paulo",
      "Estado": "SP",
      "CEP": "01000-000",
      "Descricao": "Apartamento com...",
      "Status": "Disponível"
    }
  ]
}
```

### Portais
```json
{
  "portais": [
    {
      "Id": "1",
      "Nome": "Viva Real",
      "Status": "Ativo",
      "Url": "https://vivareal.com.br"
    }
  ]
}
```

### Leads
```json
{
  "leads": [
    {
      "Id": "123",
      "Nome": "João Silva",
      "Email": "joao@email.com",
      "Telefone": "11999999999",
      "ImovelCodigo": "456",
      "Portal": "Viva Real",
      "Mensagem": "Tenho interesse...",
      "Data": "2025-10-11 10:30:00",
      "Status": "Novo"
    }
  ]
}
```

## 🔧 CORREÇÕES NECESSÁRIAS

1. **Remover métodos POST/PUT/DELETE** - API é somente leitura
2. **Corrigir estrutura de endpoints** - Usar `webservice/{KEY}/{endpoint}`
3. **Usar nomes de campos corretos** - API usa PascalCase (Codigo, TipoImovel, etc)
4. **Implementar proxy correto** - Passar webservice key corretamente
5. **Adicionar tratamento para respostas** - Normalizar campos da API
6. **Implementar filtros client-side** - Sem suporte server-side
7. **Cache agressivo** - API pública sem rate limit conhecido
8. **Normalizar dados** - Converter PascalCase para camelCase
9. **Validação de dados** - Tratar campos nulos/undefined
10. **Error handling** - Mensagens específicas por tipo de erro

## 🎨 UI/UX S-TIER REQUIREMENTS

### Design System
- ✅ shadcn/ui components
- ✅ Design tokens CSS variables
- ✅ Dark mode completo
- ✅ WCAG AAA contrast (7:1)
- ✅ Framer Motion animations
- ✅ Responsive (mobile-first)

### Components Necessários
1. **StatCard** - Cards de estatísticas com ícones
2. **PropertyCard** - Card de imóvel com imagem, dados e ações
3. **PropertyTable** - Tabela completa com sort/filter
4. **LeadCard** - Card de lead com status badge
5. **PortalStatusCard** - Card de portal com indicador de status
6. **AnuncioCard** - Card de anúncio com link externo
7. **CorretorCard** - Card de corretor com foto e contato
8. **SearchBar** - Barra de busca com filtros avançados
9. **FilterPanel** - Painel lateral de filtros
10. **DetailModal** - Modal de detalhes com tabs

### Animations
- Fade in/out
- Slide transitions entre tabs
- Hover effects
- Loading skeletons
- Success/error feedback
- Micro-interactions

### Layout
- Container max-w-7xl
- Grid responsivo (1/2/3/4 cols)
- Sticky header com tabs
- Fixed action buttons
- Scroll virtualization para listas grandes
