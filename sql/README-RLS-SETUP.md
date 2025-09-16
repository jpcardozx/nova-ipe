# 🔒 Configuração RLS para Perfis de Funcionários

## 📋 Guia Passo-a-Passo

### 1. **Acesse o Supabase Dashboard**
- Entre no [dashboard do Supabase](https://supabase.com/dashboard)
- Selecione seu projeto
- Vá em **SQL Editor** (ícone de banco de dados na sidebar)

### 2. **Execute o Setup Básico**
```sql
-- Copie e cole o conteúdo do arquivo: setup-profiles-rls.sql
-- Execute linha por linha ou tudo de uma vez
```

### 3. **Teste se Funcionou**
Execute estes comandos para verificar:

```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Contar perfis visíveis
SELECT COUNT(*) FROM public.profiles;

-- Listar perfis (deve mostrar todos os funcionários)
SELECT id, email, name, role, department
FROM public.profiles
WHERE is_employee = true;
```

### 4. **Se Não Funcionar**
Execute as **políticas simplificadas**:

```sql
-- Política mais permissiva (para desenvolvimento)
DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;

CREATE POLICY "Allow authenticated users to view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);
```

### 5. **Verificação Final**
No **console do navegador**, execute o diagnóstico:
- Abra o TaskModal
- Clique em "🔍 Executar diagnóstico"
- Verifique os logs no console

---

## 🚨 Problemas Comuns e Soluções

### **Problema**: Só vejo meu próprio perfil
**Causa**: RLS muito restritivo
**Solução**:
```sql
-- Use a política mais permissiva
CREATE POLICY "Allow all authenticated" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);
```

### **Problema**: "permission denied for table profiles"
**Causa**: RLS sem políticas adequadas
**Solução**:
```sql
-- Verificar se RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política básica
CREATE POLICY "Basic access" ON public.profiles
    FOR SELECT USING (true);
```

### **Problema**: Tabela vazia
**Causa**: Nenhum perfil criado
**Solução**:
```sql
-- Inserir seu próprio perfil
INSERT INTO public.profiles (id, email, name, is_employee)
VALUES (auth.uid(), auth.email(), 'Seu Nome', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_employee = EXCLUDED.is_employee;
```

### **Problema**: Outros usuários não aparecem
**Causa**: Sem outros perfis na tabela
**Solução**:
```sql
-- Criar perfis de exemplo
INSERT INTO public.profiles (id, email, name, role, department, is_employee)
VALUES
    (gen_random_uuid(), 'gerente@exemplo.com', 'Gerente Exemplo', 'gerente', 'Administração', true),
    (gen_random_uuid(), 'vendedor@exemplo.com', 'Vendedor Exemplo', 'vendedor', 'Vendas', true)
ON CONFLICT (id) DO NOTHING;
```

---

## 🔧 Debug Avançado

### **Verificar Políticas Ativas**
```sql
SELECT policyname, permissive, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```

### **Testar como Usuário Específico**
```sql
-- Ver qual usuário está logado
SELECT auth.uid(), auth.email();

-- Testar acesso com condições
SELECT
    COUNT(*) as visible_profiles,
    auth.uid() as current_user
FROM public.profiles;
```

### **Reset Completo (Emergência)**
```sql
-- CUIDADO: Remove todas as restrições
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Para reabilitar depois
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.profiles FOR SELECT USING (true);
```

---

## ✅ Resultado Esperado

Após a configuração, você deve conseguir:

1. **Ver todos os funcionários** no dropdown do TaskModal
2. **Logs no console** mostrando múltiplos perfis carregados
3. **Contador** mostrando "X funcionário(s) encontrado(s)"
4. **Sem erros** de permissão nas queries

---

## 📞 Suporte

Se ainda não funcionar:

1. **Copie os logs** do console do navegador
2. **Execute** `SELECT * FROM public.debug_user_access();` no SQL Editor
3. **Verifique** se a tabela `profiles` tem dados: `SELECT COUNT(*) FROM public.profiles;`
4. **Compartilhe** os resultados para debug adicional

---

**💡 Dica**: Comece sempre com as políticas mais permissivas e vá restringindo conforme necessário!