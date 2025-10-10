#!/usr/bin/env tsx
/**
 * 🔧 Executor SQL Direto - Supabase
 * 
 * Executa SQL diretamente no Supabase usando a REST API
 * Alternativa quando o método rpc() não está disponível
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const MIGRATION_FILE = path.join(__dirname, '../../supabase/migrations/20250108_create_aliquotas_tables.sql');

async function executeSqlDirect(sql: string): Promise<void> {
  console.log('🚀 Executando SQL direto via Supabase Client...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  // Split em statements
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s !== '');
  
  console.log(`📝 Total de statements: ${statements.length}\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Detecta tipo de statement
    const type = detectStatementType(statement);
    
    try {
      // Para CREATE TABLE, usa uma abordagem diferente
      if (type === 'CREATE_TABLE') {
        const tableName = extractTableName(statement);
        console.log(`📦 [${i + 1}/${statements.length}] Criando tabela: ${tableName}`);
      } else {
        console.log(`⚙️  [${i + 1}/${statements.length}] Executando: ${type}`);
      }
      
      // Executa via query builder
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: statement + ';' 
      });
      
      if (error) {
        throw error;
      }
      
      successCount++;
      console.log(`   ✅ OK\n`);
    } catch (error: any) {
      errorCount++;
      console.log(`   ❌ ERRO: ${error.message}\n`);
      
      // Log do statement para debug
      if (process.argv.includes('--verbose')) {
        console.log(`   Statement: ${statement.substring(0, 200)}...\n`);
      }
      
      // Para em erros críticos (CREATE TABLE)
      if (type === 'CREATE_TABLE') {
        throw new Error(`Erro crítico ao criar tabela. Abortando.`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 RESULTADO:`);
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log('='.repeat(60) + '\n');
  
  if (errorCount > 0) {
    throw new Error('Migration completou com erros');
  }
}

function detectStatementType(sql: string): string {
  const upper = sql.toUpperCase().trim();
  
  if (upper.startsWith('CREATE TABLE')) return 'CREATE_TABLE';
  if (upper.startsWith('CREATE INDEX')) return 'CREATE_INDEX';
  if (upper.startsWith('CREATE TRIGGER')) return 'CREATE_TRIGGER';
  if (upper.startsWith('CREATE FUNCTION')) return 'CREATE_FUNCTION';
  if (upper.startsWith('CREATE OR REPLACE FUNCTION')) return 'CREATE_FUNCTION';
  if (upper.startsWith('CREATE VIEW')) return 'CREATE_VIEW';
  if (upper.startsWith('ALTER TABLE')) return 'ALTER_TABLE';
  if (upper.startsWith('INSERT INTO')) return 'INSERT';
  if (upper.startsWith('COMMENT ON')) return 'COMMENT';
  
  return 'OTHER';
}

function extractTableName(sql: string): string {
  const match = sql.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
  return match ? match[1] : 'unknown';
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  🔧 EXECUTOR SQL DIRETO - ALÍQUOTAS                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // Validar ambiente
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Variáveis de ambiente não configuradas');
    console.error('   Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY\n');
    process.exit(1);
  }
  
  // Ler migration
  console.log('📖 Lendo migration file...');
  const sql = await fs.readFile(MIGRATION_FILE, 'utf-8');
  const lines = sql.split('\n').length;
  console.log(`   ✅ ${lines} linhas carregadas\n`);
  
  // Executar
  try {
    await executeSqlDirect(sql);
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✨ MIGRATION CONCLUÍDA COM SUCESSO! ✨              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error: any) {
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║  💥 MIGRATION FALHOU                                  ║');
    console.error('╚════════════════════════════════════════════════════════╝\n');
    console.error(`❌ ${error.message}\n`);
    process.exit(1);
  }
}

main();
