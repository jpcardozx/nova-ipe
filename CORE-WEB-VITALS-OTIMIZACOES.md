# Otimizações de Core Web Vitals

Este documento contém diretrizes e melhorias específicas para otimizar as métricas de Core Web Vitals do projeto Nova Ipê.

## Largest Contentful Paint (LCP)

O LCP mede quanto tempo leva para o maior elemento visível na viewport ser renderizado. Considera-se um bom LCP quando é menor que **2,5 segundos**.

### Melhorias para o LCP:

1. **Priorize imagens críticas**
   - Adicione o atributo `priority` às imagens na parte superior da página:
   ```tsx
   <SanityImage 
     image={heroImage} 
     priority={true} 
     sizes="(max-width: 768px) 100vw, 50vw" 
     alt="Hero Image"
   />
   ```

2. **Pré-carregue recursos críticos**
   - Adicione no `app/metadata.tsx` ou diretamente no `<head>` do seu layout:
   ```tsx
   export const metadata = {
     // ...existing metadata
   }
   
   // Add this to a custom Head component or in layout.tsx
   export function generateMetadata() {
     return {
       // ...existing metadata,
       other: {
         'link': [
           {
             rel: 'preload',
             href: '/fonts/your-critical-font.woff2',
             as: 'font',
             type: 'font/woff2',
             crossOrigin: 'anonymous',
           },
           {
             rel: 'preload',
             href: '/critical-hero-image.webp',
             as: 'image',
           }
         ]
       }
     }
   }
   ```

3. **Otimize o servidor e CDN**
   - Configure corretamente os cabeçalhos de cache para recursos estáticos
   - Utilize o Vercel Edge Network (já configurado na implantação Vercel)
   - Verifique se as imagens estão sendo servidas do formato mais eficiente (WebP/AVIF)

4. **Reduza JavaScript de bloqueio**
   - Use `loading="lazy"` para imagens abaixo da dobra
   - Aplique `use client` apenas quando necessário
   - Prefira componentes Server Components onde possível

## Cumulative Layout Shift (CLS)

O CLS mede a estabilidade visual ao calcular quanto os elementos visíveis se movem na página. Um bom CLS é **inferior a 0,1**.

### Melhorias para o CLS:

1. **Reserve espaço para elementos dinâmicos**
   ```tsx
   // Em vez de:
   <div>
     {loading ? <Spinner /> : <ImovelCard imovel={imovel} />}
   </div>
   
   // Use:
   <div style={{ minHeight: '300px' }}>
     {loading ? <Spinner /> : <ImovelCard imovel={imovel} />}
   </div>
   ```

2. **Defina dimensões explícitas para imagens**
   ```tsx
   // Use sempre width e height ou aspect-ratio
   <SanityImage
     image={imovel.imagem}
     width={400}
     height={300}
     alt={imovel.titulo}
   />
   
   // Ou com CSS:
   <div className="aspect-w-16 aspect-h-9">
     <SanityImage 
       image={imovel.imagem} 
       fill={true}
       alt={imovel.titulo}
     />
   </div>
   ```

3. **Evite inserção dinâmica de conteúdo**
   - Evite adicionar conteúdo acima do conteúdo existente após o carregamento da página
   - Use `position: sticky` para banners ou notificações, em vez de empurrar o conteúdo

4. **Use skeletons para conteúdo carregado dinamicamente**
   ```tsx
   // Componente SkeletonLoader já existente na aplicação pode ser usado
   {isLoading ? (
     <SkeletonLoader count={3} type="card" />
   ) : (
     <ImovelList imoveis={imoveis} />
   )}
   ```

## Interaction to Next Paint (INP)

O INP mede o tempo de resposta da página a interações do usuário. Um bom INP é **inferior a 200ms**.

### Melhorias para o INP:

1. **Otimize event handlers**
   - Use técnicas como debounce para funções de pesquisa:
   ```tsx
   // Já existente na lib/utils.ts, certifique-se de usá-lo
   import { debounce } from '@/lib/utils';
   
   const handleSearch = debounce((term) => {
     searchImoveis(term);
   }, 300);
   ```

2. **Reduza operações DOM intensivas**
   - Prefira usar `transform` em vez de propriedades que causam reflow:
   ```css
   /* Em vez disso (causa reflow): */
   .card:hover {
     width: 105%;
     height: 105%;
   }
   
   /* Use isso (apenas repaint): */
   .card:hover {
     transform: scale(1.05);
   }
   ```

3. **Divida tarefas longas**
   ```tsx
   // Em vez de processar tudo de uma vez:
   function processAllData() {
     const results = heavyDataProcessing(allData);
     updateUI(results);
   }
   
   // Divida em pedaços menores:
   function processDataInChunks() {
     const chunks = splitIntoChunks(allData, 100);
     
     chunks.forEach((chunk, index) => {
       setTimeout(() => {
         const results = heavyDataProcessing(chunk);
         updateUIPartially(results, index);
       }, index * 16); // ~16ms por frame para manter 60fps
     });
   }
   ```

4. **Otimize componentes que reagem a interações frequentes**
   - Use `React.memo` e `useCallback` para componentes que renderizam frequentemente
   - Prefira `CSS transitions` a animações JavaScript onde possível
   - Considere usar a API `requestAnimationFrame` para animações suaves

## Como medir as melhorias

Além do monitoramento atual com `@vercel/speed-insights` e `web-vitals`, você pode:

1. Use o Lighthouse no Chrome DevTools
2. Verifique o PageSpeed Insights: https://pagespeed.web.dev/
3. Observe as métricas no console ao navegar pelo site em produção
4. Configure alertas no Vercel Analytics Dashboard

## Verificação específica de problemas atuais

Execute as seguintes verificações manuais:

1. Verifique se há imagens sem dimensões definidas
2. Identifique elementos que mudam de tamanho após o carregamento
3. Verifique handlers de eventos em elementos com interações frequentes
4. Analise o FCP (First Contentful Paint) para garantir um carregamento rápido inicial
