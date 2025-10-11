#!/usr/bin/env node

/**
 * 🎨 Migração Automática para Design Tokens
 * 
 * Converte classes Tailwind hardcoded para tokens semânticos
 * ✅ SEGURO: Cria backup automático antes de qualquer modificação
 * ✅ REVERSÍVEL: Use --restore para restaurar backups
 * ✅ DRY-RUN: Use --dry-run para ver mudanças sem aplicar
 * 
 * Uso: node scripts/migrate-to-tokens.js [arquivo.tsx] [opções]
 */

const fs = require('fs')
const path = require('path')

// Configurações
let DRY_RUN = false
let RESTORE_MODE = false
let VERBOSE = false

// Mapeamento de classes antigas → novas
const replacements = [
  // Backgrounds
  { old: /bg-white(?!\S)/g, new: 'bg-surface' },
  { old: /bg-gray-50(?!\S)/g, new: 'bg-background' },
  { old: /bg-gray-100(?!\S)/g, new: 'bg-surface-elevated' },
  { old: /bg-slate-50(?!\S)/g, new: 'bg-surface' },
  
  // Text Colors
  { old: /text-slate-900(?!\S)/g, new: 'text-foreground' },
  { old: /text-gray-900(?!\S)/g, new: 'text-foreground' },
  { old: /text-slate-600(?!\S)/g, new: 'text-foreground-secondary' },
  { old: /text-gray-600(?!\S)/g, new: 'text-foreground-secondary' },
  { old: /text-slate-400(?!\S)/g, new: 'text-foreground-muted' },
  { old: /text-gray-400(?!\S)/g, new: 'text-foreground-muted' },
  
  // Borders
  { old: /border-slate-200(?!\S)/g, new: 'border-default' },
  { old: /border-gray-200(?!\S)/g, new: 'border-default' },
  { old: /border-slate-300(?!\S)/g, new: 'border-strong' },
  { old: /border-gray-300(?!\S)/g, new: 'border-strong' },
  
  // Remove dark: variants (agora automático)
  { old: /dark:bg-slate-800\s?/g, new: '' },
  { old: /dark:bg-gray-800\s?/g, new: '' },
  { old: /dark:text-slate-100\s?/g, new: '' },
  { old: /dark:text-white\s?/g, new: '' },
  { old: /dark:border-slate-700\s?/g, new: '' },
  { old: /dark:border-gray-700\s?/g, new: '' },
]

// Card pattern - substitui blocos completos
const cardPattern = /className="[^"]*bg-white[^"]*border[^"]*rounded-lg[^"]*p-\d+[^"]*"/g

// Função para mostrar diff simples
function showDiff(original, modified) {
  const originalLines = original.split('\n')
  const modifiedLines = modified.split('\n')
  let diff = ''
  
  modifiedLines.forEach((line, i) => {
    if (line !== originalLines[i] && originalLines[i]) {
      diff += `\n  ❌ ANTES:  ${originalLines[i].trim()}`
      diff += `\n  ✅ DEPOIS: ${line.trim()}\n`
    }
  })
  
  return diff || '  (Nenhuma mudança visível em linhas individuais)'
}

