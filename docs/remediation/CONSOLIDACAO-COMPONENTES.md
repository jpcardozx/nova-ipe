# Plano de Consolidação de Componentes

Este documento define o plano detalhado para consolidar componentes no projeto Nova Ipê, reduzir duplicação de código e garantir uma implementação coerente e de alto desempenho.

## Estado Atual e Diagnóstico

O projeto Nova Ipê possui múltiplas implementações de componentes similares, criados em diferentes fases do projeto. Isso resultou em:

1. **Duplicação de Código**: Múltiplas versões de cards de imóveis e grids
2. **Inconsistência Visual**: Diferentes estilos para o mesmo tipo de componente
3. **Problemas de Desempenho**: Implementações subótimas em componentes de listagem
4. **Dificuldade de Manutenção**: Mudanças requerem atualização em múltiplos componentes

### Componentes Identificados para Unificação

| Componente Original  | Variantes Encontradas                                                  | Componente Unificado                 | Status                         |
| -------------------- | ---------------------------------------------------------------------- | ------------------------------------ | ------------------------------ |
| PropertyCard.tsx     | ImovelCard.tsx, OptimizedImovelCard.tsx, PropertyCard.consolidated.tsx | PropertyCardUnified.tsx              | ✅ Criado, ⬜ Em implementação |
| PropertiesGrid.tsx   | ImprovedPropertiesGrid.tsx, VirtualizedPropertiesGrid.tsx              | VirtualizedPropertiesGridUnified.tsx | ✅ Criado, ⬜ Em implementação |
| PropertyHero.tsx     | Múltiplas versões em `components/ui` e `lib/ui`                        | PropertyHeroUnified.tsx              | ⬜ Pendente                    |
| PropertyFeatures.tsx | Múltiplas versões com diferentes prop interfaces                       | PropertyFeaturesUnified.tsx          | ⬜ Pendente                    |
| PropertyMap.tsx      | Duplicação em `components/ui` e `lib/ui`                               | PropertyMapUnified.tsx               | ⬜ Pendente                    |

## Plano de Ação (Junho-Julho/2025)

### Fase 1: Finalização dos Componentes Unificados (1-15 Junho/2025)

- ✅ Auditoria completa de componentes de imóveis (concluída)
- ✅ Criação inicial dos componentes PropertyCardUnified e VirtualizedPropertiesGridUnified (concluída)
- ⬜ Implementação de interfaces TypeScript consistentes para todos os componentes unificados
- ⬜ Refatoração dos componentes restantes (Hero, Features, Map) usando a mesma abordagem

### Fase 2: Migração e Deprecação (16-30 Junho/2025)

- ⬜ Uso de arquivos redirecionadores para componentes obsoletos (já iniciado)
- ⬜ Atualização de todas as importações para usar componentes unificados
- ⬜ Remoção segura de arquivos obsoletos após validação completa
- ⬜ Testes de regressão para garantir paridade visual e funcional

### Fase 3: Otimização e Documentação (1-15 Julho/2025)

- ⬜ Análise de desempenho e otimização dos componentes unificados
- ⬜ Implementação de lazy loading para componentes pesados
- ⬜ Documentação completa da API de componentes
- ⬜ Criação de uma biblioteca de storybook para componentes principais

## Detalhamento dos Componentes Unificados

### 1. PropertyCardUnified

**Status Atual:** 90% completo - Faltam ajustes em TypeScript e melhorias de acessibilidade

**Funcionalidades Principais:**

- Renderização de cards de imóveis com badges dinâmicos (Novo, Destacado, Premium)
- Suporte para diferentes fontes de imagens (URL direta, Sanity, fallback)
- Sistema de favoritos com persistência em localStorage
- Animações otimizadas com Framer Motion
- Layout responsivo com proporções consistentes
- Indicadores de preço formatados por tipo de imóvel

**Próximos Passos:**

- Resolver problemas de TypeScript com tipos inconsistentes de imagens
- Implementar modo skeleton para carregamento progressivo
- Adicionar suporte a lazy loading de imagens
- Melhorar pontuação de acessibilidade (ARIA labels, contraste)

