#!/usr/bin/env tsx
/**
 * 🔍 DIAGNÓSTICO COMPLETO - Supabase Connection
 * 
 * Testa todas as possibilidades de conexão e execução
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '../../.env.local') });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(msg: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function section(title: string) {
  console.log('\n' + '═'.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('═'.repeat(70) + '\n');
}

async function test1_CheckEnvVars() {
  section('1️⃣  VARIÁVEIS DE AMBIENTE');
  
  const vars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  
  for (const [key, value] of Object.entries(vars)) {
    if (value) {
      const masked = value.length > 30 
        ? value.substring(0, 30) + '...' 
        : value;
      log(`✅ ${key}`, 'green');
      log(`   ${masked}`, 'cyan');
    } else {
      log(`❌ ${key} - NÃO CONFIGURADA`, 'red');
    }
  }
  
  return !!vars['NEXT_PUBLIC_SUPABASE_URL'] && 
         (!!vars['SUPABASE_SERVICE_ROLE_KEY'] || !!vars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);
}

async function test2_BasicConnection() {
  section('2️⃣  CONEXÃO BÁSICA');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !key) {
    log('❌ Credenciais não disponíveis', 'red');
    return false;
  }
  
  try {
    const supabase = createClient(url, key);
    
    log('🔗 Testando com crm_clients...', 'cyan');
    const { data, error } = await supabase
      .from('crm_clients')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        log('   ⚠️  Tabela crm_clients não existe (mas conexão OK)', 'yellow');
        return true;
      }
      log(`   ❌ Erro: ${error.message}`, 'red');
      log(`   Código: ${error.code}`, 'yellow');
      return false;
    }
    
    log(`   ✅ Conexão OK! ${data?.length || 0} registro(s)`, 'green');
    return true;
  } catch (error: any) {
    log(`   ❌ Exceção: ${error.message}`, 'red');
    return false;
  }
}

async function test3_RestAPI() {
  section('3️⃣  REST API - MÉTODOS DISPONÍVEIS');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Teste 1: RPC functions disponíveis
  log('🔍 Listando RPCs disponíveis...', 'cyan');
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
    });
    
    if (response.ok) {
      log('   ✅ REST API acessível', 'green');
    } else {
      log(`   ❌ HTTP ${response.status}`, 'red');
    }
  } catch (error: any) {
    log(`   ❌ Erro: ${error.message}`, 'red');
  }
  
  // Teste 2: Tentar exec_sql
  log('\n🔍 Testando exec_sql RPC...', 'cyan');
  
  try {
    const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ sql_query: 'SELECT 1;' }),
    });
    
    const text = await response.text();
    
    if (response.ok) {
      log('   ✅ exec_sql disponível!', 'green');
      log(`   Resposta: ${text}`, 'cyan');
      return true;
    } else {
      log(`   ❌ exec_sql NÃO disponível (HTTP ${response.status})`, 'red');
      log(`   Resposta: ${text}`, 'yellow');
      return false;
    }
  } catch (error: any) {
    log(`   ❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

async function test4_DirectSQL() {
  section('4️⃣  SQL DIRETO - CRIAR TABELA DE TESTE');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(url, key);
  
  // Tentar criar uma tabela simples via query builder
  log('🔍 Tentando criar tabela _migration_test...', 'cyan');
  
  // Como não podemos executar CREATE TABLE diretamente via REST API,
  // vamos verificar se conseguimos ao menos ler metadados
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      log(`   ❌ Não pode acessar information_schema: ${error.message}`, 'red');
      return false;
    }
    
    log('   ✅ Pode ler metadados do banco!', 'green');
    log(`   Tabelas existentes:`, 'cyan');
    data?.forEach((t: any) => {
      log(`      - ${t.table_name}`, 'cyan');
    });
    
    return true;
  } catch (error: any) {
    log(`   ❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

async function test5_CheckExistingTables() {
  section('5️⃣  VERIFICAR TABELAS ALÍQUOTAS');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(url, key);
  
  const tables = [
    'rent_adjustments',
    'adjustment_history',
    'calculation_settings',
    'pdf_templates',
  ];
  
  log('🔍 Verificando se tabelas já existem...\n', 'cyan');
  
  const results = [];
  
  for (const table of tables) {
    process.stdout.write(`   ${table.padEnd(30)} `);
    
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (!error || error.code !== 'PGRST116') {
        log('✅ JÁ EXISTE', 'green');
        results.push({ table, exists: true });
      } else {
        log('❌ Não existe', 'yellow');
        results.push({ table, exists: false });
      }
    } catch {
      log('❌ Não existe', 'yellow');
      results.push({ table, exists: false });
    }
  }
  
  const existing = results.filter(r => r.exists);
  
  if (existing.length > 0) {
    log(`\n⚠️  ${existing.length} tabela(s) já existe(m)!`, 'yellow');
    log('   A migration pode já ter sido executada.', 'yellow');
  }
  
  return existing.length === tables.length;
}

async function test6_KeyType() {
  section('6️⃣  TIPO DE CHAVE (ANON vs SERVICE_ROLE)');
  
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (anonKey) {
    log('🔑 ANON KEY detectada', 'cyan');
    log(`   ${anonKey.substring(0, 30)}...`, 'yellow');
    log('   ⚠️  ANON KEY tem permissões limitadas', 'yellow');
    log('   ⚠️  Pode não conseguir criar tabelas/triggers', 'yellow');
  }
  
  if (serviceKey) {
    log('\n🔑 SERVICE ROLE KEY detectada', 'cyan');
    log(`   ${serviceKey.substring(0, 30)}...`, 'yellow');
    log('   ✅ SERVICE ROLE tem permissões ADMIN', 'green');
    log('   ✅ Pode criar tabelas/triggers/functions', 'green');
  }
  
  if (!serviceKey && anonKey) {
    log('\n❌ PROBLEMA IDENTIFICADO!', 'red');
    log('   Você está usando ANON KEY, que não tem permissão para:', 'red');
    log('   - Criar tabelas', 'red');
    log('   - Criar functions', 'red');
    log('   - Criar triggers', 'red');
    log('   - Executar DDL statements', 'red');
    log('\n💡 SOLUÇÃO:', 'cyan');
    log('   Configure SUPABASE_SERVICE_ROLE_KEY no .env.local', 'cyan');
    log('   Encontre em: Supabase Dashboard → Settings → API', 'cyan');
    return false;
  }
  
  return !!serviceKey;
}

async function main() {
  console.log('\n╔═════════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 DIAGNÓSTICO COMPLETO - SUPABASE & MIGRATIONS              ║');
  console.log('╚═════════════════════════════════════════════════════════════════╝');
  
  const results = {
    envVars: await test1_CheckEnvVars(),
    connection: await test2_BasicConnection(),
    restApi: await test3_RestAPI(),
    directSql: await test4_DirectSQL(),
    existingTables: await test5_CheckExistingTables(),
    keyType: await test6_KeyType(),
  };
  
  // RESUMO FINAL
  section('📊 RESUMO DO DIAGNÓSTICO');
  
  console.log('Teste                        Status');
  console.log('─'.repeat(70));
  
  for (const [test, passed] of Object.entries(results)) {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    const label = test.padEnd(28);
    log(`${label} ${icon}`, color);
  }
  
  console.log('─'.repeat(70) + '\n');
  
  // DIAGNÓSTICO
  if (!results.keyType) {
    log('🎯 PROBLEMA PRINCIPAL: PERMISSÕES INSUFICIENTES', 'red');
    log('\n📋 Por que não conseguimos executar:', 'yellow');
    log('   1. REST API não expõe exec_sql() por padrão', 'yellow');
    log('   2. ANON KEY não tem permissão para DDL', 'yellow');
    log('   3. CREATE TABLE requer SERVICE_ROLE_KEY', 'yellow');
    
    log('\n💡 SOLUÇÕES:', 'cyan');
    log('   A) Usar SERVICE_ROLE_KEY (recomendado)', 'cyan');
    log('      - Pegue em Supabase Dashboard → Settings → API', 'cyan');
    log('      - Configure SUPABASE_SERVICE_ROLE_KEY no .env.local', 'cyan');
    
    log('\n   B) Executar via Dashboard (atual)', 'cyan');
    log('      - Acesse: https://supabase.com/dashboard', 'cyan');
    log('      - SQL Editor → New Query', 'cyan');
    log('      - Cole: supabase/migrations/20250108_create_aliquotas_tables.sql', 'cyan');
    log('      - Execute (RUN)', 'cyan');
    
    log('\n   C) Usar Supabase CLI (alternativa)', 'cyan');
    log('      - pnpm supabase db push', 'cyan');
    log('      - Requer configuração local', 'cyan');
  } else if (results.existingTables) {
    log('🎉 MIGRATION JÁ FOI EXECUTADA!', 'green');
    log('   Todas as tabelas já existem no banco.', 'green');
    log('\n✅ Execute: pnpm migration:verify', 'cyan');
  } else if (results.connection && results.keyType) {
    log('⚠️  CONEXÃO OK MAS SEM EXEC_SQL', 'yellow');
    log('\n📋 Por que não podemos executar via script:', 'yellow');
    log('   - Supabase REST API não expõe exec_sql() publicamente', 'yellow');
    log('   - É uma medida de segurança', 'yellow');
    
    log('\n💡 MELHOR SOLUÇÃO:', 'cyan');
    log('   Executar via Supabase Dashboard (1 minuto)', 'cyan');
    log('   1. https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd', 'cyan');
    log('   2. SQL Editor → New Query', 'cyan');
    log('   3. Copie: supabase/migrations/20250108_create_aliquotas_tables.sql', 'cyan');
    log('   4. Execute (RUN)', 'cyan');
    log('   5. Verifique: pnpm migration:verify', 'cyan');
  }
  
  console.log('\n' + '═'.repeat(70) + '\n');
}

main().catch(console.error);
