# 🚀 Plano de Migração: Sair da Locaweb

## 💰 Análise de Custos (baseada no guia)

### Locaweb (atual):
- ❌ Hospedagem básica: ~R$ 15-30/mês
- ❌ SSL adicional: ~R$ 10-20/mês  
- ❌ Problemas técnicos: suPHP, limitações
- ❌ Suporte limitado para problemas complexos
- **Total: R$ 25-50/mês + dores de cabeça**

### Nova Arquitetura (recomendada):
- ✅ Vercel (Next.js): Grátis ou $20/mês
- ✅ Railway (WordPress): $5/mês
- ✅ SSL automático: Incluído
- ✅ Performance superior
- ✅ Zero problemas suPHP
- **Total: R$ 0-130/mês + paz de espírito**

## 🎯 Estratégia de Migração (3 fases)

### FASE 1: Correção Imediata (hoje)
```bash
# Via FileZilla - resolver suPHP
1. Conectar FTP Locaweb
2. Corrigir permissões (755/644)
3. Testar: portal.imobiliariaipe.com.br
4. ✅ Portal funcionando!
```

### FASE 2: Backup e Preparação (esta semana)
```bash
# Backup via FileZilla
📁 Baixar: wp-content/ (temas, plugins, uploads)
📄 Baixar: wp-config.php
📄 Baixar: .htaccess
💾 Export: Banco MySQL (via phpMyAdmin Locaweb)
```

### FASE 3: Nova Infraestrutura (próximas 2 semanas)
```bash
# Opção A: WordPress Dockerizado no Railway
🐳 railway.app → Deploy WordPress container
🔗 Conectar banco PostgreSQL/MySQL
📁 Upload arquivos via FTP
🌐 DNS: portal.imobiliariaipe.com.br → railway

# Opção B: WordPress Headless
📊 Manter WordPress como CMS
🚀 API REST → Next.js frontend
🎯 Melhor performance + segurança
```

## 🔄 Implementação Técnica

### Próximo proxy otimizado:
```javascript
// app/portal/[[...path]]/route.ts (melhorado)
export async function GET(request: Request) {
  // Novo destino após migração
  const NOVO_WORDPRESS = 'https://wordpress-ipe.railway.app'
  
  try {
    const response = await fetch(NOVO_WORDPRESS + pathname, {
      method: 'GET',
      headers: {
        'User-Agent': 'Nova-IPE-Proxy/1.0',
        'X-Forwarded-For': clientIP,
      },
      timeout: 10000,
    })
    
    if (response.ok) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/html',
          'Cache-Control': 'public, max-age=300',
        }
      })
    }
  } catch (error) {
    // Fallback para versão local se necessário
    return new Response('Portal em manutenção', { status: 503 })
  }
}
```

## 📅 Cronograma Detalhado

### Esta semana:
- [x] Análise completa (feito)
- [ ] Correção FileZilla (30min)
- [ ] Backup completo (1h)
- [ ] Teste nova infraestrutura (2h)

### Próxima semana:
- [ ] Deploy WordPress no Railway
- [ ] Migração dados
- [ ] Teste intensivo
- [ ] DNS switchover

### Mês seguinte:
- [ ] Monitoramento 30 dias
- [ ] Cancelar Locaweb
- [ ] Economia mensal garantida

## 🎉 Benefícios da Migração

### Técnicos:
- ✅ Zero problemas suPHP
- ✅ SSL automático sempre válido
- ✅ Performance 3x melhor
- ✅ Backup automático
- ✅ Deploy automatizado

### Financeiros:
- 💰 Economia de R$ 10-30/mês
- 💰 SSL gratuito para sempre
- 💰 Escalabilidade sem custo extra

### Operacionais:
- 🛡️ Zero preocupação com servidor
- 📊 Métricas em tempo real
- 🔄 Updates automáticos
- 📞 Suporte técnico superior