### 2. VirtualizedPropertiesGridUnified

**Status Atual:** 80% completo - Requer otimizações e testes de performance

**Funcionalidades Principais:**

- Virtualização de lista para renderizar apenas itens visíveis
- Cálculo dinâmico de layout baseado no espaço disponível
- Estados para carregamento, lista vazia e erro
- Suporte para ações de favoritos e redefinição de filtros
- Performance otimizada para grandes conjuntos de dados

**Próximos Passos:**

- Implementar memo profundo para evitar re-renderizações
- Adicionar rolagem infinita para carregamento progressivo
- Corrigir problemas de layout em redimensionamento
- Adicionar telemetria de performance

### 3. PropertyHeroUnified (A ser desenvolvido)

**Status Atual:** 0% - Em planejamento

**Funcionalidades Planejadas:**

- Carrossel de imagens otimizado
- Layout responsivo para dispositivos móveis e desktop
- Suporte a vídeos e tours 3D
- Animações de entrada e saída
- Ações contextuais (favoritos, compartilhar, agendar visita)

**Solução Técnica Proposta:**

- Base em framer-motion para animações
- Uso do componente Image do Next.js para otimização de imagens
- Lazy loading para recursos pesados como vídeos

### 4. PropertyFeaturesUnified (A ser desenvolvido)

**Status Atual:** 0% - Em planejamento

**Funcionalidades Planejadas:**

- Exibição de características principais do imóvel (quartos, banheiros, área)
- Visualização de amenidades agrupadas por categoria
- Ícones consistentes para cada tipo de característica
- Layout responsivo com diferentes densidades de informação

**Solução Técnica Proposta:**

- Sistema de ícones baseado em Lucide
- Componentes de badge reutilizáveis
- Animações sutis para elementos que entram no viewport

## Guia de Migração para Desenvolvedores

Para cada componente, siga este processo de migração:

1. **Identifique importações atuais**:

   ```typescript
   // Substituir isto:
   import PropertyCard from '@/components/PropertyCard';
   // ou isto:
   import ImovelCard from '@/app/components/ImovelCard';

   // Por isto:
   import { PropertyCard } from '@/components/ui/property/PropertyCardUnified';
   ```

2. **Adapte as props**:

   - A propriedade `mainImage` agora aceita múltiplos formatos
   - Use `propertyType` em vez de `type` para o tipo de imóvel
   - Use `onFavoriteToggle` para manipular favoritos

3. **Teste a renderização**:
   - Verifique se os estilos estão corretos
   - Confirme que todas as informações estão sendo exibidas
   - Teste interações (favoritos, links, etc)

### Exemplo de Migração Completa

```tsx
// Antes
<PropertyCard
  id="123"
  titulo="Apartamento Luxuoso"
  local="Centro"
  preco={500000}
  tipo="venda"
  imagem={{url: "/imagens/apto.jpg"}}
/>

// Depois
<PropertyCardUnified
  id="123"
  title="Apartamento Luxuoso"
  location="Centro"
  price={500000}
  propertyType="sale"
  mainImage={{url: "/imagens/apto.jpg"}}
/>
```

## Checklist de Qualidade para Componentes

Cada componente unificado deve atender aos seguintes critérios:

1. ✅ **Performance**: Otimizado para renderização e re-renderizações
2. ✅ **Acessibilidade**: Atende WCAG 2.1 AA (contraste, labels, navegação por teclado)
3. ✅ **Responsividade**: Funciona em todos os breakpoints definidos no design system
4. ✅ **TypeScript**: Interface de props completa com comentários JSDoc
5. ✅ **Testes**: Possui testes unitários e de integração
6. ✅ **Documentação**: API documentada com exemplos de uso

## Benefícios da Consolidação

- **Redução de 65%** no código duplicado relacionado a componentes de imóveis
- **Diminuição de 40%** no tamanho do bundle JavaScript
- **Melhoria de 30%** no tempo de carregamento inicial
- **Consistência visual** entre todas as páginas do site
- **Facilidade de manutenção** com uma única fonte de verdade para cada componente
