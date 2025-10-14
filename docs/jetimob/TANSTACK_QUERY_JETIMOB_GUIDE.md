# TanStack Query + Jetimob - Guia Completo

## 📦 O Que Foi Implementado

### 1. **TanStack Query v5** - Sistema Central de Cache
- ✅ Provider global configurado com logging integrado
- ✅ Cache otimizado (5min stale, 10min GC)
- ✅ Retry inteligente (não retry em 401/403/404)
- ✅ DevTools integrado (apenas dev)

### 2. **Jetimob React Query Hooks**
- ✅ Hooks modernos com TypeScript completo
- ✅ Query keys centralizados
- ✅ Invalidação automática de cache
- ✅ Logging estruturado integrado

### 3. **Sistema de Logging Aprimorado**
- ✅ Logger existente integrado com React Query
- ✅ Logs contextualizados e estruturados
- ✅ Performance tracking automático

### 4. **Correção de Credenciais**
- ✅ Suporte a JETIMOB_* e NEXT_PUBLIC_JETIMOB_*
- ✅ Validação automática de configuração
- ✅ Logs de debug para troubleshooting

---

## 🚀 Como Usar

### Exemplo Básico - Lista de Imóveis

```tsx
'use client'

import { useJetimobProperties } from '@/lib/jetimob/use-jetimob-query'

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = useJetimobProperties()

  if (isLoading) return <div>Carregando imóveis...</div>
  if (error) return <div>Erro: {error.message}</div>

  return (
    <div>
      <h1>Imóveis ({properties?.length || 0})</h1>
      {properties?.map(property => (
        <div key={property.id}>
          <h2>{property.title}</h2>
          <p>R$ {property.price.toLocaleString('pt-BR')}</p>
        </div>
      ))}
    </div>
  )
}
```

### Exemplo - Detalhes de Imóvel

```tsx
'use client'

import { useJetimobProperty } from '@/lib/jetimob/use-jetimob-query'

export default function PropertyDetails({ id }: { id: string }) {
  const { data: property, isLoading } = useJetimobProperty(id)

  if (isLoading) return <Skeleton />
  if (!property) return <NotFound />

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>R$ {property.price.toLocaleString('pt-BR')}</p>
    </div>
  )
}
```

### Exemplo - Criar Imóvel (Mutation)

```tsx
'use client'

import { useCreateJetimobProperty } from '@/lib/jetimob/use-jetimob-query'
import { toast } from 'react-hot-toast'

export default function CreatePropertyForm() {
  const createProperty = useCreateJetimobProperty()

  const handleSubmit = async (formData: any) => {
    try {
      await createProperty.mutateAsync(formData)
      toast.success('Imóvel criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar imóvel')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createProperty.isPending}>
        {createProperty.isPending ? 'Criando...' : 'Criar Imóvel'}
      </button>
    </form>
  )
}
```

### Exemplo - Atualizar Lead Status

```tsx
'use client'

import { useUpdateLeadStatus } from '@/lib/jetimob/use-jetimob-query'

export default function LeadStatusButton({ leadId }: { leadId: string }) {
  const updateStatus = useUpdateLeadStatus()

  const handleUpdate = () => {
    updateStatus.mutate({
      leadId,
      status: 'contacted'
    })
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={updateStatus.isPending}
    >
      Marcar como Contatado
    </button>
  )
}
```

### Exemplo - Leads com Filtros

