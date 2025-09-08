require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  console.log('🔍 Verificando CRM e Cloud no Supabase...');
  
  try {
    // Verificar tabelas CRM
    const tables = ['leads', 'clients', 'properties', 'contracts', 'tasks'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      console.log(`📊 Tabela ${table}: ${error ? 'Erro - ' + error.message : 'OK (' + (data?.length || 0) + ' registros)'}`);
    }
    
    // Verificar storage real
    const { data: files, error: filesError } = await supabase.storage.from('documents').list('', { limit: 100 });
    const totalFiles = files?.length || 0;
    const totalSize = files?.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) || 0;
    
    console.log('');
    console.log('☁️ Cloud Storage Real:');
    console.log(`- Arquivos: ${totalFiles}`);
    console.log(`- Tamanho total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Erro: ${filesError ? filesError.message : 'Nenhum'}`);
    
  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
})();
