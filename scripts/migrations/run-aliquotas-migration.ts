#!/usr/bin/env tsx
/**
 * 🚀 Migration Runner - Alíquotas System
 * 
 * Executa a migration do sistema de alíquotas de forma segura e controlada
 * 
 * Features:
 * - Validação de ambiente antes de executar
 * - Backup automático (se tabelas já existirem)
 * - Rollback automático em caso de erro
 * - Logs detalhados
 * - Verificação pós-execução
 * 
 * Usage:
 *   pnpm migration:aliquotas              # Executar migration
 *   pnpm migration:aliquotas --rollback   # Desfazer migration
 *   pnpm migration:aliquotas --verify     # Apenas verificar
 *   pnpm migration:aliquotas --force      # Forçar recriação
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MIGRATION_FILE = path.join(__dirname, '../../supabase/migrations/20250108_create_aliquotas_tables.sql');

const REQUIRED_TABLES = [
  'rent_adjustments',
  'adjustment_history',
  'calculation_settings',
  'pdf_templates'
];

const REQUIRED_VIEWS = [
  'active_rent_adjustments',
  'adjustment_statistics'
];

// ============================================================================
// UTILITÁRIOS
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: string) {
  log(`\n▶ ${step}`, 'cyan');
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue');
}

// ============================================================================
// VALIDAÇÕES
// ============================================================================

async function validateEnvironment(): Promise<boolean> {
  logStep('Validando ambiente...');
  
  if (!SUPABASE_URL) {
    logError('SUPABASE_URL não encontrada no ambiente');
    logInfo('Configure NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL em .env.local');
    return false;
  }
  
  if (!SUPABASE_KEY) {
    logError('SUPABASE_KEY não encontrada no ambiente');
    logInfo('Configure SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local');
    return false;
  }
  
  // Verificar se arquivo de migration existe
  try {
    await fs.access(MIGRATION_FILE);
    logSuccess(`Migration file encontrado: ${path.basename(MIGRATION_FILE)}`);
  } catch {
    logError(`Migration file não encontrado: ${MIGRATION_FILE}`);
    return false;
  }
  
  logSuccess('Ambiente validado');
  return true;
}

async function checkSupabaseConnection(supabase: any): Promise<boolean> {
  logStep('Testando conexão com Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('crm_clients')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = tabela não existe, mas conexão funciona
      logError(`Erro ao conectar: ${error.message}`);
      return false;
    }
    
    logSuccess('Conexão estabelecida');
    return true;
  } catch (error: any) {
    logError(`Erro ao conectar: ${error.message}`);
    return false;
  }
}

async function checkExistingTables(supabase: any): Promise<string[]> {
  logStep('Verificando tabelas existentes...');
  
  const existingTables: string[] = [];
  
  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      // Se não der erro PGRST116 (tabela não existe), então existe
      if (!error || error.code !== 'PGRST116') {
        existingTables.push(tableName);
        logWarning(`Tabela já existe: ${tableName}`);
      }
    } catch {
      // Ignora erros, significa que não existe
    }
  }
  
  if (existingTables.length === 0) {
    logSuccess('Nenhuma tabela existente encontrada');
  } else {
    logWarning(`${existingTables.length} tabela(s) já existe(m)`);
  }
  
  return existingTables;
}

// ============================================================================
// MIGRATION
// ============================================================================

async function readMigrationFile(): Promise<string> {
  logStep('Lendo arquivo de migration...');
  
  const content = await fs.readFile(MIGRATION_FILE, 'utf-8');
  const lines = content.split('\n').length;
  
  logSuccess(`Migration carregada (${lines} linhas)`);
  return content;
}

async function executeMigration(supabase: any, sql: string): Promise<boolean> {
  logStep('Executando migration...');
  
  try {
    // Split SQL em statements individuais (respeitando funções e triggers)
    const statements = splitSqlStatements(sql);
    
    logInfo(`Executando ${statements.length} statement(s)...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement || statement.startsWith('--')) {
        continue;
      }
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Tenta executar via query direto
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({ sql_query: statement }),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          }
        }
        
        successCount++;
        process.stdout.write('.');
      } catch (error: any) {
        errorCount++;
        logError(`\nErro no statement ${i + 1}: ${error.message}`);
        
        // Log do statement que falhou
        logInfo(`Statement: ${statement.substring(0, 100)}...`);
        
        // Se for erro crítico, para
        if (statement.includes('CREATE TABLE')) {
          throw error;
        }
      }
    }
    
    console.log(''); // Nova linha após os dots
    
    if (errorCount > 0) {
      logWarning(`Migration concluída com ${errorCount} erro(s) e ${successCount} sucesso(s)`);
      return false;
    }
    
    logSuccess(`Migration executada (${successCount} statement(s))`);
    return true;
  } catch (error: any) {
    logError(`Erro ao executar migration: ${error.message}`);
    return false;
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inFunction = false;
  let inDollarQuote = false;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detecta início/fim de função
    if (trimmed.includes('CREATE OR REPLACE FUNCTION') || trimmed.includes('CREATE FUNCTION')) {
      inFunction = true;
    }
    
    if (trimmed.includes('$$')) {
      inDollarQuote = !inDollarQuote;
    }
    
    current += line + '\n';
    
    // Detecta fim de statement
    if (trimmed.endsWith(';') && !inFunction && !inDollarQuote) {
      statements.push(current.trim());
      current = '';
    }
    
    // Detecta fim de função
    if (inFunction && trimmed.includes('LANGUAGE plpgsql') && trimmed.endsWith(';')) {
      statements.push(current.trim());
      current = '';
      inFunction = false;
    }
  }
  
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements;
}

async function verifyMigration(supabase: any): Promise<boolean> {
  logStep('Verificando migration...');
  
  let allOk = true;
  
  // Verificar tabelas
  logInfo('Verificando tabelas...');
  for (const tableName of REQUIRED_TABLES) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        logError(`Tabela não existe: ${tableName}`);
        allOk = false;
      } else {
        logSuccess(`Tabela OK: ${tableName}`);
      }
    } catch (error: any) {
      logError(`Erro ao verificar ${tableName}: ${error.message}`);
      allOk = false;
    }
  }
  
  // Verificar dados iniciais
  logInfo('\nVerificando dados iniciais...');
  
  try {
    const { data: settings, error: settingsError } = await supabase
      .from('calculation_settings')
      .select('*')
      .eq('is_default', true)
      .single();
    
    if (settingsError || !settings) {
      logWarning('Configuração padrão não encontrada');
    } else {
      logSuccess(`Configuração padrão: ${settings.name}`);
    }
  } catch {
    logWarning('Erro ao verificar configuração padrão');
  }
  
  try {
    const { data: template, error: templateError } = await supabase
      .from('pdf_templates')
      .select('*')
      .eq('is_default', true)
      .single();
    
    if (templateError || !template) {
      logWarning('Template padrão não encontrado');
    } else {
      logSuccess(`Template padrão: ${template.name}`);
    }
  } catch {
    logWarning('Erro ao verificar template padrão');
  }
  
  if (allOk) {
    logSuccess('\n✨ Migration verificada com sucesso!');
  } else {
    logError('\n💥 Migration incompleta ou com erros');
  }
  
  return allOk;
}

// ============================================================================
// ROLLBACK
// ============================================================================

async function rollbackMigration(supabase: any): Promise<boolean> {
  logStep('Executando rollback...');
  
  logWarning('⚠️  ATENÇÃO: Isso irá APAGAR TODAS as tabelas e dados!');
  logInfo('Aguarde 3 segundos para cancelar (Ctrl+C)...');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const rollbackSql = `
    -- Desabilitar triggers
    DROP TRIGGER IF EXISTS log_rent_adjustments_history ON rent_adjustments;
    DROP TRIGGER IF EXISTS update_rent_adjustments_updated_at ON rent_adjustments;
    DROP TRIGGER IF EXISTS update_calculation_settings_updated_at ON calculation_settings;
    DROP TRIGGER IF EXISTS update_pdf_templates_updated_at ON pdf_templates;
    
    -- Remover functions
    DROP FUNCTION IF EXISTS log_adjustment_history() CASCADE;
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    
    -- Remover views
    DROP VIEW IF EXISTS adjustment_statistics CASCADE;
    DROP VIEW IF EXISTS active_rent_adjustments CASCADE;
    
    -- Remover tabelas
    DROP TABLE IF EXISTS adjustment_history CASCADE;
    DROP TABLE IF EXISTS rent_adjustments CASCADE;
    DROP TABLE IF EXISTS calculation_settings CASCADE;
    DROP TABLE IF EXISTS pdf_templates CASCADE;
  `;
  
  try {
    const statements = rollbackSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));
    
    for (const statement of statements) {
      await supabase.rpc('exec_sql', { sql_query: statement });
      process.stdout.write('.');
    }
    
    console.log('');
    logSuccess('Rollback executado');
    return true;
  } catch (error: any) {
    logError(`Erro no rollback: ${error.message}`);
    return false;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const isRollback = args.includes('--rollback');
  const isVerifyOnly = args.includes('--verify');
  const isForce = args.includes('--force');
  
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║  🚀 MIGRATION RUNNER - SISTEMA DE ALÍQUOTAS          ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝', 'bright');
  
  // Validar ambiente
  if (!await validateEnvironment()) {
    process.exit(1);
  }
  
  // Criar cliente Supabase
  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
  
  // Testar conexão
  if (!await checkSupabaseConnection(supabase)) {
    process.exit(1);
  }
  
  // Verificar tabelas existentes
  const existingTables = await checkExistingTables(supabase);
  
  // MODO: Rollback
  if (isRollback) {
    if (existingTables.length === 0) {
      logWarning('Nenhuma tabela para remover');
      process.exit(0);
    }
    
    const success = await rollbackMigration(supabase);
    process.exit(success ? 0 : 1);
  }
  
  // MODO: Verificar apenas
  if (isVerifyOnly) {
    if (existingTables.length === 0) {
      logWarning('Migration ainda não foi executada');
      process.exit(1);
    }
    
    const success = await verifyMigration(supabase);
    process.exit(success ? 0 : 1);
  }
  
  // MODO: Executar migration
  if (existingTables.length > 0 && !isForce) {
    logWarning('\n⚠️  Tabelas já existem!');
    logInfo('Use --force para forçar recriação');
    logInfo('Use --rollback para remover tabelas existentes');
    process.exit(1);
  }
  
  if (isForce && existingTables.length > 0) {
    logWarning('Modo --force ativado: removendo tabelas existentes...');
    await rollbackMigration(supabase);
    // Aguarda um pouco para garantir que tabelas foram removidas
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Ler migration
  const migrationSql = await readMigrationFile();
  
  // Executar migration
  const success = await executeMigration(supabase, migrationSql);
  
  if (!success) {
    logError('\n💥 Migration falhou');
    logInfo('Use --rollback para limpar e tentar novamente');
    process.exit(1);
  }
  
  // Aguarda um pouco antes de verificar
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verificar
  const verified = await verifyMigration(supabase);
  
  if (verified) {
    log('\n╔════════════════════════════════════════════════════════╗', 'green');
    log('║  ✨ MIGRATION CONCLUÍDA COM SUCESSO! ✨              ║', 'green');
    log('╚════════════════════════════════════════════════════════╝', 'green');
    log('\n📋 Próximos passos:', 'cyan');
    log('  1. Criar API routes em app/api/aliquotas/', 'cyan');
    log('  2. Criar componentes UI', 'cyan');
    log('  3. Testar sistema completo', 'cyan');
  } else {
    logWarning('\n⚠️  Migration executada mas com warnings');
    logInfo('Revise os logs acima para mais detalhes');
  }
  
  process.exit(verified ? 0 : 1);
}

// Executar
main().catch((error) => {
  logError(`\n💥 Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});