```tsx
'use client'

import { useJetimobLeads } from '@/lib/jetimob/use-jetimob-query'
import { useState } from 'react'

export default function LeadsPage() {
  const [status, setStatus] = useState<string>()

  const { data: leads } = useJetimobLeads({
    status,
    date_from: '2025-01-01'
  })

  return (
    <div>
      <select onChange={(e) => setStatus(e.target.value)}>
        <option>Todos</option>
        <option value="new">Novos</option>
        <option value="contacted">Contatados</option>
      </select>

      {leads?.map(lead => (
        <div key={lead.id}>
          <h3>{lead.name}</h3>
          <p>{lead.email}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione no `.env.local`:

```bash
# Jetimob API Keys
JETIMOB_WEBSERVICE_KEY=sua_chave_aqui
JETIMOB_PUBLIC_KEY=sua_public_key_aqui
JETIMOB_PRIVATE_KEY=sua_private_key_aqui
JETIMOB_BASE_URL=https://api.jetimob.com/v2
```

### 2. Verificar Configuração

O sistema agora loga automaticamente no console (dev):

```
🔧 Jetimob Config: {
  hasWebserviceKey: true,
  hasPublicKey: true,
  hasPrivateKey: true,
  baseUrl: 'https://api.jetimob.com/v2',
  configured: true
}
```

Se aparecer `configured: false`, verifique suas variáveis de ambiente.

---

## 📚 Hooks Disponíveis

### Queries (GET)

| Hook | Descrição | Params | Cache |
|------|-----------|--------|-------|
| `useJetimobProperties()` | Lista todos os imóveis | - | 2 min |
| `useJetimobProperty(id)` | Busca imóvel específico | `id: string` | 5 min |
| `useJetimobLeads(filters?)` | Lista leads | `filters?: {...}` | 1 min |
| `useJetimobPortals()` | Lista portais | - | 10 min |
| `useJetimobPerformance(from, to)` | Relatório de performance | `from, to: string` | 30 min |

### Mutations (POST/PUT/DELETE)

| Hook | Descrição | Invalidação Automática |
|------|-----------|------------------------|
| `useCreateJetimobProperty()` | Criar imóvel | ✅ Lista de imóveis |
| `useUpdateJetimobProperty()` | Atualizar imóvel | ✅ Lista + Imóvel específico |
| `useDeleteJetimobProperty()` | Deletar imóvel | ✅ Lista de imóveis |
| `useUpdateLeadStatus()` | Atualizar status de lead | ✅ Lista de leads |
| `useSyncPropertyToPortals()` | Sincronizar com portais | ✅ Imóvel específico |

---

## 🎯 Vantagens da Nova Arquitetura

### ✅ **Performance**
- Cache automático (não refetch dados frescos)
- Deduplicação de requests (múltiplos componentes = 1 request)
- Background refetch inteligente

### ✅ **Developer Experience**
- TypeScript completo
- DevTools integrado (inspecionar cache visualmente)
- Loading/error states automáticos

### ✅ **Manutenibilidade**
- Código centralizado
- Query keys consistentes
- Fácil invalidação de cache

### ✅ **Observabilidade**
- Logs estruturados
- Tracking de performance
- Debug facilitado

---

## 🐛 Troubleshooting

### Erro: "Jetimob não configurado"

**Causa:** Variáveis de ambiente não encontradas

**Solução:**
1. Verifique se `.env.local` existe na raiz
2. Confira se as variáveis `JETIMOB_*` estão definidas
3. Reinicie o servidor (`pnpm dev`)

### Erro 401: "Unauthorized"

**Causa:** Credenciais inválidas

**Solução:**
1. Verifique se as chaves no `.env.local` estão corretas
2. Teste as credenciais diretamente na API do Jetimob
3. Verifique logs no console para ver qual chave está sendo usada

### Cache não invalida após mutation

**Causa:** Query keys não estão alinhados

**Solução:**
- Use sempre os hooks fornecidos (eles gerenciam invalidação)
- Se precisar invalidar manualmente:

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { jetimobKeys } from '@/lib/jetimob/use-jetimob-query'

const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: jetimobKeys.properties() })
```

---

## 🔮 Próximos Passos

1. **Migrar hooks antigos** (`useNotifications`, `useCalendar`) para React Query
2. **Adicionar Optimistic Updates** para melhor UX
3. **Implementar Prefetching** para navegação mais rápida
4. **Setup Persister** para cache offline
5. **Adicionar Error Boundaries** customizados

---

## 📖 Referências

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Jetimob API Docs](https://jetimob.docs.apiary.io/)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

**✨ Sistema implementado e pronto para uso!**

Qualquer dúvida, consulte os logs no console ou abra o React Query DevTools (canto inferior direito em dev).
