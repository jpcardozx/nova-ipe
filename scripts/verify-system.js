#!/usr/bin/env node

/**
 * Script de Verificação do Sistema CRM + Gestão de Documentos
 * Verifica se todos os arquivos estão no lugar correto
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 VERIFICAÇÃO DO SISTEMA CRM + GESTÃO DE DOCUMENTOS\n')

// Lista de arquivos necessários
const requiredFiles = [
    {
        path: 'sql/complete_migration.sql',
        description: 'Schema PostgreSQL completo',
        critical: true
    },
    {
        path: 'app/lib/supabase/integrated-service.ts',
        description: 'Serviços integrados Supabase',
        critical: true
    },
    {
        path: 'app/hooks/useIntegratedCRM.ts',
        description: 'Hook React principal',
        critical: true
    },
    {
        path: 'app/components/business/IntegratedDashboard.tsx',
        description: 'Dashboard integrado',
        critical: true
    },
    {
        path: 'app/components/documents/DocumentManager.tsx',
        description: 'Gestão de documentos (original)',
        critical: false
    },
    {
        path: 'app/components/documents/DocumentManagerNew.tsx',
        description: 'Gestão de documentos (nova versão)',
        critical: true
    },
    {
        path: 'app/crm-system/page.tsx',
        description: 'Página principal do sistema',
        critical: true
    },
    {
        path: 'scripts/migrate-database.js',
        description: 'Script de migração automática',
        critical: false
    },
    {
        path: 'scripts/migrate-manual.js',
        description: 'Script de migração manual',
        critical: true
    },
    {
        path: 'docs/CRM_INTEGRATED_SYSTEM.md',
        description: 'Documentação completa',
        critical: false
    }
]

let totalFiles = 0
let existingFiles = 0
let criticalFiles = 0
let existingCriticalFiles = 0

console.log('📋 VERIFICANDO ARQUIVOS DO SISTEMA:\n')

requiredFiles.forEach((file, index) => {
    const filePath = path.join(__dirname, '..', file.path)
    const exists = fs.existsSync(filePath)
    const status = exists ? '✅' : '❌'
    const priority = file.critical ? '[CRÍTICO]' : '[OPCIONAL]'
    
    totalFiles++
    if (exists) existingFiles++
    
    if (file.critical) {
        criticalFiles++
        if (exists) existingCriticalFiles++
    }
    
    console.log(`${status} ${priority} ${file.path}`)
    console.log(`   ${file.description}`)
    
    if (exists) {
        const stats = fs.statSync(filePath)
        const sizeKB = Math.round(stats.size / 1024)
        console.log(`   📊 ${sizeKB}KB | 📅 ${stats.mtime.toLocaleDateString('pt-BR')}`)
    } else {
        console.log(`   ⚠️  Arquivo não encontrado`)
    }
    
    console.log('')
})

// Resumo
console.log('📊 RESUMO DA VERIFICAÇÃO:\n')
console.log(`📁 Total de arquivos: ${existingFiles}/${totalFiles}`)
console.log(`🔥 Arquivos críticos: ${existingCriticalFiles}/${criticalFiles}`)

const completionPercentage = Math.round((existingFiles / totalFiles) * 100)
const criticalPercentage = Math.round((existingCriticalFiles / criticalFiles) * 100)

console.log(`📈 Completude geral: ${completionPercentage}%`)
console.log(`🎯 Arquivos críticos: ${criticalPercentage}%\n`)

// Status do sistema
if (criticalPercentage === 100) {
    console.log('🎉 SISTEMA PRONTO PARA USO!')
    console.log('✅ Todos os arquivos críticos estão presentes')
    console.log('✅ O sistema pode ser configurado e utilizado\n')
    
    console.log('🚀 PRÓXIMOS PASSOS:')
    console.log('1. Execute: npm run migrate:manual')
    console.log('2. Siga as instruções para configurar o Supabase')
    console.log('3. Configure as variáveis de ambiente')
    console.log('4. Execute: npm run dev')
    console.log('5. Acesse: http://localhost:3000/crm-system\n')
    
} else if (criticalPercentage >= 80) {
    console.log('⚠️  SISTEMA QUASE PRONTO')
    console.log('⚠️  Alguns arquivos críticos estão faltando')
    console.log('📝 Execute o assistente novamente para completar\n')
    
} else {
    console.log('❌ SISTEMA INCOMPLETO')
    console.log('❌ Muitos arquivos críticos estão faltando')
    console.log('🔄 Execute o assistente do zero para criar o sistema\n')
}

// Verificar imports e dependências
console.log('🔗 VERIFICANDO DEPENDÊNCIAS:\n')

const dependenciesToCheck = [
    '@supabase/supabase-js',
    'framer-motion',
    'react-hot-toast',
    'lucide-react'
]

try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json')
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
        
        dependenciesToCheck.forEach(dep => {
            if (dependencies[dep]) {
                console.log(`✅ ${dep} - v${dependencies[dep]}`)
            } else {
                console.log(`❌ ${dep} - NÃO INSTALADO`)
            }
        })
    }
} catch (error) {
    console.log('⚠️  Erro ao verificar dependências:', error.message)
}

console.log('\n🔧 COMANDOS ÚTEIS:')
console.log('npm run migrate:manual  - Instruções de migração')
console.log('npm run dev            - Executar em desenvolvimento')
console.log('npm run build          - Build para produção')
console.log('npm run typecheck      - Verificar tipos TypeScript')
console.log('npm run lint           - Verificar código\n')

// Verificar se há erros de TypeScript
console.log('🔍 VERIFICAÇÃO RÁPIDA DE TIPOS:')
try {
    const { exec } = require('child_process')
    exec('npx tsc --noEmit --skipLibCheck', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
            console.log('⚠️  Há erros de TypeScript no projeto')
            console.log('💡 Execute: npm run typecheck para ver detalhes')
        } else {
            console.log('✅ Tipos TypeScript OK')
        }
    })
} catch (error) {
    console.log('⚠️  Não foi possível verificar tipos TypeScript')
}

console.log('\n📚 DOCUMENTAÇÃO:')
console.log('📄 docs/CRM_INTEGRATED_SYSTEM.md - Guia completo')
console.log('📄 sql/complete_migration.sql - Schema do banco')
console.log('🌐 /crm-system - Página principal do sistema')
console.log('🎯 Funcionalidades: CRM + Gestão de Documentos integrados\n')

console.log('✨ Verificação concluída!')
