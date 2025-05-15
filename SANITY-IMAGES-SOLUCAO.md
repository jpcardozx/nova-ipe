# Solução Completa para Problemas de Renderização de Imagens Sanity no Next.js

## Problema

Ao utilizar imagens do Sanity CMS em um projeto Next.js, enfrentamos um problema onde as imagens não eram renderizadas corretamente no cliente. A estrutura de dados retornada pelo Sanity estava correta no servidor, mas algo estava acontecendo durante a serialização para o cliente:

1. No lado do servidor, o objeto de imagem continha todas as propriedades necessárias, incluindo `asset._ref`
2. No cliente, o objeto de imagem chegava apenas com a propriedade `alt`, perdendo as referências ao asset e URLs

## Causa Raiz

A causa raiz do problema estava na serialização JSON que ocorre entre o servidor e o cliente no Next.js. Objetos complexos ou com ciclos não são serializados corretamente, e o formato específico das imagens do Sanity não estava sendo transferido adequadamente.

## Solução Implementada

Nossa solução completa consiste em quatro partes principais:

### 1. Correção de Referências de Imagem

Criamos a função `fixSanityImageReferences` que processa recursivamente objetos e corrige as estruturas de imagem para garantir que sejam serializáveis:

```typescript
export function fixSanityImageReferences(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Identifica objetos de imagem
  const isImageObject = 
    obj._type === 'image' || 
    obj.asset || 
    (obj.alt && (obj.url || obj.imagemUrl));
    
  if (isImageObject) {
    // Cria uma estrutura limpa e completa
    const fixedImage = {
      _type: obj._type || 'image',
      alt: obj.alt || '',
      url: obj.url || obj.imagemUrl || '',
      asset: obj.asset ? {
        _type: obj.asset._type || 'sanity.imageAsset',
        _ref: obj.asset._ref || ''
      } : undefined
    };
    
    // Preserva hotspot se existir
    if (obj.hotspot) {
      fixedImage.hotspot = { ...obj.hotspot };
    }
    
    // Processa URL a partir da referência se necessário
    if (!fixedImage.url && fixedImage.asset?._ref) {
      fixedImage.url = extractImageUrl({
        asset: { _ref: fixedImage.asset._ref }
      });
    }
    
    return fixedImage;
  }
  
  // Processa recursivamente arrays
  if (Array.isArray(obj)) {
    return obj.map(item => fixSanityImageReferences(item));
  }
  
  // Processa recursivamente outros objetos
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    result[key] = fixSanityImageReferences(result[key]);
  }
  
  return result;
}
```

### 2. Sistema de Monitoramento de Imagens

Implementamos um sistema completo de monitoramento e validação de imagens em `image-monitor.ts`:

```typescript
export function isValidImageObject(image: any): boolean {
  if (!image || typeof image !== 'object') return false;
  
  // Verifica se é uma imagem válida
  return Boolean(
    // Caso 1: Tem URL direta
    image.url || image.imagemUrl ||
    // Caso 2: Tem asset com URL
    image.asset?.url ||
    // Caso 3: Tem asset com referência
    image.asset?._ref
  );
}

export function ensureValidImage(image: any): any {
  if (!image) return null;
  
  // Se a imagem já é válida, retorna sem modificações
  if (isValidImageObject(image)) return image;
  
  // Tenta corrigir a imagem
  return fixSanityImageReferences(image);
}

export function trackImageUsage(component: string, image: any, status: 'loading' | 'success' | 'error'): void {
  // Sistema de monitoramento de uso de imagens
}
```

### 3. Componentes de Imagem Aprimorados

Criamos dois componentes principais para renderização de imagens:

#### SanityImage: Componente principal otimizado

```tsx
export default function SanityImage({
  image,
  alt = '',
  // outras props
}) {
  const [processedImage, setProcessedImage] = useState<ClientImage | null | undefined>(image);

  // Pré-processamento para validação e correção
  useEffect(() => {
    import('@/lib/image-monitor').then(({ ensureValidImage, trackImageUsage }) => {
      const validImage = ensureValidImage(image);
      setProcessedImage(validImage);
      trackImageUsage('SanityImage', validImage, 'loading');
    });
  }, [image]);
  
  // Múltiplos fallbacks para extração de URL
  const imageUrl = processedImage?.url || 
                  processedImage?.imagemUrl || 
                  processedImage?.asset?.url || 
                  (processedImage?.asset?._ref ? getImageUrl(processedImage) : '');
                  
  // Renderização com tratamento de erros e estados
  // ...
}
```

#### EnhancedImage: Componente com recursos avançados

```tsx
export default function EnhancedImage({
  image,
  alt = '',
  // outras props
}) {
  // Processamento avançado com diagnóstico
  useEffect(() => {
    import('@/lib/image-monitor').then(({ ensureValidImage, trackImageUsage }) => {
      const validImage = ensureValidImage(image);
      // Extração robusta de URL da imagem
      // ...
    });
  }, [image, fallbackUrl]);
  
  // Tratamento sofisticado de erros e fallbacks
  // ...
}
```

### 4. Integração Automática em APIs

Modificamos todas as funções de busca de dados para aplicar automaticamente a correção:

```typescript
export async function getImoveisDestaque(): Promise<any[]> {
  try {
    const { fixSanityImageReferences } = await import('./image-fix');
    const data = await sanityClient.fetch(queryImoveisDestaque);
    
    // Corrigir referências de imagens para todos os imóveis
    if (Array.isArray(data)) {
      return data.map(imovel => {
        if (imovel && imovel.imagem) {
          return {
            ...imovel,
            imagem: fixSanityImageReferences(imovel.imagem)
          };
        }
        return imovel;
      });
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return [];
  }
}
```

## Ferramentas de Diagnóstico

Desenvolvemos um conjunto completo de ferramentas para diagnóstico:

### 1. ImageAnalyzer

Componente que permite analisar profundamente uma imagem, validá-la e visualizar as versões original e corrigida.

### 2. Página de Comparação de Imagens

Implementamos `/app/image-compare/page.tsx` que permite:
- Comparar o mesmo objeto de imagem em diferentes componentes
- Ver o efeito da correção em tempo real
- Analisar a estrutura de dados antes e depois da correção

### 3. Testes de Estresse

Implementamos `image-stress-test.ts` que:
- Gera casos patológicos para testar a robustez da solução
- Executa testes automatizados nos diferentes componentes
- Produz relatórios de desempenho do sistema

## Benefícios

1. **Robustez**: Imagens são renderizadas corretamente em todos os ambientes e situações
2. **Transparência**: A integração automática não exige mudanças no código existente
3. **Diagnóstico**: Sistema completo de monitoramento e diagnóstico
4. **Performance**: O cache de URL evita processamento repetido das mesmas imagens
5. **Resistência a erros**: Múltiplas camadas de fallback garantem que algo sempre seja exibido

## Considerações Futuras

1. **Monitoramento em produção**: Implementar sistema de rastreamento para erros de imagens
2. **Pré-carregamento**: Implementar estratégia de preload para imagens importantes
3. **Otimização automatizada**: Integrar com bibliotecas de otimização de imagens
4. **Testes automatizados**: Desenvolver suite de testes para garantir que a solução continue funcionando

---

## Páginas de Demonstração

1. `/debug-images` - Ferramentas de diagnóstico iniciais
2. `/fixed-images` - Demonstração da solução implementada
3. `/image-compare` - Comparador avançado de técnicas de correção

Estas páginas estão disponíveis no ambiente de desenvolvimento e podem ser usadas para diagnóstico e treinamento.
