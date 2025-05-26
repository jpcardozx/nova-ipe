# Guia de Implementação de Server Actions

Este guia fornece instruções detalhadas sobre como atualizar os formulários para usar Server Actions no projeto Nova Ipê.

## O que são Server Actions?

Server Actions são funções que executam no servidor e podem ser chamadas diretamente dos formulários ou componentes do cliente. Isso permite um processamento de formulários mais seguro e eficiente, sem a necessidade de APIs separadas.

## Benefícios

- **Segurança aprimorada**: validação e processamento de dados no servidor
- **Melhor desempenho**: redução de JavaScript no cliente
- **Tipagem segura**: validação com Zod
- **Experiência progressiva**: funciona mesmo com JavaScript desabilitado

## Como implementar

### 1. Formulário básico com Server Action

```jsx
// Em um arquivo de componente
'use client';

import { handleContactForm } from '@/app/actions/formActions';
import { useState } from 'react';

export function ContatoForm() {
  const [state, setState] = useState({ message: '', success: false });

  async function clientAction(formData: FormData) {
    const result = await handleContactForm(formData);
    setState(result);
  }

  return (
    <form action={clientAction}>
      <div className="mb-4">
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
      >
        Enviar mensagem
      </button>

      {state.message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
```

### 2. Formulário com submissão otimista e feedback de loading

```jsx
'use client';

import { handlePropertyInquiry } from '@/app/actions/formActions';
import { useState, useTransition } from 'react';

export function PropertyInquiryForm({ propertyId }) {
  const [state, setState] = useState({ message: '', success: false });
  const [isPending, startTransition] = useTransition();

  function clientAction(formData: FormData) {
    // Otimista UI - reset de estado
    setState({ message: '', success: false });

    // Iniciar a transição de estado
    startTransition(async () => {
      const result = await handlePropertyInquiry(formData);
      setState(result);
    });
  }

  return (
    <form action={clientAction}>
      <input type="hidden" name="propertyId" value={propertyId} />

      {/* Campos do formulário... */}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        disabled={isPending}
      >
        {isPending ? 'Enviando...' : 'Solicitar informações'}
      </button>

      {state.message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
```

### 3. Migração de API routes para Server Actions

**Antes (pages/api/contact.js)**:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    // Processar dados...

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Depois (app/actions/formActions.ts)**:

```ts
'use server';

export async function handleContactForm(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    // Processar dados...

    return { success: true, message: 'Sucesso!' };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, message: 'Erro ao processar o formulário' };
  }
}
```

### 4. Tratamento de erros e validação

Utilize o Zod para validação robusta de dados:

```ts
'use server';

import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  mensagem: z.string().min(10, 'Mensagem muito curta').max(500, 'Mensagem muito longa'),
});

export async function handleContactForm(formData: FormData) {
  try {
    const data = schema.parse(Object.fromEntries(formData.entries()));
    // Processar dados validados...

    return { success: true, message: 'Sucesso!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retornar erros específicos de validação
      return {
        success: false,
        errors: error.errors,
        message: 'Por favor, corrija os campos destacados.',
      };
    }

    return { success: false, message: 'Erro ao processar o formulário' };
  }
}
```

## Lista de Formulários a Serem Migrados

1. ✅ `FormularioContato` - `/app/components/FormularioContato.tsx`
2. ⬜ `PropertyInquiryForm` - `/app/components/PropertyInquiryForm.tsx`
3. ⬜ `ScheduleVisitForm` - `/app/components/ScheduleVisitForm.tsx`
4. ⬜ `NewsletterSignup` - `/app/components/NewsletterSignup.tsx`
5. ⬜ `LeadGenForm` - `/app/components/LeadGenForm.tsx`

## Melhores Práticas

1. **Segurança**

   - Sempre valide os dados no servidor
   - Utilize CSRF protection (embutido nos Server Actions)
   - Mantenha dados sensíveis apenas no servidor

2. **UX**

   - Forneça feedback imediato ao usuário durante submissões
   - Implemente UI otimista quando apropriado
   - Garanta que os formulários funcionem mesmo sem JavaScript

3. **Performance**

   - Use revalidatePath/revalidateTag para atualizar o cache quando necessário
   - Considere implementar debouncing para submissões frequentes
   - Implemente rate limiting para prevenir abusos

4. **Acessibilidade**
   - Mantenha labels associados a campos de formulário
   - Forneça mensagens de erro claras e acessíveis
   - Assegure que os formulários sejam navegáveis por teclado
