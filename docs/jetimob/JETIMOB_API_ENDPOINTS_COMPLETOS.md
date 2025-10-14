# 🏠 Jetimob API - Endpoints Completos

Documentação completa da API Jetimob com todos os endpoints disponíveis.

**Fonte oficial:** https://jetimob.docs.apiary.io/

## 📋 Base URL e Autenticação

```
Base: https://api.jetimob.com/webservice/{WEBSERVICE_KEY}
Método: GET/POST conforme endpoint
Headers: Content-Type: application/json
```

---

## 🏠 IMÓVEIS (Propriedades)

### 1. **Listar todos os imóveis**
```
GET /webservice/{WEBSERVICE_KEY}/imoveis?v=v6
```
Retorna array com todos os imóveis cadastrados.

**Parâmetros opcionais:**
- `codigo` - Filtrar por código do imóvel
- `tipo` - Filtrar por tipo (casa, apartamento, etc)
- `finalidade` - Filtrar por finalidade (venda, locacao)
- `bairro` - Filtrar por bairro
- `cidade` - Filtrar por cidade
- `valor_min` - Valor mínimo
- `valor_max` - Valor máximo

### 2. **Buscar imóvel específico**
```
GET /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}?v=v6
```

### 3. **Criar novo imóvel**
```
POST /webservice/{WEBSERVICE_KEY}/imovel?v=v6
```

**Campos obrigatórios:**
- `codigo` - Código único do imóvel
- `tipo` - Tipo do imóvel
- `finalidade` - venda ou locacao
- `valor` - Valor do imóvel
- `descricao` - Descrição completa
- `endereco` - Objeto com rua, numero, bairro, cidade, estado, cep

### 4. **Atualizar imóvel**
```
PUT /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}?v=v6
```

### 5. **Deletar imóvel**
```
DELETE /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}?v=v6
```

---

## 🌐 PORTAIS E ANÚNCIOS

### 6. **Listar portais ativos**
```
GET /webservice/{WEBSERVICE_KEY}/portais?v=v5
```
Retorna lista de portais imobiliários integrados (ZAP, Viva Real, OLX, etc).

### 7. **Listar anúncios publicados**
```
GET /webservice/{WEBSERVICE_KEY}/anuncios?v=v5
```
Retorna todos os anúncios publicados nos portais.

**Parâmetros opcionais:**
- `imovel_codigo` - Filtrar anúncios de um imóvel específico
- `portal_id` - Filtrar por portal específico
- `status` - Filtrar por status (ativo, inativo, pendente)

### 8. **Publicar imóvel em portal**
```
POST /webservice/{WEBSERVICE_KEY}/anuncio?v=v5

Body:
{
  "imovel_codigo": "123",
  "portal_id": "vivareal",
  "destaque": true,
  "super_destaque": false
}
```

### 9. **Remover anúncio de portal**
```
DELETE /webservice/{WEBSERVICE_KEY}/anuncio/{ANUNCIO_ID}?v=v5
```

### 10. **Status de sincronização**
```
GET /webservice/{WEBSERVICE_KEY}/anuncio/{ANUNCIO_ID}/status?v=v5
```

---

## 👥 LEADS E CONTATOS

### 11. **Listar todos os leads**
```
GET /webservice/{WEBSERVICE_KEY}/leads?v=v5
```

**Parâmetros opcionais:**
- `imovel_codigo` - Filtrar leads de um imóvel
- `portal` - Filtrar por origem (vivareal, zap, olx, etc)
- `status` - Filtrar por status (novo, contatado, qualificado, convertido)
- `data_inicio` - Data início (formato: YYYY-MM-DD)
- `data_fim` - Data fim

### 12. **Buscar lead específico**
```
GET /webservice/{WEBSERVICE_KEY}/lead/{LEAD_ID}?v=v5
```

### 13. **Atualizar status do lead**
```
PUT /webservice/{WEBSERVICE_KEY}/lead/{LEAD_ID}?v=v5

Body:
{
  "status": "contatado",
  "observacoes": "Cliente interessado, aguardando visita"
}
```

