#!/usr/bin/env node
/**
 * NOVA IPE - DIAGNÓSTICO ARQUITETURAL EMPRESARIAL
 * Análise crítica para transformação enterprise
 */

const fs = require('fs')
const path = require('path')

console.log('\n🏗️  NOVA IPE - DIAGNÓSTICO ARQUITETURAL EMPRESARIAL\n')

// 1. ANÁLISE DE DEPENDÊNCIAS
const packagePath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const deps = Object.keys(packageJson.dependencies || {})
const devDeps = Object.keys(packageJson.devDependencies || {})
const totalDeps = deps.length + devDeps.length

console.log('📦 ANÁLISE DE DEPENDÊNCIAS:')
console.log(`   ▸ Total: ${totalDeps} dependências`)
console.log(`   ▸ Produção: ${deps.length}`)
console.log(`   ▸ Desenvolvimento: ${devDeps.length}`)

if (totalDeps > 50) {
  console.log('   ⚠️  CRÍTICO: Muitas dependências (>50)')
} else if (totalDeps > 30) {
  console.log('   ⚠️  ALTO: Dependências elevadas (>30)')
} else {
  console.log('   ✅ OK: Dependências controladas')
}

// 2. ANÁLISE DE CONFIGURAÇÃO
const nextConfigPath = path.join(__dirname, '..', 'next.config.js')
let nextConfigSize = 0
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
  nextConfigSize = nextConfig.split('\n').length
}

console.log('\n⚙️  ANÁLISE DE CONFIGURAÇÃO:')
console.log(`   ▸ next.config.js: ${nextConfigSize} linhas`)

if (nextConfigSize > 100) {
  console.log('   ⚠️  CRÍTICO: Configuração muito complexa (>100 linhas)')
} else if (nextConfigSize > 50) {
  console.log('   ⚠️  ALTO: Configuração complexa (>50 linhas)')
} else {
  console.log('   ✅ OK: Configuração simplificada')
}

// 3. ANÁLISE DE ESTRUTURA DE COMPONENTES
const componentDirs = []
const srcPath = path.join(__dirname, '..', 'src')

function findComponentDirs(dir, depth = 0) {
  if (depth > 3) return
  
  try {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const itemPath = path.join(dir, item)
      const stats = fs.statSync(itemPath)
        if (stats.isDirectory()) {
        if (item.toLowerCase().includes('component') || 
            item === 'ui' || 
            item === 'widgets' || 
            item === 'elements') {
          componentDirs.push(itemPath.replace(path.join(__dirname, '..'), ''))
        }
        findComponentDirs(itemPath, depth + 1)
      }
    }
  } catch (e) {
    // Ignorar erros de acesso
  }
}

if (fs.existsSync(srcPath)) {
  findComponentDirs(srcPath)
}

console.log('\n🧩 ANÁLISE DE ESTRUTURA:')
console.log(`   ▸ Diretórios de componentes: ${componentDirs.length}`)
componentDirs.forEach(dir => console.log(`     - ${dir}`))

if (componentDirs.length > 3) {
  console.log('   ⚠️  CRÍTICO: Estrutura fragmentada (>3 diretórios)')
} else if (componentDirs.length > 1) {
  console.log('   ⚠️  MODERADO: Estrutura dispersa')
} else {
  console.log('   ✅ OK: Estrutura consolidada')
}

// 4. ANÁLISE DE BUILD
const nextDir = path.join(__dirname, '..', '.next')
let buildExists = fs.existsSync(nextDir)

console.log('\n🔨 ANÁLISE DE BUILD:')
console.log(`   ▸ Build existente: ${buildExists ? 'Sim' : 'Não'}`)

if (buildExists) {
  try {
    const stats = fs.statSync(nextDir)
    console.log(`   ▸ Última build: ${stats.mtime.toLocaleString()}`)
  } catch (e) {
    console.log('   ▸ Erro ao ler informações de build')
  }
}

// 5. SCORE ARQUITETURAL
let score = 100
let issues = []

if (totalDeps > 50) {
  score -= 30
  issues.push('CRÍTICO: Excesso de dependências')
} else if (totalDeps > 30) {
  score -= 15
  issues.push('Dependências elevadas')
}

if (nextConfigSize > 100) {
  score -= 25
  issues.push('CRÍTICO: Configuração muito complexa')
} else if (nextConfigSize > 50) {
  score -= 15
  issues.push('Configuração complexa')
}

if (componentDirs.length > 3) {
  score -= 20
  issues.push('CRÍTICO: Estrutura fragmentada')
} else if (componentDirs.length > 1) {
  score -= 10
  issues.push('Estrutura dispersa')
}

console.log('\n📊 SCORE ARQUITETURAL:')
console.log(`   ▸ Score: ${score}/100`)

if (score >= 80) {
  console.log('   ✅ EXCELENTE: Arquitetura enterprise-ready')
} else if (score >= 60) {
  console.log('   ⚠️  BOM: Pequenos ajustes necessários')
} else if (score >= 40) {
  console.log('   ⚠️  MODERADO: Refatoração recomendada')
} else {
  console.log('   🚨 CRÍTICO: Transformação arquitetural necessária')
}

console.log('\n🔧 ISSUES IDENTIFICADAS:')
if (issues.length === 0) {
  console.log('   ✅ Nenhuma issue crítica encontrada')
} else {
  issues.forEach(issue => console.log(`   ▸ ${issue}`))
}

// 6. RECOMENDAÇÕES
console.log('\n💡 RECOMENDAÇÕES IMEDIATAS:')

if (totalDeps > 40) {
  console.log('   1. Auditar e remover dependências desnecessárias')
  console.log('   2. Migrar para pnpm para otimização')
}

if (nextConfigSize > 50) {
  console.log('   3. Simplificar next.config.js')
  console.log('   4. Usar configurações padrão do Next.js')
}

if (componentDirs.length > 1) {
  console.log('   5. Consolidar estrutura de componentes')
  console.log('   6. Definir arquitetura padrão (src/components)')
}

console.log('\n📋 PRÓXIMOS PASSOS:')
console.log('   ▸ npm run enterprise:validate (validação detalhada)')
console.log('   ▸ npm run enterprise:remediate-critical (correções automáticas)')
console.log('   ▸ npm run enterprise:performance (análise de performance)')

console.log('\n🏗️  Diagnóstico concluído!\n')
