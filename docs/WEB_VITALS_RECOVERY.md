# 📈 Web Vitals & Recovery - Nova Ipê (Agosto 2025)

## 1. Diagnóstico Crítico

- Erros de dependência (`critters` ausente, bundle corrompido)
- Web Vitals impossíveis de medir (LCP, FID, CLS todos ruins)
- Imagens e CSS não otimizados
- Next.js 15.4.6 instável

## 2. Recovery de Emergência

- Configuração minimalista em `next.config.js` (reactStrictMode: false, swcMinify: false, images.unoptimized: true)
- Instalação manual de `critters` (`pnpm add critters`)
- Limpeza de cache e reinstalação de dependências

## 3. Componentes Otimizados Prontos

- `PropertyCardOptimized.tsx`: Card de imóvel com memoização, imagem otimizada, handlers memoizados
- `PropertySkeleton.tsx`: Skeleton loading para evitar CLS

## 4. Plano de Implementação

1. Garantir que o servidor inicia sem erros
2. Substituir todos os cards antigos por `PropertyCardOptimized`
3. Usar `PropertySkeleton` durante carregamento de dados
4. Medir Web Vitals com Lighthouse
5. Ativar otimizações gradualmente (imagem, minify, splitChunks)

## 5. Comandos de Recuperação

```bash
pnpm clean
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm add critters
pnpm dev --port 3002
```

## 6. Próximos Passos

- [ ] Testar servidor em http://localhost:3002
- [ ] Validar navegação e carregamento dos cards
- [ ] Medir Web Vitals reais
- [ ] Documentar resultados e ajustes

---

## Histórico de Intervenções

- 10/08/2025: Recovery de emergência iniciado
- 11/08/2025: Dependência `critters` instalada, config minimalista aplicada
- 11/08/2025: Pronto para iniciar implementação dos componentes otimizados
