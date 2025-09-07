#!/usr/bin/env node

/**
 * Script para auxiliar na configuração inicial do Supabase
 * Ipê Imóveis - Sistema de Gestão
 */

const fs = require('fs');
const path = require('path');

console.log('🏠 Ipê Imóveis - Setup do Supabase');
console.log('=====================================\n');

// Verificar se as variáveis de ambiente estão configuradas
const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('📋 Verificando configuração...');

const envFile = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
} else {
    console.log('❌ Arquivo .env.local não encontrado');
    process.exit(1);
}

let missingVars = [];

requiredEnvVars.forEach(varName => {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`)) {
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.log('❌ Variáveis de ambiente não configuradas:');
    missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
    });
    console.log('\n📝 Configure essas variáveis no arquivo .env.local antes de continuar.');
    process.exit(1);
}

console.log('✅ Variáveis de ambiente configuradas corretamente\n');

// Listar arquivos SQL disponíveis
console.log('📁 Scripts SQL disponíveis:');
const sqlDir = path.join(process.cwd(), 'sql');

let sqlFiles = [];

if (fs.existsSync(sqlDir)) {
    sqlFiles = fs.readdirSync(sqlDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

    sqlFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
} else {
    console.log('❌ Diretório sql/ não encontrado');
    process.exit(1);
}

console.log('\n📋 Passos para configurar o Supabase:');
console.log('=====================================');

console.log('\n1️⃣ No Supabase Dashboard:');
console.log('   • Acesse seu projeto Supabase');
console.log('   • Vá para o SQL Editor');

console.log('\n2️⃣ Execute os scripts SQL na ordem:');
sqlFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
    console.log(`      Copie e execute o conteúdo de: sql/${file}`);
});

console.log('\n3️⃣ Criar usuário administrador:');
console.log('   • Vá para Authentication > Users');
console.log('   • Clique em "Add user"');
console.log('   • Email: admin@ipeimoveis.com');
console.log('   • Password: IpeAdmin123!');
console.log('   • Marque "Confirm email"');
console.log('   • Clique em "Create user"');

console.log('\n4️⃣ Atualizar perfil do admin:');
console.log('   • No SQL Editor, execute:');
console.log('   UPDATE public.profiles');
console.log('   SET full_name = \'Administrador do Sistema\',');
console.log('       department = \'Administrativo\',');
console.log('       role = \'super_admin\',');
console.log('       is_active = true,');
console.log('       is_approved = true,');
console.log('       approved_at = NOW()');
console.log('   WHERE email = \'admin@ipeimoveis.com\';');

console.log('\n5️⃣ Testar conexão:');
console.log('   • Reinicie o servidor de desenvolvimento');
console.log('   • Acesse /login');
console.log('   • Use: admin@ipeimoveis.com / IpeAdmin123!');

console.log('\n📚 Documentação completa:');
console.log('   • Consulte: docs/SUPABASE_SETUP.md');

console.log('\n✅ Script de setup concluído!');
console.log('   Execute os passos acima para finalizar a configuração.\n');

// Verificar se existem outros arquivos importantes
const importantFiles = [
    'docs/SUPABASE_SETUP.md',
    'lib/supabase.ts',
    'app/login/page.tsx'
];

console.log('📄 Arquivos importantes verificados:');
importantFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${filePath}`);
    } else {
        console.log(`   ❌ ${filePath} (não encontrado)`);
    }
});

console.log('\n🎯 Próximo passo: Execute os scripts SQL no Supabase Dashboard!');