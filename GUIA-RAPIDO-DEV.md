# 🚀 Next.js Dev Speed Optimization

Este guia mostra como acelerar o desenvolvimento com o Next.js usando as ferramentas otimizadas que adicionamos ao projeto.

## Problemas Solucionados

✅ **Tempo de Inicialização Lento (8.3s)** - Reduzido com o modo turbo  
✅ **Compilação Lenta (15-25s)** - Otimizada com configurações especiais  
✅ **Erro 404 nas Imagens** - Corrigido com componente de fallback  
✅ **Métricas Web Vitals Ruins** - Instrumentação opcional para performance  

## Comandos Rápidos

### Desenvolvimento Rápido

```powershell
# Modo de desenvolvimento rápido (recomendado para o dia a dia)
pnpm run dev:start
# ou
./fast-dev.ps1
```

### Limpeza do Ambiente

```powershell
# Limpa caches para resolver problemas
pnpm run dev:clean
# ou
./clean-dev.ps1
```

### Modos Especializados

```powershell
# Modo normal
pnpm run dev

# Modo turbo (mais rápido)
pnpm run dev:turbo

# Modo com otimização de memória
pnpm run dev:memory

# Modo com métricas de performance
pnpm run dev:vitals
```

### Otimizações de Performance

```powershell
# Otimização completa (recomendado)
pnpm run optimize:all

# Otimizar apenas imagens
pnpm run optimize:images

# Corrigir imagens placeholder
pnpm run fix:placeholder

# Verificar melhorias de performance
pnpm run check:performance
```

## O Que Foi Otimizado

1. **TypeScript Flexível em Desenvolvimento**
   - Configuração especial para dev que ignora erros não críticos

2. **ESLint Otimizado**
   - Regras reduzidas durante o desenvolvimento

3. **Caching Aprimorado**
   - Configuração de cache otimizada para dev

4. **Imagens à Prova de Falhas**
   - Geração automática de placeholder JPG
   - Novo componente `ImageWithFallback` para tratamento inteligente de imagens

5. **Gestão de Memória**
   - Modo específico para limitar uso de memória

6. **Scripts de Utilidade**
   - Limpeza de cache e inicialização rápida
   - Otimização de imagens com formatos modernos
   - Verificação de melhorias de performance

## Quando Usar Cada Modo

| Modo | Quando Usar |
|------|-------------|
| `dev` | Quando precisar de todas as verificações |
| `dev:fast` | Para a maioria do trabalho diário |
| `dev:turbo` | Quando precisar da velocidade máxima |
| `dev:memory` | Se estiver com problemas de memória |
| `dev:vitals` | Para debugging de performance |
| `dev:clean` | Quando encontrar erros estranhos |

## Resolução de Problemas

Se encontrar problemas com o desenvolvimento:

1. Execute `pnpm run dev:clean` para limpar os caches
2. Use `dev:turbo` para desenvolvimento mais rápido
3. Verifique se há erros no console ou no terminal
4. Para problemas de memória, use `dev:memory`

---

Agora seu ambiente de desenvolvimento Next.js está otimizado para velocidade! 🚀
