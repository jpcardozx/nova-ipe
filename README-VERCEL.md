# Correções para Deploy no Vercel - Nova Ipê

Este documento descreve as correções aplicadas para resolver os problemas de build e deploy no Vercel para o site da Nova Ipê.

## Problemas Corrigidos

### 1. Problemas com Dependência do Canvas

O pacote `canvas` requer bibliotecas nativas que não estão disponíveis por padrão no ambiente de build do Vercel. Os seguintes ajustes foram aplicados:

- Movido `canvas` de `devDependencies` para `optionalDependencies` no package.json
- Implementado um script de fallback para geração de OG Images quando o canvas não está disponível
- Adicionado configurações no `.npmrc` para pular a instalação do canvas caso falhe
- Alterado o script de postinstall para detectar o ambiente Vercel

### 2. Problemas com Resolução de Caminhos

Os imports com alias (como `@lib/...` e `@/types/...`) estavam causando problemas no build. As seguintes correções foram aplicadas:

- Substituição de imports alias por caminhos relativos nos arquivos API routes
- Correção dos imports nos componentes de página como `app/comprar/page.tsx` e `app/alugar/page.tsx`
- Aprimoramento do `jsconfig.json` com opções de compilador adicionais
- Adição de configurações webpack no `next.config.js` para melhor resolução de caminhos

### 3. Configurações do Vercel

Adicional ao `vercel.json` para melhorar a compatibilidade com o ambiente Vercel:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --force",
  "framework": "nextjs",
  "ignoreCommand": "node -e \"process.exit(process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production' ? 0 : 1)\"",
  "outputDirectory": ".next"
}
```

## Estratégia para OG Images

Como o pacote `canvas` não é totalmente compatível com o ambiente Vercel, implementamos uma estratégia de fallback:

1. Um script `scripts/fallback-og-images.js` foi criado para ser executado durante o build
2. Este script cria um manifesto JSON para informar o site que as imagens OG devem ser carregadas a partir do diretório `/public/images/`
3. O ideal é pré-gerar estas imagens em ambiente local e comitá-las para o repositório

## Recomendações Futuras

1. **Pré-geração de OG Images**: Considere pré-gerar as imagens OG em ambiente local e comitá-las ao repositório
2. **Testes em Ambiente CI**: Implementar testes que verificam a compatibilidade dos caminhos de importação
3. **Simplificação de Dependências**: Reduzir o uso de dependências que requerem compilação nativa

## Passos para Deploy Manual

1. Clone o repositório
2. Execute `npm install --force`
3. Execute `npm run generate-og-images` para criar as imagens OG de fallback
4. Execute `npm run build` para verificar se o build funciona localmente
5. Faça push para o branch que está conectado ao Vercel

## Referências

- [Vercel - Runtime Dependencies Guide](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes)
- [Next.js - Path Alias Configuration](https://nextjs.org/docs/advanced-features/module-path-aliases)
- [Node Canvas - Installation Issues](https://github.com/Automattic/node-canvas#installation)