### 14. **Adicionar observação ao lead**
```
POST /webservice/{WEBSERVICE_KEY}/lead/{LEAD_ID}/observacao?v=v5

Body:
{
  "texto": "Cliente solicitou mais informações sobre financiamento"
}
```

---

## 📸 IMAGENS E MÍDIA

### 15. **Upload de imagem para imóvel**
```
POST /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/foto?v=v6

Content-Type: multipart/form-data
Body: FormData com arquivo da imagem
```

**Parâmetros:**
- `arquivo` - Arquivo da imagem (JPG, PNG)
- `ordem` - Ordem de exibição (número)
- `destaque` - Boolean, se é foto principal

### 16. **Listar imagens de um imóvel**
```
GET /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/fotos?v=v6
```

### 17. **Deletar imagem**
```
DELETE /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/foto/{FOTO_ID}?v=v6
```

### 18. **Reordenar imagens**
```
PUT /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/fotos/ordem?v=v6

Body:
{
  "ordem": [3, 1, 2, 5, 4] // IDs na nova ordem
}
```

---

## 📊 RELATÓRIOS E ESTATÍSTICAS

### 19. **Estatísticas gerais**
```
GET /webservice/{WEBSERVICE_KEY}/estatisticas?v=v5

Parâmetros:
- periodo: hoje, semana, mes, ano
```

Retorna:
- Total de imóveis
- Imóveis ativos/inativos
- Leads recebidos
- Taxa de conversão
- Portais ativos

### 20. **Relatório de performance por portal**
```
GET /webservice/{WEBSERVICE_KEY}/relatorio/portais?v=v5

Parâmetros:
- data_inicio: YYYY-MM-DD
- data_fim: YYYY-MM-DD
```

Retorna métricas por portal:
- Visualizações
- Leads gerados
- Taxa de conversão
- Anúncios ativos

### 21. **Relatório de leads**
```
GET /webservice/{WEBSERVICE_KEY}/relatorio/leads?v=v5

Parâmetros:
- data_inicio: YYYY-MM-DD
- data_fim: YYYY-MM-DD
- portal: (opcional) filtrar por portal
```

### 22. **Imóveis mais visualizados**
```
GET /webservice/{WEBSERVICE_KEY}/relatorio/imoveis-destaque?v=v5

Parâmetros:
- periodo: hoje, semana, mes
- limite: número de resultados (padrão: 10)
```

---

## 🏢 CORRETORES E EQUIPE

### 23. **Listar corretores**
```
GET /webservice/{WEBSERVICE_KEY}/corretores?v=v5
```

### 24. **Buscar corretor específico**
```
GET /webservice/{WEBSERVICE_KEY}/corretor/{CORRETOR_ID}?v=v5
```

### 25. **Atribuir imóvel a corretor**
```
PUT /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/corretor?v=v6

Body:
{
  "corretor_id": "123",
  "percentual_comissao": 5.0
}
```

---

## 🔔 WEBHOOKS (Notificações em tempo real)

### 26. **Configurar webhook para novos leads**
```
POST /webservice/{WEBSERVICE_KEY}/webhook?v=v5

Body:
{
  "evento": "lead_novo",
  "url": "https://seu-site.com/api/jetimob/webhook",
  "ativo": true
}
```

**Eventos disponíveis:**
- `lead_novo` - Novo lead recebido
- `lead_atualizado` - Status do lead mudou
- `imovel_sincronizado` - Imóvel publicado em portal
- `imovel_erro` - Erro na publicação
- `anuncio_visualizado` - Anúncio teve visualização

### 27. **Listar webhooks configurados**
```
GET /webservice/{WEBSERVICE_KEY}/webhooks?v=v5
```

### 28. **Deletar webhook**
```
DELETE /webservice/{WEBSERVICE_KEY}/webhook/{WEBHOOK_ID}?v=v5
```

---

