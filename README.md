# Nova Ipê - Site Imobiliário Premium

Um site moderno e elegante para uma imobiliária de alto padrão, com foco em experiência do usuário e design premium.

## Visão Geral

O Nova Ipê é um projeto de site imobiliário desenvolvido com tecnologias modernas como Next.js, React, TypeScript, Tailwind CSS e Framer Motion. O objetivo é oferecer uma experiência digital premium para clientes que buscam imóveis de alto padrão.

## 🚀 Início Rápido (Atualizado Junho 2025)

Para iniciar o servidor de desenvolvimento após a remediação arquitetural:

```bash
# Script de inicialização limpo (recomendado)
./iniciar-dev-limpo.cmd

# OU usando npm diretamente
npm run dev
```

## Características Principais

- **Design Premium**: Interface elegante e sofisticada com animações suaves e micro-interações
- **Sistema de Design Consistente**: Definições padronizadas de cores, tipografia, espaçamentos e componentes
- **Componentes Reutilizáveis**: Biblioteca de componentes UI modulares e extensíveis
- **Responsivo**: Adaptação perfeita para todos os tamanhos de tela
- **Otimizado para Performance**: Carregamento rápido e experiência fluida
- **Acessibilidade**: Conformidade com padrões WCAG para garantir usabilidade para todos

## Sistema de Design

O projeto utiliza um sistema de design completo definido em `lib/design-system.ts` com:

- **Cores**: Paleta principal e cores de acento
- **Tipografia**: Hierarquia de textos e fontes
- **Espaçamentos**: Sistema de grid e espaçamentos consistentes
- **Breakpoints**: Pontos de quebra para responsividade
- **Animações**: Transições e efeitos padronizados

## Componentes UI

### Componentes Core

- **Button**: Botão customizável com múltiplas variantes, animações e estados
  - Variantes: primary, secondary, outline, ghost, light, dark, premium, success, danger, link
  - Animações: pulse, scale, float, glow, subtle
  - Suporte a ícones, loading state e acessibilidade

### Componentes de Propriedade

- **PropertyCard**: Card para exibição de imóveis com imagens, informações e interações
- **PropertyCarousel**: Carrossel para exibir coleções de imóveis com navegação e responsividade
- **PropertyHero**: Seção hero para páginas de detalhes de imóveis com galeria de imagens
- **PropertyFeatures**: Exibição de características e comodidades do imóvel
- **PropertyMap**: Componente para mostrar localização e proximidades do imóvel

## Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nova-ipe.git

# Navegue até o diretório
cd nova-ipe

# Instale as dependências
npm install
```

### 🛠️ Construir para Produção

Para construir a versão de produção com todas as otimizações:

```bash
# Script de validação de build (recomendado)
./validar-build.cmd

# OU usando npm diretamente
npm run build
```

## 📝 Remediação Arquitetural (Junho 2025)

O projeto passou por uma remediação arquitetural significativa em Junho de 2025 para reduzir a dívida técnica:

### Principais Melhorias

- **Redução de Dependências**: De 82+ para ~40 dependências essenciais
- **Simplificação de Configuração**: Remoção de customizações webpack desnecessárias
- **Consolidação CSS**: Padronização no Tailwind CSS
- **Build Estável**: Eliminação de scripts de correção, aproveitando funcionalidades nativas do Next.js

### Documentação Relacionada

- [ACOMPANHAMENTO-REMEDICAO-ARQUITETURAL.md](./ACOMPANHAMENTO-REMEDICAO-ARQUITETURAL.md) - Detalhes do processo de remediação
- [CSS-CONSOLIDATION-GUIDE.md](./CSS-CONSOLIDATION-GUIDE.md) - Guia para consolidação de CSS
- [GUIA-RESOLUCAO-PROBLEMAS.md](./GUIA-RESOLUCAO-PROBLEMAS.md) - Soluções para problemas comuns
- [NEXT-STEPS.md](./NEXT-STEPS.md) - Próximos passos para o projeto

### Validação de Remediação

Para verificar o estado da remediação:

```bash
# Execute o script de validação
npm run validate-remediation
```

A ferramenta de validação verifica:

- Remoção de configurações webpack customizadas
- Eliminação de dependências desnecessárias
- Consolidação de abordagens CSS

## 🧩 Padrões de Componentes

Todos os componentes de card de propriedade foram consolidados em `PropertyCardUnified` (em `components/ui/property/PropertyCardUnified.tsx`). Da mesma forma, todas as implementações de grade virtualizada usam `VirtualizedPropertiesGridUnified` (em `app/components/VirtualizedPropertiesGridUnified.tsx`).

Arquivos de componentes legados foram substituídos por stubs de redirecionamento que apontam para as versões unificadas.

## ⚙️ Referência de Scripts

| Script             | Descrição                                                         |
| ------------------ | ----------------------------------------------------------------- |
| `dev`              | Inicia o servidor de desenvolvimento                              |
| `dev:clean`        | Limpa o diretório de build e inicia o servidor de desenvolvimento |
| `dev:smart`        | Aplica todas as correções e inicia o servidor de desenvolvimento  |
| `build`            | Compila a aplicação para produção                                 |
| `build:clean`      | Limpa o diretório de build e compila a aplicação                  |
| `build:smart`      | Aplica todas as correções e compila a aplicação para produção     |
| `start:clean`      | Inicia o servidor de produção                                     |
| `start:production` | Valida correções, compila e inicia o servidor de produção         |
| `diagnostic`       | Executa a ferramenta de diagnóstico para identificar problemas    |
| `smart-fix`        | Aplica todas as correções ao código-base                          |
| `validate:fixes`   | Verifica se todas as correções foram aplicadas corretamente       |
