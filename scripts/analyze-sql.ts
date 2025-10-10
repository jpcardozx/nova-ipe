import { readFileSync } from 'fs'

function parseRowValues(row: string): string[] {
  const values: string[] = []
  let current = ''
  let inString = false
  let escapeNext = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (escapeNext) {
      current += char
      escapeNext = false
      continue
    }
    if (char === '\\') {
      escapeNext = true
      continue
    }
    if (char === "'") {
      inString = !inString
      continue
    }
    if (!inString && char === ',') {
      values.push(current)
      current = ''
      continue
    }
    current += char
  }
  values.push(current)
  return values
}

const sqlContent = readFileSync(
  'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql',
  'utf-8'
)
const insertPattern = /INSERT INTO `wp_wpl_properties` VALUES\s*\(([\s\S]+?)\);/gi
const matches = Array.from(sqlContent.matchAll(insertPattern))

let totalRows = 0
let deletedCount = 0
let activeCount = 0

for (const match of matches) {
  const valuesStr = match[1]
  const rows = valuesStr.split(/\),\s*\(/g)

  for (let row of rows) {
    row = row.replace(/^\(/, '').replace(/\)$/, '')
    const values = parseRowValues(row)

    if (values.length > 2) {
      totalRows++
      const deleted = parseInt(values[2]) || 0
      if (deleted === 1) {
        deletedCount++
      } else {
        activeCount++
      }
    }
  }
}

console.log('📊 ANÁLISE COMPLETA DO SQL:')
console.log('─'.repeat(50))
console.log('Total de registros:', totalRows)
console.log('Properties ATIVAS (deleted=0):', activeCount)
console.log('Properties DELETADAS (deleted=1):', deletedCount)
console.log('─'.repeat(50))
console.log('')
console.log('✅ No Supabase: 141 properties')
console.log(
  activeCount === 141
    ? '✅ CORRETO: Todas as ativas foram importadas!'
    : `❌ PROBLEMA: Faltam ${activeCount - 141} properties`
)