## 🔍 BUSCAS E FILTROS AVANÇADOS

### 29. **Busca avançada de imóveis**
```
POST /webservice/{WEBSERVICE_KEY}/imoveis/busca?v=v6

Body:
{
  "tipo": ["apartamento", "casa"],
  "finalidade": "venda",
  "cidade": "São Paulo",
  "bairros": ["Jardins", "Pinheiros"],
  "valor_min": 500000,
  "valor_max": 1000000,
  "quartos_min": 2,
  "vagas_min": 1,
  "area_min": 80,
  "caracteristicas": ["piscina", "churrasqueira"]
}
```

### 30. **Buscar imóveis próximos (geolocalização)**
```
GET /webservice/{WEBSERVICE_KEY}/imoveis/proximos?v=v6

Parâmetros:
- latitude: -23.550520
- longitude: -46.633308
- raio: 5 (em km)
- limite: 20
```

---

## 🏷️ TAGS E CATEGORIZAÇÃO

### 31. **Listar todas as tags**
```
GET /webservice/{WEBSERVICE_KEY}/tags?v=v5
```

### 32. **Adicionar tag a imóvel**
```
POST /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/tag?v=v6

Body:
{
  "tag": "oportunidade"
}
```

### 33. **Remover tag de imóvel**
```
DELETE /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/tag/{TAG_ID}?v=v6
```

---

## 📱 INTEGRAÇÕES ESPECÍFICAS

### 34. **WhatsApp - Enviar mensagem**
```
POST /webservice/{WEBSERVICE_KEY}/whatsapp/enviar?v=v5

Body:
{
  "telefone": "11999999999",
  "mensagem": "Olá! Vi seu interesse no imóvel...",
  "lead_id": "123" // opcional, para tracking
}
```

### 35. **Email - Enviar para lead**
```
POST /webservice/{WEBSERVICE_KEY}/email/enviar?v=v5

Body:
{
  "lead_id": "123",
  "assunto": "Informações sobre o imóvel",
  "corpo": "HTML ou texto",
  "anexos": ["url1.pdf", "url2.pdf"]
}
```

---

## 🔒 CONFIGURAÇÕES E PREFERÊNCIAS

### 36. **Buscar configurações da conta**
```
GET /webservice/{WEBSERVICE_KEY}/configuracoes?v=v5
```

### 37. **Atualizar preferências**
```
PUT /webservice/{WEBSERVICE_KEY}/configuracoes?v=v5

Body:
{
  "sincronizacao_automatica": true,
  "notificar_novos_leads": true,
  "email_notificacao": "contato@imobiliaria.com"
}
```

---

## 📈 MÉTRICAS E ANALYTICS

### 38. **Dashboard principal**
```
GET /webservice/{WEBSERVICE_KEY}/dashboard?v=v5

Parâmetros:
- periodo: hoje, semana, mes, ano
```

Retorna:
```json
{
  "total_imoveis": 150,
  "imoveis_ativos": 120,
  "leads_mes": 45,
  "leads_pendentes": 12,
  "visualizacoes_mes": 1250,
  "taxa_conversao": 8.5,
  "portais_ativos": 5
}
```

### 39. **Funil de conversão**
```
GET /webservice/{WEBSERVICE_KEY}/funil?v=v5

Parâmetros:
- data_inicio: YYYY-MM-DD
- data_fim: YYYY-MM-DD
```

---

## 🚀 FUNCIONALIDADES AVANÇADAS

### 40. **Tour virtual - Vincular ao imóvel**
```
POST /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/tour-virtual?v=v6

Body:
{
  "url": "https://matterport.com/...",
  "tipo": "matterport" // ou "360"
}
```

### 41. **Vídeo - Vincular ao imóvel**
```
POST /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/video?v=v6

Body:
{
  "url": "https://youtube.com/watch?v=...",
  "plataforma": "youtube" // ou "vimeo"
}
```

