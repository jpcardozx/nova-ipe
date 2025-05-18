# Sistema CSS da Nova Ipê

## Estrutura e Organização

Este projeto implementa uma arquitetura CSS moderna e otimizada para performance, usando Tailwind CSS como base e extend com componentes personalizados.

### Arquivos Principais

- **globals.css**: Sistema de design unificado e ponto central de importação
- **critical.css**: Estilos críticos para otimização de LCP e prevenção de CLS
- **cls-optimizations.css**: Classes específicas para redução de Cumulative Layout Shift
- **tailwind-compat.css**: Adaptações para compatibilidade entre diferentes versões
- **styles/variables.css**: Definição central de variáveis CSS
- **styles/components.css**: Componentes reutilizáveis específicos

### Ordem de Carregamento

1. Base e reset do Tailwind
2. Estilos críticos para performance
3. Componentes personalizados
4. Utilitários e extensões

## Uso Recomendado

### Componentes Nova Ipê

Use as classes personalizadas para garantir consistência visual:

```jsx
// Exemplo de uso dos componentes
<section className="section-ipe">
  <div className="container-ipe">
    <h2 className="heading-section">Imóveis em Destaque</h2>
    <p className="subtitle-elegant">Descubra as melhores opções para você</p>
    
    <div className="grid-properties">
      <div className="card-ipe-property">
        {/* Conteúdo do card */}
      </div>
    </div>
    
    <button className="btn-ipe btn-ipe-primary">Ver todos os imóveis</button>
  </div>
</section>
```

### Cores e Variáveis

O sistema utiliza variáveis CSS e classes Tailwind para todas as cores:

- **Verde principal**: `bg-brand-green` ou `var(--color-brand-green)`
- **Azul escuro**: `bg-brand-dark` ou `var(--color-brand-dark)`
- **Amarelo accent**: `bg-accent-yellow` ou `var(--color-accent-yellow)`

## Extensões e Responsividade

O sistema inclui breakpoints responsivos para todos os componentes e tipografia adaptativa.

## Performance e Otimizações

- Estilos críticos carregados primeiro
- Animações otimizadas para Core Web Vitals
- Prevenção de CLS com placeholders e aspect-ratios consistentes
- Otimização para impressão

## Futuras Melhorias

- Implementação de tema escuro
- Expansão do sistema de espaçamento com tokens
- Componentes adicionais para formulários e alertas
