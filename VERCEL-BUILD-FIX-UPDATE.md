# Correções para o Build na Vercel - 16/05/2025

Este documento detalha as soluções implementadas para corrigir problemas encontrados durante o processo de build na plataforma Vercel.

## Problemas Corrigidos

### 1. Erro com dependências do Rollup

**Problema:**
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies
```

**Solução:**
- Implementamos o script `rollup-vercel-fix.js` que cria módulos mock para as dependências problemáticas do Rollup
- Adicionamos dependências opcionais no package.json para garantir compatibilidade
- Modificamos o script de build da Vercel para incluir o patch do Rollup

### 2. Fontes ausentes para geração de OG Images

**Problema:**
```
Module not found: Can't resolve '/public/fonts/Montserrat-Medium.ttf'
Module not found: Can't resolve '/public/fonts/Montserrat-Bold.ttf'
```

**Solução:**
- Criamos o diretório `public/fonts` 
- Modificamos a rota de API das OG images para:
  1. Procurar fontes no local correto usando caminhos relativos 
  2. Implementar fallback para carregar fontes do Google Fonts CDN quando necessário

### 3. Problemas de caminhos de importação

**Problema:**
```
Module not found: Can't resolve '@sections/NavBar'
Module not found: Can't resolve '@sections/Footer'
Module not found: Can't resolve '@sections/Valor'
```

**Solução:**
- Alteramos os caminhos de importação na página de contato para usar caminhos relativos
- Atualizamos as referências para apontar para o local correto dos componentes

## Como verificar as correções

Após aplicar estas alterações, o build na Vercel deve funcionar corretamente. É possível verificar:

1. Se a geração de OG images está funcionando 
2. Se a página de contato carrega corretamente com seus componentes
3. Se não há erros de build relacionados ao Rollup

## Considerações futuras

Para evitar problemas semelhantes no futuro:

1. **Dependências nativas**: Sempre teste builds em ambientes Linux antes de fazer deploy
2. **Caminhos de recursos**: Use caminhos relativos ou resolva corretamente os aliases
3. **Fontes e recursos estáticos**: Inclua fallbacks para recursos críticos
