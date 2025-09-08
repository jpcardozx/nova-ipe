require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📚 Executando migração CloudStorage...');

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // Testar se já tem permissão para criar tabelas
    const { data, error } = await supabase
      .from('cloud_folders')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('not find the table')) {
      console.log('❌ Tabela cloud_folders não existe');
      console.log('💡 Você precisa executar o script SQL no painel do Supabase:');
      console.log('📝 sql/complete_migration.sql (linhas 219-233)');
      console.log('');
      console.log('🔧 Ou criar manualmente no SQL Editor:');
      console.log(`
CREATE TABLE cloud_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL UNIQUE,
    parent_path TEXT,
    description TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Tabela cloud_folders existe!');
    }
    
    // Verificar bucket de storage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Erro ao verificar buckets:', bucketsError.message);
    } else {
      const hasDocs = buckets?.some(b => b.name === 'documents');
      console.log('📁 Bucket "documents":', hasDocs ? 'Existe ✅' : 'Não existe ❌');
      
      if (!hasDocs) {
        console.log('💡 Você precisa criar o bucket "documents" no painel do Supabase Storage');
      }
    }
    
  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
})();
