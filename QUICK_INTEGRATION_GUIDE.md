# 🔧 Guia Rápido de Integração - Componentes Nova Ipê

## 📦 **Componentes Disponíveis**

### **FormularioContatoUnified** (Recomendado)

Formulário principal com 3 variações para diferentes contextos.

```tsx
import FormularioContatoUnified from '@/app/components/FormularioContatoUnified';

// Uso em página de contato geral
<FormularioContatoUnified variant="default" />

// Uso para investidores
<FormularioContatoUnified
  variant="premium"
  showInvestmentFields={true}
  title="Consultoria de Investimentos"
  subtitle="Análise personalizada gratuita"
/>

// Uso em páginas de aluguel
<FormularioContatoUnified
  variant="rental"
  title="Alugue Seu Imóvel"
  subtitle="Processo rápido e sem burocracia"
/>
```

### **ValorUnified** (Seção "Por que agora é diferente")

Seção moderna com métricas animadas e diferenciais competitivos.

```tsx
import ValorUnified from '@/app/sections/ValorUnified';

// Uso simples (recomendado)
<ValorUnified />

// Com estilo customizado
<ValorUnified className="py-32 bg-custom" />
```

### **FormularioContatoEnhanced** (Alternativo)

Versão com recursos visuais extras para casos específicos.

```tsx
import FormularioContatoEnhanced from '@/app/components/FormularioContatoEnhanced';

<FormularioContatoEnhanced
  variant="premium"
  showInvestmentFields={true}
  title="Experiência Premium"
/>;
```

---

## 🎨 **Classes CSS Padronizadas**

### **Gradientes Principais**

```css
/* CTAs e elementos principais */
bg-gradient-to-r from-amber-500 to-orange-600

/* Backgrounds sutis */
bg-gradient-to-br from-amber-50 to-orange-50

/* Textos premium */
bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent
```

### **Cores por Contexto**

```css
/* Premium/Investimentos */
text-amber-600, bg-amber-100, border-amber-200

/* Locação/Rental */
text-emerald-600, bg-emerald-100, border-emerald-200

/* Padrão/Default */
text-blue-600, bg-blue-100, border-blue-200
```

---

## 📱 **Responsividade**

Todos os componentes são responsivos. Use as classes Tailwind padrão:

```tsx
// Exemplo de responsividade
<div className="text-4xl lg:text-6xl py-12 lg:py-20">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{/* Conteúdo */}</div>
</div>
```

---

## ⚡ **Performance**

### **Lazy Loading**

```tsx
import dynamic from 'next/dynamic';

// Carregamento sob demanda
const FormularioContato = dynamic(() => import('@/app/components/FormularioContatoUnified'), {
  loading: () => <div className="animate-pulse bg-neutral-200 h-96 rounded-2xl" />,
});
```

### **Animações Otimizadas**

```tsx
// Use com moderação para manter performance
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Conteúdo */}
</motion.div>;
```

---

## 🔧 **Customização**

### **Props Disponíveis**

```tsx
interface ContactFormProps {
  className?: string; // Classes CSS extras
  variant?: 'default' | 'premium' | 'rental'; // Variação visual
  title?: string; // Título customizado
  subtitle?: string; // Subtítulo customizado
  showInvestmentFields?: boolean; // Campos de investimento
}
```

### **Exemplo de Customização Completa**

```tsx
<FormularioContatoUnified
  className="my-20"
  variant="premium"
  title="Título Personalizado"
  subtitle="Subtítulo explicativo personalizado"
  showInvestmentFields={true}
/>
```

---

## 🎯 **Onde Usar Cada Componente**

### **FormularioContatoUnified**

- ✅ Página de contato principal
- ✅ Landing pages
- ✅ Seções de conversão
- ✅ Modals de contato

### **ValorUnified**

- ✅ Home page (seção principal)
- ✅ Página "Sobre nós"
- ✅ Landing pages de serviços
- ✅ Páginas de conversão

### **FormularioContatoEnhanced**

- ✅ Campanhas especiais
- ✅ Páginas de alto valor
- ✅ A/B testing
- ✅ Eventos promocionais

---

## 🚀 **Deploy e Produção**

### **Checklist Pré-Deploy**

- [ ] Testar todos os formulários
- [ ] Validar responsividade
- [ ] Verificar animações em dispositivos móveis
- [ ] Confirmar integração com APIs
- [ ] Testar estados de erro/sucesso

### **Monitoramento**

```tsx
// Adicionar analytics aos formulários
const handleSubmit = async data => {
  // Track evento
  gtag('event', 'form_submit', {
    form_type: variant,
    page_url: window.location.href,
  });

  // Processar formulário
  await submitForm(data);
};
```

---

## 📞 **Integração com APIs**

### **Exemplo de Handler**

```tsx
const handleFormSubmit = async formData => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(true);
    }
  } catch (error) {
    setSubmitError(true);
  }
};
```

---

## 🎨 **Exemplos de Uso em Páginas**

### **Home Page**

```tsx
export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Por que agora é diferente */}
      <ValorUnified />

      {/* Formulário de contato */}
      <FormularioContatoUnified variant="default" />
    </main>
  );
}
```

### **Página de Investimentos**

```tsx
export default function InvestmentPage() {
  return (
    <main>
      {/* Conteúdo da página */}

      {/* Formulário especializado */}
      <FormularioContatoUnified
        variant="premium"
        showInvestmentFields={true}
        title="Consultoria de Investimentos"
        subtitle="Descubra as melhores oportunidades em Guararema"
      />
    </main>
  );
}
```

### **Página de Aluguel**

```tsx
export default function RentalPage() {
  return (
    <main>
      {/* Listagem de imóveis */}

      {/* Formulário de interesse */}
      <FormularioContatoUnified
        variant="rental"
        title="Interesse em Alugar?"
        subtitle="Fale conosco e encontre seu novo lar"
      />
    </main>
  );
}
```

---

**🎯 Componentes prontos para produção!**  
_Para dúvidas, consulte o relatório completo ou a documentação dos componentes._
