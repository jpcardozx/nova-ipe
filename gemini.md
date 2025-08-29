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
