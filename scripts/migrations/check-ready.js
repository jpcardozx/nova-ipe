#!/usr/bin/env node
/**
 * 🔍 Quick Check - Ambiente de Migrations
 * 
 * Verifica se tudo está pronto para executar migrations
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnv() {
  console.log('\n📋 Verificando Ambiente...\n');
  
  // Check .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local não encontrado', 'red');
    return false;
  }
  
  // Read .env
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasSupabaseUrl = envContent.includes('SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY') || 
                         envContent.includes('SUPABASE_ANON_KEY');
  
  if (!hasSupabaseUrl) {
    log('❌ SUPABASE_URL não encontrada em .env.local', 'red');
    return false;
  }
  
  if (!hasSupabaseKey) {
    log('❌ SUPABASE_KEY não encontrada em .env.local', 'red');
    return false;
  }
  
  log('✅ .env.local configurado', 'green');
  return true;
}

function checkMigrationFile() {
  const migrationPath = path.join(
    process.cwd(), 
    'supabase/migrations/20250108_create_aliquotas_tables.sql'
  );
  
  if (!fs.existsSync(migrationPath)) {
    log('❌ Migration file não encontrado', 'red');
    log(`   Esperado: ${migrationPath}`, 'yellow');
    return false;
  }
  
  const stats = fs.statSync(migrationPath);
  const sizeKb = (stats.size / 1024).toFixed(1);
  
  log(`✅ Migration file encontrado (${sizeKb} KB)`, 'green');
  return true;
}

function checkScripts() {
  const scriptsToCheck = [
    'scripts/migrations/run-aliquotas-migration.ts',
    'scripts/migrations/exec-sql-simple.ts',
  ];
  
  let allOk = true;
  
  for (const script of scriptsToCheck) {
    const scriptPath = path.join(process.cwd(), script);
    if (!fs.existsSync(scriptPath)) {
      log(`❌ Script não encontrado: ${script}`, 'red');
      allOk = false;
    }
  }
  
  if (allOk) {
    log('✅ Scripts de migration encontrados', 'green');
  }
  
  return allOk;
}

function checkDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const hasSupabase = packageJson.dependencies['@supabase/supabase-js'];
  
  if (!hasSupabase) {
    log('❌ @supabase/supabase-js não instalado', 'red');
    return false;
  }
  
  log(`✅ @supabase/supabase-js ${hasSupabase}`, 'green');
  return true;
}

function checkPackageScripts() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const hasScript = packageJson.scripts['migration:aliquotas'];
  
  if (!hasScript) {
    log('❌ Scripts não configurados em package.json', 'red');
    return false;
  }
  
  log('✅ Scripts configurados em package.json', 'green');
  return true;
}

// Main
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  🔍 VERIFICAÇÃO RÁPIDA - MIGRATIONS ALÍQUOTAS           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');

const checks = [
  checkEnv(),
  checkMigrationFile(),
  checkScripts(),
  checkDependencies(),
  checkPackageScripts(),
];

const allOk = checks.every(c => c);

console.log('\n' + '═'.repeat(63));

if (allOk) {
  log('✨ TUDO PRONTO PARA EXECUTAR MIGRATIONS! ✨', 'green');
  console.log('\n📋 Comandos disponíveis:\n');
  log('  pnpm migration:aliquotas           # Executar migration', 'cyan');
  log('  pnpm migration:simple              # Método alternativo', 'cyan');
  log('  pnpm migration:aliquotas:verify    # Verificar execução', 'cyan');
  log('  pnpm migration:aliquotas:rollback  # Desfazer', 'cyan');
} else {
  log('⚠️  AMBIENTE INCOMPLETO', 'yellow');
  console.log('\n📋 Revise os itens acima e corrija antes de continuar.\n');
  process.exit(1);
}

console.log('');
