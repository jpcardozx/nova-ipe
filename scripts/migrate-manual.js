#!/usr/bin/env node

/**
 * Script de Migração Manual - CRM + Gestão de Documentos
 * Como o JavaScript não pode executar DDL diretamente no Supabase,
 * este script fornece instruções claras para migração manual
 */

const fs = require('fs')
const path = require('path')

console.log('🏗️  MIGRAÇÃO DO SISTEMA CRM + GESTÃO DE DOCUMENTOS\n')

// Verificar se o arquivo SQL existe
const sqlPath = path.join(__dirname, '..', 'sql', 'complete_migration.sql')

if (!fs.existsSync(sqlPath)) {
    console.error('❌ Arquivo de migração não encontrado:', sqlPath)
    console.error('Execute o assistente novamente para criar os arquivos necessários')
    process.exit(1)
}

const sqlContent = fs.readFileSync(sqlPath, 'utf8')
const lineCount = sqlContent.split('\n').length

console.log('✅ Arquivo SQL encontrado:')
console.log(`   📄 ${sqlPath}`)
console.log(`   📊 ${lineCount} linhas de código SQL`)
console.log(`   📝 Schema completo com 10 tabelas integradas\n`)

console.log('🚀 INSTRUÇÕES PARA MIGRAÇÃO MANUAL:\n')

console.log('1️⃣  ACESSE O SUPABASE DASHBOARD')
console.log('   • Acesse: https://supabase.com/dashboard')
console.log('   • Login na sua conta')
console.log('   • Selecione seu projeto\n')

console.log('2️⃣  ABRA O SQL EDITOR')
console.log('   • Clique em "SQL Editor" no menu lateral')
console.log('   • Clique em "New Query" para criar nova query\n')

console.log('3️⃣  COPIE E EXECUTE O SCHEMA')
console.log('   • Abra o arquivo: sql/complete_migration.sql')
console.log('   • Copie todo o conteúdo (Ctrl+A, Ctrl+C)')
console.log('   • Cole no SQL Editor do Supabase (Ctrl+V)')
console.log('   • Clique em "Run" ou pressione Ctrl+Enter\n')

console.log('4️⃣  CONFIGURE O STORAGE')
console.log('   • Vá em "Storage" no menu lateral')
console.log('   • Clique em "Create bucket"')
console.log('   • Nome: "documents"')
console.log('   • Marque "Public bucket" = false')
console.log('   • Clique em "Save"\n')

console.log('5️⃣  CONFIGURE AS POLÍTICAS RLS')
console.log('   • No Storage, clique no bucket "documents"')
console.log('   • Vá em "Policies"')
console.log('   • Execute as seguintes políticas:\n')

console.log('   📝 POLÍTICA DE UPLOAD:')
console.log(`   CREATE POLICY "Users can upload documents" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'documents');`)

console.log('\n   📝 POLÍTICA DE DOWNLOAD:')
console.log(`   CREATE POLICY "Users can download documents" ON storage.objects
   FOR SELECT USING (bucket_id = 'documents');\n`)

console.log('6️⃣  VERIFIQUE A MIGRAÇÃO')
console.log('   • Vá em "Table Editor"')
console.log('   • Confirme que as seguintes tabelas foram criadas:')

const expectedTables = [
    'document_types',
    'document_management_leads', 
    'lead_activities',
    'properties',
    'contracts',
    'documents',
    'document_versions',
    'document_tasks',
    'document_shares',
    'document_comments'
]

expectedTables.forEach((table, index) => {
    console.log(`   ${index + 1}. ✅ ${table}`)
})

console.log('\n7️⃣  CONFIGURE AS VARIÁVEIS DE AMBIENTE')
console.log('   • Copie as credenciais do seu projeto Supabase')
console.log('   • Crie um arquivo .env.local com:')
console.log(`
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
`)

console.log('8️⃣  TESTE O SISTEMA')
console.log('   • Execute: npm run dev')
console.log('   • Acesse: http://localhost:3000/crm-system')
console.log('   • Teste upload de documentos')
console.log('   • Verifique criação de leads\n')

console.log('💡 DICAS IMPORTANTES:')
console.log('   • O SQL script é idempotente (pode executar múltiplas vezes)')
console.log('   • Todas as tabelas têm IF NOT EXISTS')
console.log('   • RLS está configurado para segurança')
console.log('   • Triggers automáticos para logs e versionamento')
console.log('   • Views otimizadas para dashboard\n')

console.log('🔧 COMANDOS ALTERNATIVOS (se tiver Supabase CLI):')
console.log('   supabase login')
console.log('   supabase link --project-ref SEU-PROJECT-REF')
console.log('   supabase db reset')
console.log('   supabase db push\n')

console.log('📚 ARQUIVOS DO SISTEMA:')
console.log('   📄 sql/complete_migration.sql - Schema principal')
console.log('   🎣 app/hooks/useIntegratedCRM.ts - Hook React')
console.log('   🧩 app/components/business/IntegratedDashboard.tsx - Dashboard')
console.log('   📁 app/components/modern/DocumentManagerNew.tsx - Gestão docs')
console.log('   🔧 app/lib/supabase/integrated-service.ts - Serviços')
console.log('   🌐 app/crm-system/page.tsx - Página principal\n')

console.log('🎯 FUNCIONALIDADES DISPONÍVEIS APÓS MIGRAÇÃO:')
console.log('   ✅ CRM completo com pipeline de leads')
console.log('   ✅ Upload de documentos no servidor')
console.log('   ✅ Workflow automático de aprovação')
console.log('   ✅ Sistema de tarefas integrado')
console.log('   ✅ Dashboard com métricas em tempo real')
console.log('   ✅ Versionamento automático de documentos')
console.log('   ✅ Log de atividades completo')
console.log('   ✅ Assinatura digital integrada\n')

console.log('🚨 PROBLEMAS COMUNS:')
console.log('   • Erro "relation does not exist" → Execute o SQL completo')
console.log('   • Erro de upload → Verifique bucket "documents" criado')
console.log('   • Erro de permissão → Configure políticas RLS')
console.log('   • Erro de conexão → Verifique variáveis de ambiente\n')

console.log('✅ Migração manual preparada!')
console.log('📖 Siga as instruções acima para configurar o banco de dados')
console.log('🎉 Em caso de dúvidas, consulte a documentação em docs/CRM_INTEGRATED_SYSTEM.md')

// Verificar se há dados de teste
if (sqlContent.includes('INSERT INTO document_management_leads')) {
    console.log('\n💾 DADOS DE TESTE INCLUÍDOS:')
    console.log('   • Leads de exemplo serão criados')
    console.log('   • Propriedades de demonstração')
    console.log('   • Tipos de documento pré-configurados')
}
