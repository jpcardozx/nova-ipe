# Plano de Ação e Documentação Estratégica

Este documento serve como a fonte da verdade para as refatorações e implementações acordadas.

---

## 1. Refatoração Crítica do Componente `ipeConcept`

**Filosofia:** Evoluir a implementação atual, corrigindo as falhas de UX, visuais e de copywriting para criar uma narrativa de confiança que seja inclusiva para **vendedores e compradores**, e que demonstre sofisticação em cada detalhe.

### 1.1. Correção do Header (Copywriting e Percepção)

*   **Problema:** O título "Como maximizamos o valor do seu imóvel" é alienante para compradores.
*   **Solução:** Alterar para um título mais neutro e focado na expertise.
    *   **Novo Título:** `Nossa Forma de Trabalhar`
    *   **Novo Subtítulo:** `Entenda a metodologia que garante segurança e eficiência em cada transação imobiliária.`
    *   **Badge:** Alterar texto para `Expertise e Confiança em Guararema`.

### 1.2. Refinamento Crítico do UX da Coluna Esquerda

*   **"Processo" (Timeline):**
    *   **Interatividade:** Transformar a seção em uma **linha do tempo vertical e interativa**. Uma linha animada conectará os passos. O passo ativo receberá um **efeito de "holofote"**, onde os passos inativos terão sua opacidade e saturação de cor reduzidas (`filter: grayscale(80%)` e `opacity: 0.7`), focando a atenção do usuário na etapa atual.
    *   **Ícones:** Substituir os ícones atuais por opções da biblioteca Lucide que representem melhor os conceitos: `Search` -> `ClipboardSignature`, `Target` -> `Megaphone`, `CheckCircle2` -> `Handshake`.

*   **"Nossos Diferenciais" (Métricas de Destaque):**
    *   **UX:** Redesenhar como **"Métricas de Destaque"** em um grid 2x2. Os cards serão mais compactos, focando no dado principal. A descrição completa aparecerá suavemente em um tooltip premium no `hover`.

*   **"Nossas Garantias" (Compromissos):
    *   **Copywriting:** Manter o título `Nossas Garantias`, mas suavizar os textos para:
        1.  `Análise de mercado detalhada.`
        2.  `Estratégia de divulgação personalizada.`
        3.  `Comunicação clara e contínua.`
        4.  `Suporte profissional em todas as etapas.`
    *   **UI:** Estilizar a seção como um **"Termo de Compromisso"** visual, com fundo escuro, borda estilizada e tipografia formal.

### 1.3. Refinamento Crítico do UX da Coluna Direita (Sticky)

*   **Comportamento Sticky:** O `offset` do topo (`top-24`) será usado para garantir que a `navbar` nunca sobreponha o conteúdo. Será adicionado `padding` ao final da coluna esquerda para que a coluna da direita tenha um "ponto de parada" natural.
*   **Remoção de Redundância:** O card de "Vendas" (`340+ Vendas`) será **removido** para dar mais respiro aos outros stats.
*   **Ícone de Estrela:** O emoji de estrela no "Rating" (`4.8⭐`) será substituído pelo ícone `<Star />` da biblioteca Lucide, estilizado com a cor âmbar.

### 1.4. Implementação dos CTAs

*   O botão principal será **"Solicitar Avaliação"**.
*   O botão secundário será **"Vender Imóvel"**, com estilo visual apropriado.

### 1.5. Sugestões de UI/UX Complementares (Gemini)

*   **Animações de Layout:** Adicionar `framer-motion` para animar a altura da seção "Diferenciais" quando a descrição aparecer no hover, evitando saltos de layout.
*   **Carregamento de Imagem:** Utilizar um placeholder `blur-up` para a imagem principal na coluna da direita para uma experiência de carregamento mais suave.

---

## 2. Tarefas Adicionais Documentadas

*   **Componente Hero (`MobileFirstHeroClean.tsx`):**
    *   **Ação:** Substituir o ícone do card de **"Sítios"** por um ícone de árvore (ex: `<Trees />` da Lucide), para maior coerência temática.

---

## 3. Design System & Dashboard Proposal

