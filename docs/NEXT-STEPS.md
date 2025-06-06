# Próximas Etapas - Projeto Nova Ipê

Este documento descreve as próximas etapas necessárias para concluir a remediação arquitetural do projeto Nova Ipê.

## 1. Consolidação de Componentes

> **Prioridade: ALTA** | **Prazo: 15 de Julho de 2025**

O projeto atualmente possui múltiplas versões dos mesmos componentes, criados em diferentes momentos e com abordagens inconsistentes. A consolidação destes componentes é fundamental para:

- Reduzir o tamanho do bundle JavaScript
- Garantir consistência visual e comportamental
- Facilitar a manutenção futura
- Melhorar o desempenho geral da aplicação

### Plano de Ação:

1. **Completar os componentes unificados iniciados**

   - Finalizar `PropertyCardUnified` resolvendo problemas de TypeScript
   - Otimizar `VirtualizedPropertiesGridUnified` para grandes conjuntos de dados
   - Ver detalhes em: `/components/ui/property/PROGRESSO-CONSOLIDACAO.md`

2. **Desenvolver os componentes unificados pendentes**

   - Criar `PropertyHeroUnified` consolidando as diferentes versões
   - Implementar `PropertyFeaturesUnified` com API consistente
   - Desenvolver `PropertyMapUnified` com melhor desempenho e UX

3. **Utilizar ferramenta de migração**
   - Executar script de análise: `/components/ui/property/migration-helper.js`
   - Migrar os componentes legados conforme relatório gerado
   - Validar visualmente cada migração

### Documentação Relacionada:

- [Plano detalhado de consolidação](/CONSOLIDACAO-COMPONENTES.md)
- [Exemplos de implementação](/components/ui/property/implementacao-exemplo.md)
- [Progresso da consolidação](/components/ui/property/PROGRESSO-CONSOLIDACAO.md)

## 2. Redução de Dependências

> **Prioridade: ALTA** | **Prazo: 30 de Junho de 2025**

O projeto atualmente possui mais de 65 dependências diretas, sendo que a meta é reduzir para menos de 40.

### Plano de Ação:

1. **Remover componentes Radix UI não utilizados**

   - Identificar componentes usados apenas em páginas de demo
   - Mover demos para repositório separado
   - Manter apenas os componentes essenciais

2. **Consolidar pacotes de carrossel**

   - Substituir múltiplos pacotes de carrossel por uma única solução
   - Considerar embla-carousel como solução principal

3. **Padronizar bibliotecas de ícones**

   - Migrar completamente para Lucide React
   - Remover dependência de react-icons

4. **Eliminar polyfills desnecessários**
   - Remover polyfills que não são mais necessários com versões modernas de navegadores
   - Utilizar o suporte nativo do Next.js para polyfills

### Documentação Relacionada:

- [Análise crítica de dependências](/ANALISE-CRITICA-DEPENDENCIAS.md)

## 3. Resolução de Erros TypeScript

> **Prioridade: MÉDIA** | **Prazo: 15 de Julho de 2025**

Existem diversos erros de TypeScript no projeto que precisam ser resolvidos para garantir a estabilidade e manutenibilidade do código.

### Plano de Ação:

1. **Mapear todos os erros de TypeScript**

   - Executar verificação completa de tipos (`tsc --noEmit`)
   - Classificar erros por severidade e impacto

2. **Corrigir interfaces inconsistentes**

   - Padronizar interfaces de componentes relacionados
   - Resolver problemas de tipagem em props de componentes

3. **Melhorar tipagem de dados externos**
   - Fortalecer tipagem de dados vindos da API
   - Implementar validação de esquema para dados externos

## 4. Otimização de Performance

> **Prioridade: MÉDIA** | **Prazo: 31 de Julho de 2025**

### Plano de Ação:

1. **Implementar lazy loading para componentes pesados**

   - Utilizar `dynamic` do Next.js estrategicamente
   - Priorizar conteúdo above-the-fold

2. **Otimizar carregamento de imagens**

   - Migrar todas as imagens para o componente Image do Next.js
   - Implementar formatos modernos (WebP/AVIF)
   - Configurar placeholders e estratégias de blur

3. **Implementar code-splitting eficiente**

   - Revisar estratégia de chunks do webpack
   - Otimizar pontos de divisão para melhor carregamento inicial

4. **Medir e documentar melhorias**
   - Estabelecer métricas de base (Core Web Vitals)
   - Documentar melhorias específicas após otimizações
