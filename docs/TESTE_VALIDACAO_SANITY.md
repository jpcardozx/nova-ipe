# 🧪 TESTE DE VALIDAÇÃO - QUERIES SANITY

## Comandos para Teste Manual

### 1. **Teste das Queries no Console do Browser**

Abra o DevTools e execute:

```javascript
// Teste query de venda
console.log('🔍 Testando query de venda...');
fetch('/api/test-sanity-venda')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Imóveis de venda:', data.length);
    console.log('📊 Campos presentes no primeiro item:', Object.keys(data[0] || {}));

    // Verificar campos críticos
    data.forEach((item, i) => {
      if (i < 3) {
        // Primeiros 3 itens
        console.log(`Item ${i + 1}:`, {
          id: item._id,
          titulo: item.titulo,
          dormitorios: item.dormitorios,
          banheiros: item.banheiros,
          vagas: item.vagas,
          areaUtil: item.areaUtil,
        });
      }
    });
  })
  .catch(err => console.error('❌ Erro:', err));

// Teste query de aluguel
console.log('🔍 Testando query de aluguel...');
fetch('/api/test-sanity-aluguel')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Imóveis de aluguel:', data.length);
    console.log('📊 Campos presentes no primeiro item:', Object.keys(data[0] || {}));

    // Verificar campos críticos
    data.forEach((item, i) => {
      if (i < 3) {
        // Primeiros 3 itens
        console.log(`Item ${i + 1}:`, {
          id: item._id,
          titulo: item.titulo,
          dormitorios: item.dormitorios,
          banheiros: item.banheiros,
          vagas: item.vagas,
          areaUtil: item.areaUtil,
        });
      }
    });
  })
  .catch(err => console.error('❌ Erro:', err));
```

### 2. **Verificação dos Logs no Console do Servidor**

Procure por estas mensagens no console:

```
✅ LOGS ESPERADOS:
🔍 Executando query Sanity: { query: "...", params: {}, tags: ["imoveis", "venda"] }
✅ Query Sanity executada com sucesso: { resultCount: 15, tags: ["imoveis", "venda"] }
📋 Buscando imóveis para venda...
🔄 Mapeando 15 imóveis de venda...
🔄 Transformando imóvel: { id: "...", titulo: "...", dormitorios: 3, banheiros: 2, vagas: 2 }

❌ LOGS DE ERRO (não devem aparecer):
⚠️ Dormitórios ausente: abc123 Casa sem dados
⚠️ Banheiros ausente: abc123 Casa sem dados
❌ Erro na query Sanity: { error: ..., query: "...", params: {} }
```

### 3. **Teste Visual na Interface**

#### **Na Seção de Imóveis para Venda:**

- [ ] Cards exibem dormitórios 🛏️
- [ ] Cards exibem banheiros 🛁
- [ ] Cards exibem vagas 🚗
- [ ] Cards exibem área útil 📐
- [ ] Preços formatados corretamente
- [ ] Imagens carregam sem erro

#### **Na Seção de Imóveis para Aluguel:**

- [ ] Cards exibem dormitórios 🛏️
- [ ] Cards exibem banheiros 🛁
- [ ] Cards exibem vagas 🚗
- [ ] Cards exibem área útil 📐
- [ ] Preços formatados corretamente
- [ ] Imagens carregam sem erro

### 4. **Verificação da Paleta de Cores**

#### **Cores CORRETAS (Ipê Brand):**

- [ ] `bg-amber-500` ✅
- [ ] `bg-orange-500` ✅
- [ ] `text-amber-600` ✅
- [ ] `from-amber-50 to-orange-50` ✅

#### **Cores INCORRETAS (não devem aparecer):**

- [ ] `bg-blue-500` ❌
- [ ] `text-blue-600` ❌
- [ ] `from-slate-50 to-blue-50` ❌

## ⚙️ Arquivos para Monitorar

### **1. Queries (lib/queries.ts)**

```groq
// Verificar se estão assim:
finalidade == "Venda"    ✅ (não "venda")
finalidade == "Aluguel"  ✅ (não "aluguel")

// Campos obrigatórios:
dormitorios,  ✅
banheiros,    ✅
vagas,        ✅
areaUtil,     ✅
```

### **2. Transformer (lib/unified-property-transformer.ts)**

```typescript
// Deve logar:
console.log('🔄 Transformando imóvel:', {
  id: imovel._id,
  titulo: imovel.titulo,
  dormitorios: imovel.dormitorios, // ✅ Deve ter valor
  banheiros: imovel.banheiros, // ✅ Deve ter valor
  vagas: imovel.vagas, // ✅ Deve ter valor
});
```

### **3. Fetch Functions (lib/sanity/fetchImoveis.ts)**

```typescript
// Deve logar:
📋 Buscando imóveis para venda...
🔄 Mapeando X imóveis de venda...

// Não deve logar warnings:
⚠️ Dormitórios ausente: ...
⚠️ Banheiros ausente: ...
```

## 🔧 Troubleshooting

### **Problema: Campos undefined**

```typescript
// Verificar no Sanity Studio se os campos existem
// Verificar na query se estão incluídos
// Verificar no mapeamento se estão sendo passados
```

### **Problema: Query syntax error**

```groq
// Verificar vírgulas:
field1,
field2,    // ✅ Vírgula presente
field3     // ✅ Último sem vírgula

// Verificar chaves:
objeto {
  campo1,
  campo2
}  // ✅ Fechamento correto
```

### **Problema: Paleta incorreta**

```bash
# Buscar e substituir:
grep -r "blue-500" app/sections/
grep -r "slate.*blue" app/sections/

# Substituir por:
amber-500, orange-500
```

---

**🎯 Checklist de Validação Completo para garantir funcionamento correto do sistema Sanity.**
