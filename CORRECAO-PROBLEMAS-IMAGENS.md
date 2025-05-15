# Correção de Problemas com Imagens Sanity

## Análise do Problema

Após implementação do sistema unificado de imagens, foram identificados alguns problemas persistentes:

1. **Objetos de imagem incompletos**: Muitos objetos estavam chegando ao front-end apenas com a propriedade `alt`, sem qualquer informação de asset ou URL
2. **Fallbacks excessivos**: Isso resultava em um grande número de imagens caindo no fallback padrão (placeholder)
3. **Inconsistência de dados**: As imagens funcionavam em alguns contextos, mas falhavam em outros

## Causa Raiz

A análise revelou que o problema estava nas **queries GROQ** que não estavam projetando todos os campos necessários para a manipulação correta das imagens:

```groq
imagem {
  "imagemUrl": asset->url,
  "alt": alt
}
```

Esta projeção cria um objeto com apenas `imagemUrl` e `alt`, sem incluir o objeto `asset` completo ou o `_type`, que são necessários para o processamento robusto pelo nosso sistema unificado.

## Solução Implementada

### 1. Correção das Queries GROQ

Atualizamos todas as queries para incluir informações completas do asset:

```groq
imagem {
  "asset": asset->,
  "_type": "image",
  "imagemUrl": asset->url,
  "alt": alt
}
```

### 2. Reforço do `mapImovelToClient`

Implementamos recuperação robusta de dados de imagem:

- Extração segura de dados com múltiplas estratégias de fallback
- Reconstrução de objetos incompletos
- Garantia de estrutura mínima válida mesmo com dados incompletos

### 3. Aprimoramento do `PropertyProcessor`

Adicionamos múltiplas estratégias de recuperação de imagens:

- Busca em campos alternativos (imagemPrincipal, imagemCapa, etc)
- Reconstrução de objetos incompletos
- Validação e correção de estrutura de dados

### 4. Diagnósticos Avançados

Implementamos ferramentas de diagnóstico para identificar problemas:

- Registro estatístico de problemas com imagens
- Detecção e log de padrões problemáticos
- Interface de diagnóstico em `/diagnostico-imagens`

## Resultado

A nova implementação resolve o problema de várias maneiras:

1. **Prevenção**: As queries agora fornecem dados completos
2. **Recuperação**: Mesmo com dados incompletos, o sistema tenta várias estratégias de recuperação
3. **Fallback inteligente**: Quando necessário, exibe placeholders com alt text apropriado
4. **Diagnóstico**: Fornece ferramentas para identificar problemas persistentes

## Benefícios

- **Robustez**: Sistema resiliente a diferentes formatos e qualidade de dados
- **Manutenabilidade**: Código centralizado e bem documentado
- **Performance**: Uso otimizado de cache e estratégias de fast-path
- **Depuração**: Ferramentas incorporadas para diagnóstico

## Próximos Passos

- Monitorar a eficácia das correções em produção
- Considerar implementação de validação de esquema Sanity para garantir dados consistentes
- Investigar possibilidade de pré-processamento de imagens no back-end
