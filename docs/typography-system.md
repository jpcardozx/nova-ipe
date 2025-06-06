# Typography System - Nova Ipê

Este documento descreve o sistema tipográfico do site Nova Ipê, incluindo as fontes, tamanhos, pesos e hierarquia visual.

## Fontes

O site utiliza duas fontes principais:

1. **Playfair Display** - Font de estilo serif utilizada para títulos e elementos de destaque.
   - Variáveis CSS: `--font-playfair`
   - Classe: `.font-display`
   - Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

2. **Roboto** - Fonte sem serifa utilizada para corpo de texto e elementos de interface.
   - Variável CSS: `--font-roboto`
   - Classe: `.font-body`
   - Pesos: 300 (light), 400 (regular), 500 (medium), 700 (bold)

## Hierarquia de Títulos

| Nome da Classe | Elemento | Tamanho | Peso | Altura de Linha | Uso Recomendado |
|---------------|----------|---------|------|----------------|-----------------|
| `.text-display-1` | `<h1>` | 3.75rem (60px) / 3rem (48px) mobile | 700 | 1.1 | Título principal da página, hero section |
| `.text-display-2` | `<h2>` | 3rem (48px) / 2.5rem (40px) mobile | 700 | 1.1 | Título de seção principal |
| `.text-display-3` | `<h2>/<h3>` | 2.25rem (36px) / 1.875rem (30px) mobile | 700 | 1.1 | Subtítulo de seção |
| `.text-heading-1` | `<h3>` | 1.875rem (30px) / 1.5rem (24px) mobile | 700 | 1.2 | Título de card ou componente |
| `.text-heading-2` | `<h4>` | 1.5rem (24px) / 1.25rem (20px) mobile | 600 | 1.3 | Subtítulo de card |
| `.text-heading-3` | `<h5>` | 1.25rem (20px) / 1.125rem (18px) mobile | 600 | 1.4 | Título de elemento menor |

## Textos

| Nome da Classe | Tamanho | Peso | Altura de Linha | Uso Recomendado |
|---------------|---------|------|----------------|-----------------|
| `.text-body-large` | 1.125rem (18px) | 400 | 1.625 | Parágrafo principal, texto destacado |
| `.text-body` | 1rem (16px) | 400 | 1.5 | Texto padrão do site |
| `.text-body-small` | 0.875rem (14px) | 400 | 1.5 | Texto secundário, notas |
| `.text-caption` | 0.75rem (12px) | 500 | 1.5 | Legendas, rótulos |
| `.text-button` | 0.875rem (14px) | 500 | 1.25 | Texto em botões |

## Classes de Peso

| Nome da Classe | Peso | Uso Recomendado |
|---------------|------|-----------------|
| `.thin-text` | 300 | Textos elegantes, secundários |
| `.regular-text` | 400 | Texto padrão |
| `.medium-text` | 500 | Ênfase média, subtítulos |
| `.semibold-text` | 600 | Ênfase forte |
| `.bold-text` | 700 | Máxima ênfase, títulos |

## Uso do Sistema

### Exemplo de Componente com Hierarquia Correta

```tsx
<div className="card">
  <h2 className="text-display-3">Título Principal</h2>
  <p className="text-body-large">Este é um texto introdutório destacado que explica o propósito desta seção.</p>
  
  <div className="mt-6">
    <h3 className="text-heading-1">Subtítulo</h3>
    <p className="text-body">Conteúdo principal explicando os detalhes do tópico.</p>
    
    <div className="mt-4">
      <h4 className="text-heading-2">Item Secundário</h4>
      <p className="text-body-small">Detalhes adicionais sobre o item.</p>
      <span className="text-caption medium-text">Nota: informação complementar</span>
    </div>
  </div>
</div>
```

### Consistência Visual

Para manter a consistência visual em todo o site:

1. Use `.text-display-1`, `.text-display-2` e `.text-display-3` para títulos principais que usam a fonte Playfair Display.
2. Use `.text-heading-1`, `.text-heading-2` e `.text-heading-3` para subtítulos e títulos de componentes.
3. Use `.text-body-large` para parágrafos introdutórios ou destacados.
4. Use `.text-body` para a maioria dos textos do site.
5. Use `.text-body-small` para textos secundários ou de apoio.
6. Use `.text-caption` para legendas, rótulos e notas.
7. Use `.text-button` para o texto em botões e links de ação.

### Responsividade

O sistema tipográfico é responsivo e se ajusta automaticamente em telas menores. Em dispositivos móveis, os tamanhos são reduzidos proporcionalmente para manter a legibilidade e o layout adequado.

## Implementação no Código

No arquivo `globals.css`, as variáveis CSS são definidas:

```css
:root {
  /* Typography System */
  /* Main fonts */
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  --font-playfair: 'Playfair Display', Georgia, serif;
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Font sizes */
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem;  /* 36px */
  --text-5xl: 3rem;     /* 48px */
  --text-6xl: 3.75rem;  /* 60px */
}
```

## Manutenção

Ao adicionar novos componentes ou modificar existentes, sempre use as classes tipográficas definidas neste documento para manter a consistência visual do site. Evite definir tamanhos de fonte, pesos ou estilos diretamente em componentes individuais.
