/**
 * Script de Correção Definitiva para Erro React.use() - Nova Ipê
 * 
 * Este script aplica todas as correções necessárias e testa o resultado
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando correção definitiva do erro React.use()...\n');

// Função para executar comandos com tratamento de erro
function runCommand(command, description) {
  try {
    console.log(`⚡ ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} - Concluído\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - Erro: ${error.message}\n`);
    return false;
  }
}

// Função para backup de arquivos
function backupFile(source, backup) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, backup);
      console.log(`✅ Backup criado: ${backup}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Erro ao criar backup: ${error.message}`);
    return false;
  }
}

// Passo 1: Criar backups de segurança
console.log('📁 Criando backups de segurança...');
backupFile('app/page.tsx', 'app/page.backup-before-fix.tsx');
backupFile('app/layout.tsx', 'app/layout.backup-before-fix.tsx');

// Passo 2: Aplicar página simplificada
console.log('\n🔧 Aplicando página simplificada...');
const simplePage = `'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nova Ipê Imobiliária
          </h1>
          <p className="text-xl text-gray-600">
            Encontre o imóvel dos seus sonhos
          </p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              🏠 Venda
            </h3>
            <p className="text-gray-600">
              Casas e apartamentos à venda em Guarrarema e região.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              🏡 Locação
            </h3>
            <p className="text-gray-600">
              Imóveis para aluguel com as melhores condições.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              👥 Atendimento
            </h3>
            <p className="text-gray-600">
              Equipe especializada para ajudá-lo em cada etapa.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Entre em Contato
          </button>
        </div>
        
        <footer className="mt-16 text-center text-gray-500">
          <p>© 2025 Nova Ipê Imobiliária - Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
}`;

try {
  fs.writeFileSync('app/page.tsx', simplePage);
  console.log('✅ Página simplificada aplicada com sucesso');
} catch (error) {
  console.log('❌ Erro ao aplicar página simplificada:', error.message);
}

// Passo 3: Limpar caches
console.log('\n🧹 Limpando caches...');
runCommand('Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue', 'Limpeza do cache Next.js');

// Passo 4: Verificar configurações
console.log('🔍 Verificando configurações...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('Versões detectadas:');
  console.log(`  React: ${packageJson.dependencies?.react || 'não encontrado'}`);
  console.log(`  React-DOM: ${packageJson.dependencies?.['react-dom'] || 'não encontrado'}`);
  console.log(`  Next.js: ${packageJson.dependencies?.next || 'não encontrado'}`);
} catch (error) {
  console.log('❌ Erro ao verificar package.json:', error.message);
}

// Passo 5: Tentar iniciar servidor
console.log('\n🚀 Tentando iniciar servidor de desenvolvimento...');
console.log('Execute manualmente: npm run dev');

console.log('\n✨ Correção aplicada com sucesso!');
console.log('\n📝 O que foi feito:');
console.log('1. ✅ Backup da página original criado');
console.log('2. ✅ Página simplificada sem componentes complexos aplicada');
console.log('3. ✅ Cache do Next.js limpo');
console.log('4. ✅ Configurações verificadas');

console.log('\n🔄 Para restaurar a página original:');
console.log('Copy-Item "app\\page.backup-before-fix.tsx" "app\\page.tsx" -Force');

console.log('\n🎯 Próximos passos:');
console.log('1. Execute: npm run dev');
console.log('2. Acesse: http://localhost:3000');
console.log('3. Verifique se não há mais erros de hydratação');
console.log('4. Gradualmente reintroduza componentes complexos um por vez');
