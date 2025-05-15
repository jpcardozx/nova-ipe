# Guia de Referência: Otimização de Imagens Sanity no Next.js

## Problema Resolvido

Este projeto implementa uma solução completa para o problema de perda de referências de imagens Sanity durante a serialização entre servidor e cliente no Next.js. A solução garante que as imagens são exibidas corretamente em todos os ambientes, com tratamento adequado de erros e estados de carregamento.

## Componentes da Solução

### 1. Utilitários Centrais

#### `image-fix.ts`
- `fixSanityImageReferences`: Corrige referências de imagens garantindo serialização adequada
- `hydrateImageAssets`: Obtém URLs atualizadas do Sanity para imagens com referências

#### `image-monitor.ts`
- `isValidImageObject`: Verifica se um objeto de imagem está completo e utilizável
- `ensureValidImage`: Aplica correções e valida objetos de imagem
- `trackImageUsage`: Sistema de monitoramento de uso e erros de imagens

### 2. Componentes de Imagem Aprimorados

#### `SanityImage.tsx`
Componente padrão para a maioria dos casos de uso, com recursos de:
- Aplicação automática de correções via `ensureValidImage`
- Monitoramento de erros e sucessos
- Exibição de fallbacks elegantes
- Animações e efeitos visuais para melhor UX

#### `EnhancedImage.tsx`
Componente especializado para casos complexos, com:
- Extração robusta de URLs de várias fontes
- Reconstrução de URLs a partir de referências
- Sistema avançado de fallback e visualização de espaços reservados

### 3. Diagnóstico e Depuração

#### Página `/debug-images`
Oferece ferramentas para:
- Visualizar a estrutura de objetos de imagem
- Testar diferentes métodos de renderização
- Simular a serialização servidor-cliente
- Monitorar logs detalhados de processamento

### 4. Integração Automática

A solução é integrada automaticamente em:
- `getImoveisDestaque`: Busca de imóveis em destaque
- `getImoveisAluguel`: Busca de imóveis para aluguel
- Outros métodos de API que retornam imagens

## Como Usar

### Para Desenvolvedores

#### Uso Básico
```jsx
import SanityImage from '@/app/components/SanityImage';

// Em um componente React:
<SanityImage
  image={imovel.imagem}
  alt="Descrição da imagem" 
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Para Casos Complexos
```jsx
import EnhancedImage from '@/app/components/EnhancedImage';
import { fixSanityImageReferences } from '@/lib/image-fix';

// Correção manual (normalmente não é necessária)
const imageFixed = fixSanityImageReferences(imovel.imagem);

// Uso do componente
<EnhancedImage
  image={imageFixed}
  alt="Descrição da imagem"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Para Manutenção e Debug

#### Monitoramento
- A página `/debug-images` contém ferramentas para diagnóstico de problemas
- Os logs detalhados estão disponíveis no console do navegador em ambiente de desenvolvimento
- O sistema `trackImageUsage` registra estatísticas de uso e erros

#### Personalização
- Ajuste os fallbacks em `SanityImage` e `EnhancedImage` conforme necessário
- Configure regras de monitoramento adicionais em `image-monitor.ts`

## Considerações Técnicas

### Performance
- As funções de correção usam cache para evitar reprocessamento
- O componente `EnhancedImage` usa importação dinâmica para módulos pesados
- A estratégia de fallbacks em cascata evita chamadas desnecessárias ao Sanity

### SEO e Acessibilidade
- Os componentes garantem que imagens sempre tenham atributo `alt`
- Estados de carregamento são visualmente indicados
- O componente prioriza imagens importantes com `priority`

### Manutenção
- O código é extensamente documentado para facilitar manutenção futura
- Utilitários centrais são isolados para manter a arquitetura limpa
- Testes e ferramentas de diagnóstico facilitam a identificação de problemas

## Próximos Passos Recomendados

1. **Monitoramento em produção**: Implementar sistema de rastreamento para erros de imagens
2. **Pré-carregamento**: Implementar estratégia de preload para imagens importantes
3. **Otimização automatizada**: Integrar com bibliotecas de otimização de imagens
4. **Testes automatizados**: Desenvolver testes para garantir que a solução continue funcionando

---

## Apêndice: Fluxograma da Solução

```
[API Sanity] → [Servidor Next.js] → [Cliente]
                      ↓
    [fixSanityImageReferences] → [Serialização]
                      ↓
    [Componente React] → [ensureValidImage]
                      ↓
      [Renderização] → [Monitoramento]
```

## Colaboradores
Equipe de desenvolvimento IPE, com suporte e orientação do GitHub Copilot.
