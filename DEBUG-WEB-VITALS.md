# Debug de Web Vitals - Detecção de Problemas

Este arquivo contém código que pode ser usado para detectar problemas específicos com Web Vitals em seu site. Você pode adicionar esses snippets temporariamente para debugar problemas de performance.

## Detector de LCP (Largest Contentful Paint)

Adicione este código em um componente client-side para visualizar qual elemento está sendo considerado como LCP:

```tsx
'use client';

import { useEffect } from 'react';

export function LCPDetector() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP Element:', entry.element);
          console.log('LCP Details:', {
            size: entry.size,
            startTime: entry.startTime,
            renderTime: entry.renderTime,
            loadTime: entry.loadTime,
            url: entry.url // Se for uma imagem
          });
          
          // Destacar visualmente
          if (entry.element) {
            entry.element.style.outline = '5px solid red';
            entry.element.setAttribute('data-lcp', 'true');
          }
        }
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
```

## Detector de CLS (Cumulative Layout Shift)

Adicione este código para visualizar e registrar mudanças de layout:

```tsx
'use client';

import { useEffect } from 'react';

export function CLSDetector() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
    
    let cumulativeScore = 0;
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const currentShift = entry.value;
          cumulativeScore += currentShift;
          
          console.log('Layout Shift:', {
            value: currentShift,
            cumulativeScore,
            sources: entry.sources || [] // Elementos que causaram o shift
          });
          
          // Destaque visual para os elementos que causaram o shift
          if (entry.sources) {
            entry.sources.forEach(source => {
              if (source.node) {
                source.node.style.outline = '3px dashed orange';
                source.node.setAttribute('data-cls-source', 'true');
              }
            });
          }
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
```

## Detector de INP (Interaction to Next Paint)

Adicione este código para monitorar e destacar interações lentas:

```tsx
'use client';

import { useEffect } from 'react';

export function INPDetector() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;
    
    let maxDelay = 0;
    let slowestElement = null;
    
    // Highlight elemento durante interação lenta
    function highlightElement(element, delay) {
      if (!element) return;
      
      const originalBackground = element.style.backgroundColor;
      const originalTransition = element.style.transition;
      
      // Cor varia de amarelo (200ms) para vermelho (1000ms+)
      const severity = Math.min(1, (delay - 200) / 800);
      const color = `rgba(255, ${255 - (severity * 255)}, 0, 0.3)`;
      
      element.style.backgroundColor = color;
      element.style.transition = 'background-color 0s';
      
      setTimeout(() => {
        element.style.backgroundColor = originalBackground;
        element.style.transition = originalTransition;
      }, 2000);
    }
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Para interactionId específico, só processar o 'renderTime'
        if (entry.name === 'event-timing') {
          const delay = entry.duration;
          
          if (delay > 200) { // Destacar apenas interações lentas (> 200ms)
            console.log('Interação lenta detectada:', {
              type: entry.name,
              target: entry.target?.tagName || 'unknown',
              duration: delay.toFixed(2) + 'ms',
              interactionId: entry.interactionId
            });
            
            if (delay > maxDelay) {
              maxDelay = delay;
              slowestElement = entry.target;
              
              // Highlight temporário no elemento mais lento
              highlightElement(entry.target, delay);
            }
          }
        }
      }
    });
    
    observer.observe({ type: 'event', buffered: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
```

## Como usar esses detectores

1. Copie e cole o código deste arquivo em um novo arquivo em `app/components/DebugVitals.tsx`

2. Importe e use no seu layout de desenvolvimento ou em páginas específicas:

```tsx
// Apenas em desenvolvimento
{process.env.NODE_ENV === 'development' && (
  <>
    <LCPDetector />
    <CLSDetector />
    <INPDetector />
  </>
)}
```

3. Navegue pelo seu site e observe o console do navegador para obter insights

4. Remova os detectores antes de implantar em produção

## Interpretando os resultados

- **LCP**: Se o elemento destacado em vermelho não for o que você espera, considere otimizar esse elemento ou ajustar seu design.
  
- **CLS**: Elementos com contorno laranja estão causando layout shifts. Verificar se dimensões estão pré-definidas.
  
- **INP**: Elementos com fundo amarelo-vermelho têm interações lentas. Quanto mais vermelho, mais lenta é a interação.

## Notas:

- Use estas ferramentas apenas em desenvolvimento, nunca em produção
- Os valores exatos podem variar entre execuções e dispositivos
- Combine estas ferramentas com Lighthouse e DevTools para análise completa
