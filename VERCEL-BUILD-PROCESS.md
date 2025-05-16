# Processo de Build para Vercel

Este documento explica o processo de build otimizado criado para o projeto Nova Ipê na plataforma Vercel.

## Problema Resolvido

A Vercel impõe um limite de 256 caracteres para o `buildCommand` no arquivo `vercel.json`. Nossa configuração anterior excedia esse limite, causando falha na validação do esquema.

## Solução Implementada

### 1. Simplificação do buildCommand

O arquivo `vercel.json` agora contém um comando simplificado:

```json
{
  "buildCommand": "npm run build:vercel"
}
```

### 2. Script NPM Unificado

No `package.json`, criamos scripts encadeados:

```json
{
  "scripts": {
    "prepare-vercel": "node scripts/vercel-prepare-build.js",
    "build:vercel": "npm run prepare-vercel && next build"
  }
}
```

### 3. Script Centralizado de Preparação

Criamos o script `scripts/vercel-prepare-build.js` que:

- Executa sequencialmente todos os scripts de correção necessários
- Gerencia erros e fornece feedback detalhado
- Lida corretamente com caminhos que contêm espaços
- Produz um relatório final de execução

## Scripts de Correção Aplicados

O processo executa, em ordem:

1. `verify-next-config.js` - Verifica e corrige erros no next.config.js
2. `diagnose-and-fix-paths.js` - Diagnóstico de ambiente e correções de caminhos
3. `fix-module-imports.js` - Cria aliases de módulos faltantes
4. `create-missing-stubs.js` - Cria stubs para componentes referenciados mas não existentes
5. `fix-optimized-carousel.js` - Corrige problemas específicos do carousel
6. `fix-tailwind-preflight.js` - Resolve o erro "Can't resolve 'tailwindcss/preflight'"

## Testando o Processo de Build

Para testar localmente o processo de preparação para build:

```powershell
.\test-vercel-prep.ps1
```

Para executar o processo completo como se estivesse na Vercel:

```powershell
npm run build:vercel
```

## Resolução de Problemas

Se ocorrerem problemas durante o build na Vercel:

1. Verifique os logs da Vercel para identificar qual script falhou
2. Execute o script específico localmente para reproduzir o problema
3. Faça os ajustes necessários e atualize o script correspondente
4. Teste com `.\test-vercel-prep.ps1` antes de tentar o deploy novamente
