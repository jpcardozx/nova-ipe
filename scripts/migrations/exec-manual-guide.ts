#!/usr/bin/env tsx
/**
 * 🚀 Executor Final - Migration via Supabase Client
 * 
 * Executa SQL diretamente usando o pool de conexões do Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const MIGRATION_FILE = path.join(__dirname, '../../supabase/migrations/20250108_create_aliquotas_tables.sql');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(msg: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🚀 EXECUTOR FINAL - MIGRATION ALÍQUOTAS                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  // Validar
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log('❌ Variáveis de ambiente não configuradas\n', 'red');
    process.exit(1);
  }
  
  log('✅ Ambiente validado', 'green');
  log(`   URL: ${SUPABASE_URL}`, 'cyan');
  log(`   Key: ${SUPABASE_KEY.substring(0, 20)}...\n`, 'cyan');
  
  // Ler SQL
  log('📖 Lendo migration file...', 'cyan');
  const sql = await fs.readFile(MIGRATION_FILE, 'utf-8');
  const lines = sql.split('\n').length;
  log(`   ✅ ${lines} linhas carregadas\n`, 'green');
  
  // Criar client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  log('🔗 Testando conexão...', 'cyan');
  
  try {
    // Testa com uma query simples
    const { data, error } = await supabase
      .from('crm_clients')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    log('   ✅ Conexão OK\n', 'green');
  } catch (error: any) {
    log(`   ❌ Erro: ${error.message}\n`, 'red');
    process.exit(1);
  }
  
  // Informar que vai executar via dashboard
  log('═'.repeat(63), 'yellow');
  log('⚠️  IMPORTANTE:', 'yellow');
  log('═'.repeat(63), 'yellow');
  console.log('\nO Supabase REST API não suporta execução arbitrária de SQL.');
  console.log('A migration precisa ser executada via Supabase Dashboard.\n');
  
  log('📋 INSTRUÇÕES:', 'cyan');
  console.log('\n1. Acesse: https://supabase.com/dashboard\n');
  console.log('2. Selecione o projeto: ifhfpaehnjpdwdocdzwd\n');
  console.log('3. Vá em: SQL Editor → New Query\n');
  console.log('4. Copie o conteúdo de:');
  log('   supabase/migrations/20250108_create_aliquotas_tables.sql\n', 'cyan');
  console.log('5. Cole no editor e clique em RUN\n');
  console.log('6. Verifique se executou com sucesso\n');
  console.log('7. Depois execute:');
  log('   pnpm migration:aliquotas:verify\n', 'cyan');
  
  log('═'.repeat(63), 'yellow');
  
  // Oferecer copiar para clipboard
  log('\n💡 TIP: O arquivo de migration está pronto em:', 'cyan');
  log(`   ${MIGRATION_FILE}`, 'cyan');
  log(`\n   Tamanho: ${(sql.length / 1024).toFixed(1)} KB`, 'cyan');
  log(`   Linhas: ${lines}`, 'cyan');
  
  // Mostrar primeiras linhas como preview
  log('\n📄 Preview (primeiras 10 linhas):', 'cyan');
  log('─'.repeat(63), 'yellow');
  console.log(sql.split('\n').slice(0, 10).join('\n'));
  log('─'.repeat(63) + '\n', 'yellow');
  
  log('🎯 Aguardando execução manual via Dashboard...', 'yellow');
  log('   Depois execute: pnpm migration:aliquotas:verify\n', 'yellow');
}

main().catch(console.error);
