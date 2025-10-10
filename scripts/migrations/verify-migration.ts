#!/usr/bin/env tsx
/**
 * ✅ Verificador de Migration - Alíquotas
 * 
 * Verifica se as tabelas foram criadas corretamente
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const REQUIRED_TABLES = [
  'rent_adjustments',
  'adjustment_history',
  'calculation_settings',
  'pdf_templates'
];

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

async function checkTable(supabase: any, tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    // PGRST116 = tabela não existe
    if (error && error.code === 'PGRST116') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  ✅ VERIFICADOR DE MIGRATION - ALÍQUOTAS                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log('❌ Variáveis de ambiente não configuradas\n', 'red');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  log('🔍 Verificando tabelas...\n', 'cyan');
  
  let allOk = true;
  const results: { table: string; exists: boolean }[] = [];
  
  for (const table of REQUIRED_TABLES) {
    process.stdout.write(`   ${table.padEnd(30)} `);
    const exists = await checkTable(supabase, table);
    results.push({ table, exists });
    
    if (exists) {
      log('✅', 'green');
    } else {
      log('❌', 'red');
      allOk = false;
    }
  }
  
  console.log('\n' + '═'.repeat(63));
  
  if (allOk) {
    log('✨ TODAS AS TABELAS FORAM CRIADAS! ✨', 'green');
    
    // Verificar dados iniciais
    log('\n📊 Verificando dados iniciais...\n', 'cyan');
    
    try {
      const { data: settings } = await supabase
        .from('calculation_settings')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (settings) {
        log(`   ✅ Configuração padrão: ${settings.name}`, 'green');
      } else {
        log('   ⚠️  Configuração padrão não encontrada', 'yellow');
      }
    } catch {
      log('   ⚠️  Configuração padrão não encontrada', 'yellow');
    }
    
    try {
      const { data: template } = await supabase
        .from('pdf_templates')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (template) {
        log(`   ✅ Template padrão: ${template.name}`, 'green');
      } else {
        log('   ⚠️  Template padrão não encontrado', 'yellow');
      }
    } catch {
      log('   ⚠️  Template padrão não encontrado', 'yellow');
    }
    
    log('\n' + '═'.repeat(63), 'green');
    log('🎉 MIGRATION VERIFICADA COM SUCESSO!', 'green');
    log('═'.repeat(63) + '\n', 'green');
    
    log('📋 Próximos passos:', 'cyan');
    console.log('  1. Criar API routes em app/api/aliquotas/');
    console.log('  2. Criar Wizard em app/dashboard/aliquotas/new/');
    console.log('  3. Criar Dashboard em app/dashboard/aliquotas/\n');
    
    process.exit(0);
  } else {
    log('⚠️  MIGRATION INCOMPLETA', 'yellow');
    log('═'.repeat(63) + '\n', 'yellow');
    
    const missing = results.filter(r => !r.exists);
    log('❌ Tabelas faltando:', 'red');
    missing.forEach(r => {
      console.log(`   - ${r.table}`);
    });
    
    log('\n💡 Execute a migration via Supabase Dashboard:', 'cyan');
    console.log('   1. https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd');
    console.log('   2. SQL Editor → New Query');
    console.log('   3. Copie: supabase/migrations/20250108_create_aliquotas_tables.sql');
    console.log('   4. Cole e execute (RUN)\n');
    
    process.exit(1);
  }
}

main().catch(console.error);
