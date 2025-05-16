fix(deploy): Otimização para deploy na Vercel

Este commit inclui várias otimizações para resolver os problemas de deploy na Vercel:

- Corrigido caminhos de importação para usar paths relativos em vez de aliases
- Otimizado o tratamento de dependências nativas, especialmente o pacote canvas
- Adicionado script deploy-vercel.js para facilitar o deploy
- Configurado vercel.json com parâmetros otimizados
- Adicionado fallback para geração de OG images
- Atualizado .npmrc com configurações para o ambiente Vercel
- Criado guia de deploy (VERCEL-DEPLOY-GUIDE.md)
- Adicionado configuração alternativa para Cloudflare Workers

Closes #[issue-number]
