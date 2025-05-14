# Checklist de Imagens para Otimização de LCP

Este arquivo contém uma lista de verificação para garantir que suas imagens estejam otimizadas para melhorar o Largest Contentful Paint (LCP).

## Imagens Críticas (Acima da Dobra)

Para todas as imagens importantes que aparecem inicialmente na tela sem rolagem:

- [ ] Adicionar o atributo `priority={true}` nas imagens do Next.js/SanityImage
- [ ] Definir `sizes` apropriado para carregamento responsivo
- [ ] Fornecer dimensões explícitas (width/height) ou aspect-ratio

## Formatos de Imagem

- [ ] Usar WebP ou AVIF quando possível
- [ ] Incluir fallbacks para navegadores mais antigos
- [ ] Verificar se as imagens estão sendo servidas no tamanho correto (evite redimensionamento no navegador)

## Componentes a Verificar

Estas são áreas que normalmente contêm imagens críticas para o LCP:

1. **Hero Section / Banner Principal**
   ```tsx
   <SanityImage
     image={heroData.imagem}
     alt={heroData.alt || "Banner principal"}
     priority={true}
     sizes="100vw"
     className="hero-image"
   />
   ```

2. **Cards de Imóveis em Destaque**
   ```tsx
   <SanityImage
     image={imovel.imagem}
     alt={imovel.titulo}
     width={400}
     height={300}
     priority={index < 2} // Priorize apenas os primeiros cards
     className="card-image"
   />
   ```

3. **Logo e Elementos de Marca**
   ```tsx
   <Image
     src="/logo.png"
     alt="Ipê Imobiliária"
     width={150}
     height={50}
     priority={true}
   />
   ```

## Outros Tipos de LCP

Além de imagens, o LCP pode ser:

- [ ] Blocos de texto grandes
- [ ] Background images em CSS importantes (considere preload)
- [ ] Elementos de vídeo (poster)

## Ferramenta de Identificação de LCP

Você pode identificar qual elemento está sendo considerado como LCP usando:

1. Chrome DevTools > Performance > Diagnóstico > Largest Contentful Paint
2. Lighthouse > Performance > Largest Contentful Paint
3. PageSpeed Insights > Lab Data > Largest Contentful Paint

## Código para Debugar LCP

Adicione este snippet em ambiente de desenvolvimento para visualizar o elemento LCP:

```tsx
// Adicionar em um componente client-side apenas para desenvolvimento
useEffect(() => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP Element:', entry.element);
        console.log('LCP Time:', entry.startTime);
        
        // Opcional: Destaque visualmente o elemento LCP
        if (entry.element) {
          entry.element.style.outline = '5px solid red';
        }
      }
    }
  });
  
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  
  return () => {
    observer.disconnect();
  };
}, []);
```

## Dicas adicionais específicas para Next.js e Sanity

- Use o parâmetro `auto=format` nas URLs de imagem do Sanity para servir WebP automaticamente
- Configure o tamanho das imagens no servidor Sanity para evitar downsizing no cliente
- Considere adicionar o parâmetro de qualidade para controlar o tamanho do arquivo:
  ```tsx
  <SanityImage quality={85} ... />
  ```