function restoreBackup(filePath) {
  const backupPath = filePath + '.backup'
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup não encontrado: ${backupPath}`)
    return false
  }

  const backup = fs.readFileSync(backupPath, 'utf-8')
  fs.writeFileSync(filePath, backup, 'utf-8')
  console.log(`✅ Restaurado: ${filePath}`)
  
  // Opcionalmente remover o backup
  // fs.unlinkSync(backupPath)
  
  return true
}

function migrateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`)
    process.exit(1)
  }

  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content
  
  // Validação: verificar se já tem backup
  const backupPath = filePath + '.backup'
  const hasBackup = fs.existsSync(backupPath)
  
  if (hasBackup && !DRY_RUN) {
    console.log(`⚠️  Backup já existe: ${backupPath}`)
    console.log(`   Para re-migrar, primeiro restaure com: --restore`)
    return
  }

  // Aplicar todas as substituições
  replacements.forEach(({ old, new: newClass }) => {
    content = content.replace(old, newClass)
  })
  
  // FIX: Garantir quebra de linha após 'use client'
  content = content.replace(/('use client')\s*(import)/g, "$1\n\n$2")
  content = content.replace(/('use client')\s*(export)/g, "$1\n\n$2")
  content = content.replace(/('use client')\s*(const)/g, "$1\n\n$2")

  // Detectar e sugerir cards
  const cardMatches = content.match(cardPattern)
  if (cardMatches) {
    console.log('\n📦 Cards detectados:')
    cardMatches.forEach(match => {
      console.log(`   ${match}`)
      console.log(`   → Considere usar: className="card"`)
    })
  }

  // Limpar classes vazias duplas
  content = content.replace(/\s{2,}/g, ' ')
  content = content.replace(/className="\s+/g, 'className="')
  content = content.replace(/\s+"/g, '"')

  if (content === original) {
    console.log('✅ Arquivo já está usando design tokens!')
    return
  }

  // DRY RUN: Apenas mostrar mudanças
  if (DRY_RUN) {
    console.log('\n🔍 PREVIEW (DRY-RUN) - Mudanças que seriam aplicadas:')
    const diff = showDiff(original, content)
    console.log(diff)
    return
  }

  // Criar backup (usando a variável já declarada acima)
  if (!hasBackup) {
    fs.writeFileSync(backupPath, original, 'utf-8')
    console.log(`💾 Backup criado: ${backupPath}`)
  }

  // Salvar versão migrada
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Arquivo migrado: ${filePath}`)

  // Estatísticas
  const oldLines = original.split('\n').length
  const newLines = content.split('\n').length
  const reduction = ((original.length - content.length) / original.length * 100).toFixed(1)
  
  console.log(`\n📊 Estatísticas:`)
  console.log(`   Linhas: ${oldLines} → ${newLines}`)
  console.log(`   Tamanho: ${original.length} → ${content.length} bytes`)
  console.log(`   Redução: ${reduction}%`)
}

function migrateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      migrateDirectory(fullPath)
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      console.log(`\n🔄 Migrando: ${fullPath}`)
      migrateFile(fullPath)
    }
  })
}

// Main
const args = process.argv.slice(2)
let target = null

// Parse argumentos
args.forEach(arg => {
  if (arg === '--dry-run' || arg === '-d') {
    DRY_RUN = true
  } else if (arg === '--restore' || arg === '-r') {
    RESTORE_MODE = true
  } else if (arg === '--verbose' || arg === '-v') {
    VERBOSE = true
  } else if (!arg.startsWith('--')) {
    target = arg
  }
})

if (!target) {
  console.log(`
🎨 Migração Automática para Design Tokens

✅ SEGURO: Cria backup automático (.backup) antes de modificar
✅ REVERSÍVEL: Use --restore para desfazer mudanças
✅ PREVIEW: Use --dry-run para ver mudanças sem aplicar

Uso:
  node scripts/migrate-to-tokens.js <arquivo> [opções]

Opções:
  --dry-run, -d     Ver mudanças sem aplicar (PREVIEW)
  --restore, -r     Restaurar do backup
  --verbose, -v     Mostrar mais detalhes

Exemplos:
  # Preview de mudanças (seguro)
  node scripts/migrate-to-tokens.js app/dashboard/page.tsx --dry-run

  # Aplicar migração (cria backup automático)
  node scripts/migrate-to-tokens.js app/dashboard/page.tsx

  # Restaurar do backup
  node scripts/migrate-to-tokens.js app/dashboard/page.tsx --restore

  # Migrar diretório inteiro
  node scripts/migrate-to-tokens.js app/dashboard/ --dry-run

🛡️  GARANTIAS DE SEGURANÇA:
  • Backup automático antes de qualquer modificação
  • Detecção de backup existente (previne sobrescrever)
  • Modo dry-run para revisar mudanças
  • Reversível com --restore
  • Validação de arquivos antes de processar

📊 BREAKPOINTS:
  • Backup criado → Pode reverter a qualquer momento
  • Mudanças aplicadas → Testável antes de deletar backup
  • Dry-run → Zero risco, apenas visualização
  `)
  process.exit(1)
}

const targetPath = path.resolve(target)

if (!fs.existsSync(targetPath)) {
  console.error(`❌ Caminho não encontrado: ${targetPath}`)
  process.exit(1)
}

const stat = fs.statSync(targetPath)

// Modo RESTORE
if (RESTORE_MODE) {
  console.log('🔄 Modo RESTORE ativado\n')
  
  if (stat.isDirectory()) {
    console.log('⚠️  Restauração de diretório ainda não implementada')
    console.log('   Restaure arquivos individualmente')
  } else {
    restoreBackup(targetPath)
  }
  
  console.log('\n✨ Restauração concluída!')
  process.exit(0)
}

// Modo DRY-RUN
if (DRY_RUN) {
  console.log('� Modo DRY-RUN ativado (apenas preview)\n')
}

console.log('�🚀 Iniciando migração...\n')

if (stat.isDirectory()) {
  migrateDirectory(targetPath)
} else {
  migrateFile(targetPath)
}

console.log('\n✨ Migração concluída!')

if (!DRY_RUN) {
  console.log('\n📚 Próximos passos:')
  console.log('   1. Teste as páginas migradas')
  console.log('   2. Verifique o dark mode')
  console.log('   3. Ajuste manualmente se necessário')
  console.log('   4. Delete os .backup após confirmar')
  console.log('\n🔄 Para reverter:')
  console.log('   node scripts/migrate-to-tokens.js <arquivo> --restore')
} else {
  console.log('\n📚 Para aplicar as mudanças:')
  console.log('   node scripts/migrate-to-tokens.js ' + target)
}