### 3.1. Análise do Design System Existente

A análise da página inicial e dos seus componentes revela um design system coeso e de alto padrão, focado em uma estética premium e moderna. Os seguintes parâmetros são a base da identidade visual do projeto:

*   **Layout:**
    *   **Estrutura Setorizada:** A página é construída em seções de largura total, com conteúdo centralizado e com largura máxima para garantir a legibilidade.
    *   **Espaçamento Generoso:** O uso de `space-y-8 lg:space-y-12` entre as seções cria uma sensação de luxo e organização.
    *   **Grids:** Grids são utilizados para a exibição de imóveis, garantindo um alinhamento consistente.

*   **Tipografia:**
    *   **Fontes:** A combinação de `Inter` (sans-serif) para o corpo do texto e `Playfair Display` (serif) para os títulos cria um contraste elegante e profissional.
    *   **Hierarquia Clara:** Os títulos são grandes e em negrito, estabelecendo uma hierarquia visual clara.

*   **Paleta de Cores:**
    *   **Primária (`#1a6f5c`):** Usada para botões e elementos interativos, transmitindo confiança e ação.
    *   **Secundária (`#0d1f2d`):** Usada para texto e fundos escuros, garantindo legibilidade e sofisticação.
    *   **Accent (`#ffcc00`):** Usada para destaques e elementos especiais, adicionando um toque de luxo.
    *   **Gradientes:** Gradientes suaves (e.g., `from-slate-50 to-amber-50`) são usados para fundos, criando profundidade e interesse visual.

*   **Componentes:**
    *   **Cards:** Os cards de imóveis possuem cantos arredondados e sombras sutis, criando um efeito de profundidade.
    *   **Botões:** Os botões possuem uma hierarquia visual clara e são estilizados com a cor primária.

### 3.1.1. Análise Detalhada das Seções

A análise das seções individuais da página inicial revela um conjunto de padrões de design e componentes reutilizáveis que definem a identidade visual do projeto.

*   **DestaquesVendaPremium & SecaoImoveisParaAlugarPremium:**
    *   **Estrutura Consistente:** Ambas as seções utilizam uma estrutura consistente, com um título, um subtítulo, um carrossel de imóveis e uma seção de CTA.
    *   **Carrossel Customizado:** O carrossel é um componente customizado com navegação por setas e pontos, e é responsivo.
    *   **Cards de Imóveis:** O componente `PropertyCardPremium` é utilizado para exibir os imóveis, e possui um efeito de hover que aumenta a escala do card.
    *   **Gestão de Estado:** As seções possuem uma excelente gestão de estado, com estados de loading, erro, vazio e fallback.

*   **ValorAprimoradoV4:**
    *   **Seções Interativas:** A seção de "Serviços" é interativa, permitindo que o usuário clique em diferentes serviços para ver mais informações. A seção de "FAQ" é um accordion.
    *   **Formulário de Lead:** A seção inclui um formulário de lead com um design limpo e moderno.
    *   **Badges e Tags:** A seção utiliza badges e tags para destacar informações.

*   **MarketAnalysisSection:**
    *   **Interface com Abas:** A seção utiliza uma interface com abas para alternar entre diferentes tipos de usuários ("Compradores", "Vendedores", "Investidores").
    *   **Sidebar Fixo:** A seção possui um sidebar fixo com um formulário de lead, que permanece visível enquanto o usuário rola a página.
    *   **Estilização Avançada:** A seção utiliza técnicas de estilização avançada, como gradientes, sombras e `backdrop-blur-sm`.

*   **BlocoExploracaoSimbolica:**
    *   **Layout Baseado em Cards:** A seção utiliza um layout baseado em cards para apresentar diferentes "cenários de moradia".
    *   **Efeitos de Hover:** Os cards possuem um efeito de hover que aumenta a escala da imagem e exibe o CTA.
    *   **Filtros:** A seção inclui filtros por "bairros" and "buscas frequentes".

