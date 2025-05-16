# Solução para Problema de Build na Vercel

Este documento descreve o problema de build encontrado no ambiente da Vercel e a solução implementada.

## Problema

Durante o deploy na Vercel, o build falha com a seguinte mensagem de erro:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

Este erro ocorre porque o Rollup tenta carregar uma dependência nativa específica para o sistema operacional Linux usado pelo servidor de build da Vercel.

## Causa

O problema é causado por um bug conhecido do npm relacionado a dependências opcionais, conforme mencionado na mensagem de erro. No ambiente de build da Vercel:

1. O npm instala as dependências, mas não instala corretamente as dependências opcionais específicas do sistema
2. O Rollup tenta carregar a dependência nativa `@rollup/rollup-linux-x64-gnu`, mas não consegue encontrá-la
3. O processo de build falha devido a esse módulo não encontrado

## Solução Implementada

Implementamos uma solução abrangente com múltiplas camadas para garantir que o build funcione corretamente:

### 1. Adição de Dependências para Linux

Adicionamos explicitamente ambas as variantes do Rollup para Linux como dependências opcionais:

```json
"optionalDependencies": {
  "@rollup/rollup-linux-x64-gnu": "4.14.0",
  "@rollup/rollup-linux-x64-musl": "4.14.0",
  ...
}
```

### 2. Script de Correção Específico para o Rollup

Criamos um script (`scripts/rollup-vercel-fix.js`) que:

- Modifica o arquivo `native.js` do Rollup para evitar a dependência nativa
- Cria módulos mock para as dependências problemáticas
- É executado automaticamente antes do build na Vercel

### 3. Atualização do Script de Build da Vercel

Modificamos o script `scripts/vercel-build.js` para:

- Detectar e corrigir problemas com dependências do Rollup no ambiente da Vercel
- Implementar um mecanismo de fallback em caso de falha
- Aplicar um patch no código do Rollup quando necessário

### 4. .npmrc Otimizado

Configuramos um arquivo `.npmrc` específico para o ambiente da Vercel com configurações que ajudam a contornar problemas de dependências nativas:

```
legacy-peer-deps=true
force=true
canvas_skip_installation=true
...
```

## Como a Solução Funciona

1. No início do processo de build, o script `rollup-vercel-fix.js` é executado
2. Este script modifica o código do Rollup para evitar usar a dependência nativa problemática
3. Se o build falhar mesmo assim, o script `vercel-build.js` detecta o erro e aplica uma solução alternativa
4. O processo de build continua normalmente após estas correções

## Testando a Solução

Para testar esta solução localmente:

```bash
# Simular o ambiente da Vercel
npm run fix:rollup

# Executar o build com a correção
npm run build:vercel
```

## Referências

- [Issue do npm sobre dependências opcionais](https://github.com/npm/cli/issues/4828)
- [Documentação do Rollup sobre builds nativos](https://rollupjs.org/guide/en/#native-builds)
- [Guia da Vercel sobre solução de problemas de build](https://vercel.com/docs/concepts/deployments/troubleshooting)
