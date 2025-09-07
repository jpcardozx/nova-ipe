# Configuração do Sanity CMS

## Informações do Projeto

- **Project ID**: `0nks58lj`
- **Dataset**: `production`
- **API Version**: `2023-05-03`
- **Studio URL**: https://nova-ipe-studio.sanity.studio/

## Estrutura de Arquivos

```
lib/sanity/
├── index.ts          # Configuração principal e cliente
├── queries.ts        # Queries GROQ organizadas
├── config.ts         # Configuração (legacy, pode ser removido)
└── client.ts         # Cliente (legacy, pode ser removido)

sanity/
├── lib/
│   ├── client.ts     # Cliente alternativo
│   ├── fetch.ts      # Funções de fetch
│   ├── queries.ts    # Queries alternativas
│   └── types.ts      # Tipos TypeScript
└── config.ts         # Configuração do Studio
```

## Configuração de Ambiente

### Variáveis Necessárias

```bash
# .env.development
SANITY_API_TOKEN=seu_token_aqui
```

### Variáveis Opcionais (já configuradas no código)

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Hardcoded como `0nks58lj`
- `NEXT_PUBLIC_SANITY_DATASET` - Hardcoded como `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` - Hardcoded como `2023-05-03`

## Como Usar

### Importação Principal

```typescript
import { sanityFetch, sanityClient } from '@/lib/sanity';
```

### Queries Pré-definidas

```typescript
import {
  getFeaturedProperties,
  getSaleProperties,
  getRentalProperties,
  getPropertyBySlug,
} from '@/lib/sanity/queries';

// Usar nas páginas/componentes
const properties = await getFeaturedProperties();
```

### Fetch Customizado

```typescript
import { sanityFetch } from '@/lib/sanity';

const data = await sanityFetch(
  '*[_type == "imovel"][0...10]',
  {},
  {
    revalidate: 3600, // 1 hora
    tags: ['properties'],
  }
);
```

## Schema do Imóvel

### Campos Principais

- `titulo` - Título do imóvel
- `slug` - URL amigável
- `preco` - Preço
- `finalidade` - "Venda" ou "Aluguel"
- `tipoImovel` - Tipo (casa, apartamento, etc.)
- `bairro` - Bairro
- `cidade` - Cidade
- `dormitorios` - Número de quartos
- `banheiros` - Número de banheiros
- `areaUtil` - Área em m²
- `vagas` - Vagas de garagem
- `destaque` - Boolean para destaque
- `status` - Status do imóvel
- `imagem` - Imagem principal
- `galeria` - Galeria de imagens

## Cache e Performance

### Estratégias de Cache

- **Imóveis em Destaque**: 30 minutos (1800s)
- **Listas de Imóveis**: 30 minutos (1800s)
- **Imóvel Individual**: 1 hora (3600s)

### Tags de Revalidação

- `properties` - Todos os imóveis
- `featured` - Imóveis em destaque
- `sale` - Imóveis à venda
- `rental` - Imóveis para aluguel
- `property-{slug}` - Imóvel específico

## Teste de Conexão

```typescript
import { testSanityConnection } from '@/lib/sanity';

const isConnected = await testSanityConnection();
console.log('Sanity conectado:', isConnected);
```

## Troubleshooting

### Erro: "Missing required environment variable"

- Verifique se o token está no `.env.development`
- Reinicie o servidor de desenvolvimento

### Erro: "Unauthorized"

- Verifique se o token tem as permissões corretas
- Confirme se o token não expirou

### Dados não aparecem

- Verifique se os documentos têm `status == "disponivel"`
- Confirme se o schema está correto no Sanity Studio

## Comandos Úteis

```bash
# Instalar dependências do Sanity
npm install next-sanity @sanity/vision

# Rodar o Studio localmente (se configurado)
npm run sanity:dev

# Build do projeto
npm run build
```

## Próximos Passos

1. ✅ Configuração básica funcionando
2. ✅ Queries organizadas
3. ✅ Cache otimizado
4. 🔄 Remover arquivos legacy (config.ts, client.ts antigos)
5. 🔄 Implementar tipos TypeScript mais robustos
6. 🔄 Adicionar validação de schema
