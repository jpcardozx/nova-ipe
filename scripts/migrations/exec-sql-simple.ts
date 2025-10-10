#!/usr/bin/env tsx
/**
 * 🎯 Executor SQL Simplificado - via HTTPS
 * 
 * Executa SQL usando fetch direto para Supabase REST API
 * Método mais confiável quando outros falham
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const MIGRATION_FILE = path.join(__dirname, '../../supabase/migrations/20250108_create_aliquotas_tables.sql');

interface ExecutionResult {
  success: boolean;
  statement: string;
  type: string;
  error?: string;
}

async function executeStatement(statement: string, type: string): Promise<ExecutionResult> {
  const postgrestUrl = SUPABASE_URL.replace('//', '//').replace('supabase.co', 'supabase.co');
  
  // Tenta executar via query
  try {
    const response = await fetch(`${postgrestUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ 
        sql_query: statement 
      }),
    });
    
    if (response.ok) {
      return { success: true, statement, type };
    }
    
    const errorText = await response.text();
    return { 
      success: false, 
      statement, 
      type, 
      error: `HTTP ${response.status}: ${errorText}` 
    };
  } catch (error: any) {
    return { 
      success: false, 
      statement, 
      type, 
      error: error.message 
    };
  }
}

function smartSplitSql(sql: string): Array<{ sql: string; type: string }> {
  const statements: Array<{ sql: string; type: string }> = [];
  let current = '';
  let inFunction = false;
  let dollarQuoteCount = 0;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comentários
    if (trimmed.startsWith('--')) {
      continue;
    }
    
    // Detecta funções
    if (trimmed.match(/CREATE\s+(OR\s+REPLACE\s+)?FUNCTION/i)) {
      inFunction = true;
    }
    
    // Conta $$ para saber se estamos dentro de function body
    const dollarMatches = line.match(/\$\$/g);
    if (dollarMatches) {
      dollarQuoteCount += dollarMatches.length;
    }
    
    current += line + '\n';
    
    // Detecta fim de statement
    const endsWithSemicolon = trimmed.endsWith(';');
    const isOutsideFunction = !inFunction || (dollarQuoteCount % 2 === 0 && trimmed.includes('LANGUAGE'));
    
    if (endsWithSemicolon && isOutsideFunction && current.trim()) {
      const type = detectType(current);
      statements.push({ sql: current.trim(), type });
      current = '';
      
      if (inFunction && trimmed.includes('LANGUAGE')) {
        inFunction = false;
        dollarQuoteCount = 0;
      }
    }
  }
  
  // Adiciona último statement se existir
  if (current.trim()) {
    const type = detectType(current);
    statements.push({ sql: current.trim(), type });
  }
  
  return statements;
}

function detectType(sql: string): string {
  const upper = sql.toUpperCase().trim();
  
  if (upper.startsWith('CREATE TABLE')) return 'TABLE';
  if (upper.startsWith('CREATE INDEX')) return 'INDEX';
  if (upper.startsWith('CREATE UNIQUE INDEX')) return 'INDEX';
  if (upper.startsWith('CREATE TRIGGER')) return 'TRIGGER';
  if (upper.startsWith('CREATE OR REPLACE FUNCTION')) return 'FUNCTION';
  if (upper.startsWith('CREATE FUNCTION')) return 'FUNCTION';
  if (upper.startsWith('CREATE VIEW')) return 'VIEW';
  if (upper.startsWith('ALTER TABLE')) return 'ALTER';
  if (upper.startsWith('INSERT INTO')) return 'DATA';
  if (upper.startsWith('COMMENT ON')) return 'COMMENT';
  if (upper.startsWith('DO $$')) return 'BLOCK';
  
  return 'OTHER';
}

function extractName(sql: string, type: string): string {
  const lines = sql.split('\n');
  const firstLine = lines[0].trim();
  
  if (type === 'TABLE') {
    const match = firstLine.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
    return match ? match[1] : 'unknown';
  }
  
  if (type === 'FUNCTION') {
    const match = firstLine.match(/FUNCTION\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }
  
  if (type === 'TRIGGER') {
    const match = firstLine.match(/TRIGGER\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }
  
  if (type === 'VIEW') {
    const match = firstLine.match(/VIEW\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }
  
  if (type === 'INDEX') {
    const match = firstLine.match(/INDEX\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }
  
  return type.toLowerCase();
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎯 EXECUTOR SQL SIMPLIFICADO - ALÍQUOTAS               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  // Validar
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas\n');
    console.error('Configure em .env.local:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY\n');
    process.exit(1);
  }
  
  console.log('✅ Ambiente validado');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Key: ${SUPABASE_KEY.substring(0, 20)}...\n`);
  
  // Ler migration
  console.log('📖 Lendo migration file...');
  const sql = await fs.readFile(MIGRATION_FILE, 'utf-8');
  console.log(`   ✅ ${sql.split('\n').length} linhas carregadas\n`);
  
  // Parse statements
  console.log('🔍 Analisando SQL...');
  const statements = smartSplitSql(sql);
  console.log(`   ✅ ${statements.length} statements identificados\n`);
  
  // Executar
  console.log('🚀 Executando statements...\n');
  
  const results: ExecutionResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const { sql: stmt, type } = statements[i];
    const name = extractName(stmt, type);
    const progress = `[${i + 1}/${statements.length}]`;
    
    process.stdout.write(`${progress} ${type.padEnd(10)} ${name.padEnd(30)} `);
    
    const result = await executeStatement(stmt, type);
    results.push(result);
    
    if (result.success) {
      successCount++;
      console.log('✅');
    } else {
      errorCount++;
      console.log('❌');
      if (result.error) {
        console.log(`     ⮑  ${result.error}\n`);
      }
      
      // Para em erros críticos
      if (type === 'TABLE') {
        console.error('\n💥 Erro crítico ao criar tabela. Abortando.\n');
        break;
      }
    }
  }
  
  // Resultado final
  console.log('\n' + '═'.repeat(63));
  console.log('📊 RESULTADO DA MIGRATION');
  console.log('═'.repeat(63));
  console.log(`✅ Sucesso:  ${successCount.toString().padStart(3)} statements`);
  console.log(`❌ Erros:    ${errorCount.toString().padStart(3)} statements`);
  console.log(`📝 Total:    ${statements.length.toString().padStart(3)} statements`);
  console.log('═'.repeat(63) + '\n');
  
  if (errorCount === 0) {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  ✨ MIGRATION CONCLUÍDA COM SUCESSO! ✨                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log('📋 Próximos passos:');
    console.log('  1. Verificar tabelas: pnpm migration:verify');
    console.log('  2. Criar API routes');
    console.log('  3. Implementar UI components\n');
    
    process.exit(0);
  } else {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  ⚠️  MIGRATION COMPLETOU COM ERROS                       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log('📋 Erros encontrados:');
    results
      .filter(r => !r.success)
      .forEach((r, i) => {
        console.log(`\n${i + 1}. ${r.type} - ${extractName(r.statement, r.type)}`);
        console.log(`   ${r.error}`);
      });
    
    console.log('\n💡 Dicas:');
    console.log('  - Verifique se as tabelas já existem');
    console.log('  - Use --rollback para limpar antes');
    console.log('  - Execute statements individualmente se necessário\n');
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n💥 Erro fatal:', error.message);
  console.error(error.stack);
  process.exit(1);
});