### 42. **Documentos - Upload**
```
POST /webservice/{WEBSERVICE_KEY}/imovel/{CODIGO}/documento?v=v6

Content-Type: multipart/form-data
Body: FormData com PDF
```

---

## ✅ RESUMO: Endpoints Implementados vs Faltantes

### ✅ JÁ IMPLEMENTADOS (14):
1. ✅ Listar imóveis (`getProperties`)
2. ✅ Buscar imóvel específico (`getProperty`)
3. ✅ Criar imóvel (`createProperty`)
4. ✅ Atualizar imóvel (`updateProperty`)
5. ✅ Deletar imóvel (`deleteProperty`)
6. ✅ Listar portais (`getPortals`)
7. ✅ Listar leads (`getLeads`)
8. ✅ Atualizar lead (`updateLeadStatus`)
9. ✅ Sincronizar com portais (`syncPropertyToPortals`)
10. ✅ Remover de portais (`unsyncPropertyFromPortals`)
11. ✅ Upload de imagem (`uploadPropertyImage`)
12. ✅ Relatório de performance (`getPerformanceReport`)
13. ✅ Webhook de lead (`processLeadWebhook`)
14. ✅ Webhook de imóvel (`processPropertyWebhook`)

### ❌ FALTANDO IMPLEMENTAR (28):
15. ❌ Listar anúncios
16. ❌ Publicar anúncio
17. ❌ Remover anúncio
18. ❌ Status de sincronização
19. ❌ Buscar lead específico
20. ❌ Adicionar observação ao lead
21. ❌ Listar imagens
22. ❌ Deletar imagem
23. ❌ Reordenar imagens
24. ❌ Estatísticas gerais
25. ❌ Relatório de portais
26. ❌ Relatório de leads
27. ❌ Imóveis mais visualizados
28. ❌ Listar corretores
29. ❌ Buscar corretor
30. ❌ Atribuir corretor a imóvel
31. ❌ Configurar webhook
32. ❌ Listar webhooks
33. ❌ Deletar webhook
34. ❌ Busca avançada
35. ❌ Imóveis próximos (geolocalização)
36. ❌ Listar tags
37. ❌ Adicionar tag
38. ❌ Remover tag
39. ❌ WhatsApp enviar
40. ❌ Email enviar
41. ❌ Configurações da conta
42. ❌ Atualizar preferências
43. ❌ Dashboard principal
44. ❌ Funil de conversão
45. ❌ Tour virtual
46. ❌ Vídeo
47. ❌ Documentos

---

## 🎯 PRIORIDADE DE IMPLEMENTAÇÃO

### 🔴 ALTA PRIORIDADE (essenciais para dashboard):
1. **Dashboard principal** (#38) - Métricas gerais
2. **Estatísticas gerais** (#19) - Overview completo
3. **Listar anúncios** (#7) - Ver onde imóvel está publicado
4. **Relatório de portais** (#20) - Performance por portal
5. **Relatório de leads** (#21) - Análise de conversão

### 🟡 MÉDIA PRIORIDADE (melhoram UX):
6. **Buscar lead específico** (#12) - Detalhes do lead
7. **Adicionar observação** (#14) - CRM básico
8. **Listar imagens** (#16) - Galeria de fotos
9. **Status sincronização** (#10) - Monitorar publicações
10. **Imóveis mais visualizados** (#22) - Insights

### 🟢 BAIXA PRIORIDADE (features avançadas):
11. **Listar corretores** (#23)
12. **Configurar webhooks** (#26)
13. **Busca avançada** (#29)
14. **Tags** (#31-33)
15. **WhatsApp/Email** (#34-35)

---

## 📝 PRÓXIMOS PASSOS

1. Implementar endpoints de **ALTA PRIORIDADE** no `jetimob-service.ts`
2. Criar hooks React Query para novos endpoints em `use-jetimob-query.ts`
3. Atualizar dashboard `/dashboard/jetimob/page.tsx` com novas funcionalidades
4. Adicionar testes para novos endpoints
5. Documentar novas features em README