*   **IpeConcept:**
    *   **Timeline Vertical:** A seção utiliza uma timeline vertical para apresentar o processo de trabalho da empresa.
    *   **Cards Animados:** A seção de "Diferenciais" utiliza cards animados que se expandem no hover.
    *   **Imagem Fixa:** A seção possui uma imagem fixa no lado direito da tela.

*   **EnhancedTestimonials:**
    *   **Múltiplos Modos:** O componente possui múltiplos modos de exibição (`default`, `minimal`, `focused`, `cards`).
    *   **Tematização:** O componente possui um sistema de temas (`light`, `dark`, `amber`).
    *   **Carrossel:** O componente inclui um carrossel com autoplay, setas de navegação e pontos.

### 3.2. Proposta de Design para o Dashboard de Parceiros

Com base na análise do design system existente, proponho o seguinte design para o dashboard de parceiros:

*   **Layout:**
    *   **Navegação Lateral:** Um menu lateral fixo com os principais links do dashboard (e.g., "Início", "CRM", "Analytics", "Configurações").
    *   **Área de Conteúdo Principal:** Uma área de conteúdo principal à direita do menu lateral, que exibirá as diferentes seções do dashboard.
    *   **Consistência:** A área de conteúdo principal seguirá os mesmos princípios de layout da página inicial, com seções bem definidas e espaçamento generoso.

*   **Componentes Chave:**
    *   **Tabelas de Dados:** Para exibir dados do CRM (e.g., lista de contatos), utilizaremos tabelas estilizadas com o mesmo padrão de design do restante do site.
    *   **Gráficos:** Para a seção de analytics, utilizaremos gráficos limpos e modernos, com cores consistentes com a paleta do projeto.
    *   **Formulários:** Os formulários para adicionar novos contatos ou outras informações seguirão o mesmo estilo dos formulários de contato existentes no site.

*   **Estilo Visual:**
    *   **Sofisticado e Profissional:** O dashboard terá um visual sofisticado e profissional, que reflete a marca "ipe".
    *   **Foco na Usabilidade:** O design será focado na usabilidade, com uma interface intuitiva e fácil de usar.
    *   **Consistência da Marca:** Manteremos a consistência da marca em todos os elementos do dashboard, utilizando a mesma paleta de cores, tipografia e estilos de componentes.

### 3.3. Refatoração da Página de Login

A página de login será a primeira a ser refatorada para seguir o novo design system. As seguintes mudanças serão implementadas:

*   **Layout:** O layout será atualizado para ser mais espaçoso e alinhado com o design da página inicial.
*   **Componentes:** Utilizaremos os componentes de UI existentes (`Card`, `Button`, etc.) para garantir a consistência.
*   **Estilo:** A página terá um visual mais premium e polido, com atenção aos detalhes de design.

### 3.4. Padrões de Design para Páginas de Autenticação

As páginas de autenticação (login, signup, etc.) seguirão um conjunto de padrões de design para garantir uma experiência de usuário coesa e elegante.

*   **Layout:**
    *   **Background de Imersão:** Utilizaremos uma imagem de fundo em tela cheia para criar uma experiência de imersão. A imagem será coberta por um overlay de gradiente preto para garantir a legibilidade do conteúdo.
    *   **Card de Formulário:** O formulário será apresentado em um card com efeito de "glassmorphism" (`backdrop-blur-xl`, `bg-black/30`), alinhado à esquerda da página.

*   **Tipografia:**
    *   **Títulos:** Os títulos principais utilizarão a fonte `Playfair Display` (serif) com um gradiente sutil nos tons de âmbar da paleta de cores.
    *   **Corpo do Texto:** O corpo do texto utilizará a fonte `Inter` (sans-serif) com cores que garantam a legibilidade sobre o fundo escuro.

*   **Componentes:**
    *   **Inputs:** Os inputs terão um design minimalista, com um fundo semitransparente e bordas sutis.
    *   **Botões:** Os botões principais terão um gradiente nos tons de âmbar e um efeito de hover que aumenta a sombra e a escala do botão.

*   **Animações:**
    *   **Framer Motion:** Utilizaremos a biblioteca `framer-motion` para adicionar animações sutis e elegantes aos elementos da página, como o card de formulário e os botões.
