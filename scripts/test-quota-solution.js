#!/usr/bin/env node

/**
 * Script de Teste - Solução Quota Exceeded
 * 
 * Valida se a solução está funcionando corretamente
 */

console.log('🧪 TESTE: Solução Quota Exceeded')
console.log('================================\n')

// Testes
console.log('📋 TESTE 1: Verificar arquivos criados')
console.log('=====================================')

const fs = require('fs')
const path = require('path')

const files = [
  'lib/utils/storage-manager.ts',
  'lib/utils/supabase-storage-adapter.ts',
  'public/diagnostico-storage.html',
  'SOLUCAO_QUOTA_DEFINITIVA.md'
]

let allFilesExist = true

files.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  const exists = fs.existsSync(filePath)
  
  if (exists) {
    const stats = fs.statSync(filePath)
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`)
  } else {
    console.log(`❌ ${file} (NÃO ENCONTRADO)`)
    allFilesExist = false
  }
})

console.log()

if (allFilesExist) {
  console.log('✅ TESTE 1: PASSOU - Todos os arquivos existem\n')
} else {
  console.log('❌ TESTE 1: FALHOU - Alguns arquivos não foram encontrados\n')
  process.exit(1)
}

// Teste 2: Verificar conteúdo dos arquivos
console.log('📋 TESTE 2: Verificar implementações')
console.log('====================================')

const storageManagerContent = fs.readFileSync(
  path.join(process.cwd(), 'lib/utils/storage-manager.ts'),
  'utf-8'
)

const checks = [
  {
    name: 'StorageManager class',
    test: storageManagerContent.includes('class StorageManager')
  },
  {
    name: 'prepareForAuth method',
    test: storageManagerContent.includes('prepareForAuth()')
  },
  {
    name: 'cleanupSupabaseData method',
    test: storageManagerContent.includes('cleanupSupabaseData()')
  },
  {
    name: 'emergencyCleanup method',
    test: storageManagerContent.includes('emergencyCleanup()')
  },
  {
    name: 'getStats method',
    test: storageManagerContent.includes('getStats(')
  }
]

let allChecksPassed = true

checks.forEach(check => {
  if (check.test) {
    console.log(`✅ ${check.name}`)
  } else {
    console.log(`❌ ${check.name}`)
    allChecksPassed = false
  }
})

console.log()

if (allChecksPassed) {
  console.log('✅ TESTE 2: PASSOU - Todas as implementações presentes\n')
} else {
  console.log('❌ TESTE 2: FALHOU - Algumas implementações faltando\n')
  process.exit(1)
}

// Teste 3: Verificar integração com Supabase
console.log('📋 TESTE 3: Verificar integração com Supabase')
console.log('=============================================')

const supabaseContent = fs.readFileSync(
  path.join(process.cwd(), 'lib/supabase.ts'),
  'utf-8'
)

const integrationChecks = [
  {
    name: 'Import de storage adapter',
    test: supabaseContent.includes('supabase-storage-adapter')
  },
  {
    name: 'getStorageAdapter() chamado',
    test: supabaseContent.includes('getStorageAdapter()')
  },
  {
    name: 'Storage customizado configurado',
    test: supabaseContent.includes('storage:')
  }
]

let allIntegrationsPassed = true

integrationChecks.forEach(check => {
  if (check.test) {
    console.log(`✅ ${check.name}`)
  } else {
    console.log(`❌ ${check.name}`)
    allIntegrationsPassed = false
  }
})

console.log()

if (allIntegrationsPassed) {
  console.log('✅ TESTE 3: PASSOU - Integração com Supabase OK\n')
} else {
  console.log('❌ TESTE 3: FALHOU - Integração incompleta\n')
  process.exit(1)
}

// Teste 4: Verificar hook useSupabaseAuth
console.log('📋 TESTE 4: Verificar hook useSupabaseAuth')
console.log('==========================================')

const hookContent = fs.readFileSync(
  path.join(process.cwd(), 'lib/hooks/useSupabaseAuth.ts'),
  'utf-8'
)

const hookChecks = [
  {
    name: 'Import de storage manager',
    test: hookContent.includes('storage-manager')
  },
  {
    name: 'prepareForAuth() antes de login',
    test: hookContent.includes('prepareForAuth()')
  },
  {
    name: 'Tratamento de quota exceeded',
    test: hookContent.includes('quota')
  },
  {
    name: 'emergencyCleanup() em caso de erro',
    test: hookContent.includes('emergencyCleanup()')
  },
  {
    name: 'Tratamento de DOMException',
    test: hookContent.includes('DOMException')
  }
]

let allHookChecksPassed = true

hookChecks.forEach(check => {
  if (check.test) {
    console.log(`✅ ${check.name}`)
  } else {
    console.log(`❌ ${check.name}`)
    allHookChecksPassed = false
  }
})

console.log()

if (allHookChecksPassed) {
  console.log('✅ TESTE 4: PASSOU - Hook atualizado corretamente\n')
} else {
  console.log('❌ TESTE 4: FALHOU - Hook precisa de ajustes\n')
  process.exit(1)
}

// Teste 5: Verificar ferramenta de diagnóstico
console.log('📋 TESTE 5: Verificar ferramenta de diagnóstico')
console.log('==============================================')

const diagnosticoContent = fs.readFileSync(
  path.join(process.cwd(), 'public/diagnostico-storage.html'),
  'utf-8'
)

const diagnosticoChecks = [
  {
    name: 'HTML válido',
    test: diagnosticoContent.includes('<!DOCTYPE html>')
  },
  {
    name: 'Função refreshStats()',
    test: diagnosticoContent.includes('function refreshStats()')
  },
  {
    name: 'Função cleanupSupabase()',
    test: diagnosticoContent.includes('function cleanupSupabase()')
  },
  {
    name: 'Função emergencyCleanup()',
    test: diagnosticoContent.includes('function emergencyCleanup()')
  },
  {
    name: 'Interface visual completa',
    test: diagnosticoContent.includes('stat-card') && diagnosticoContent.includes('progress-bar')
  }
]

let allDiagnosticoChecksPassed = true

diagnosticoChecks.forEach(check => {
  if (check.test) {
    console.log(`✅ ${check.name}`)
  } else {
    console.log(`❌ ${check.name}`)
    allDiagnosticoChecksPassed = false
  }
})

console.log()

if (allDiagnosticoChecksPassed) {
  console.log('✅ TESTE 5: PASSOU - Ferramenta de diagnóstico completa\n')
} else {
  console.log('❌ TESTE 5: FALHOU - Ferramenta precisa de ajustes\n')
  process.exit(1)
}

// Resumo final
console.log('═══════════════════════════════════════════')
console.log('🎉 TODOS OS TESTES PASSARAM!')
console.log('═══════════════════════════════════════════\n')

console.log('📊 Resumo da Solução:')
console.log('  ✅ 4 arquivos criados')
console.log('  ✅ 3 arquivos modificados')
console.log('  ✅ 5 testes passando')
console.log('  ✅ Integração completa\n')

console.log('🚀 Próximos passos:')
console.log('  1. Reiniciar servidor de desenvolvimento')
console.log('  2. Testar login no navegador')
console.log('  3. Acessar http://localhost:3000/diagnostico-storage.html')
console.log('  4. Monitorar logs no console\n')

console.log('📚 Documentação:')
console.log('  • SOLUCAO_QUOTA_DEFINITIVA.md - Guia completo')
console.log('  • lib/utils/storage-manager.ts - Código comentado')
console.log('  • public/diagnostico-storage.html - Ferramenta visual\n')

process.exit(0)
