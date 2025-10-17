#!/usr/bin/env node

/**
 * 🚨 Script de Emergência Total
 * 
 * Tenta recuperar um imóvel usando TODAS as estratégias possíveis:
 * 1. Verifica se existe draft
 * 2. Busca no histórico (várias janelas de tempo)
 * 3. Busca por slug/título parcial
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN || 
              process.env.SANITY_API_WRITE_TOKEN || 
              process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!token) {
  console.error('❌ Configure o token primeiro!')
  console.error('Execute: ./scripts/setup-recovery.sh')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-10-16',
  useCdn: false
})

/**
 * Busca em múltiplas janelas de tempo
 */
async function searchAllTimeWindows(searchTerm) {
  const windows = [
    { hours: 2, label: '2 horas' },
    { hours: 4, label: '4 horas' },
    { hours: 8, label: '8 horas' },
    { hours: 24, label: '24 horas' },
    { hours: 48, label: '48 horas' },
    { hours: 168, label: '1 semana' },
  ]

  console.log('🔍 Buscando em múltiplas janelas de tempo...\n')

  const results = []

  for (const window of windows) {
    const timeAgo = new Date(Date.now() - window.hours * 60 * 60 * 1000).toISOString()
    
    try {
      // Busca por título ou endereço contendo o termo
      const found = await client.fetch(
        `*[_type == "imovel" && (
          titulo match $term ||
          endereco match $term ||
          slug.current match $term
        )] {
          _id, 
          _updatedAt, 
          titulo, 
          "slug": slug.current, 
          endereco,
          categoria->{name}, 
          finalidade,
          preco
        }`,
        { term: `*${searchTerm}*` },
        { at: timeAgo }
      )

      if (found.length > 0) {
        console.log(`✅ ${found.length} encontrado(s) há ${window.label}`)
        
        found.forEach(doc => {
          // Verifica se já existe atualmente
          const exists = results.some(r => r._id === doc._id)
          if (!exists) {
            results.push({
              ...doc,
              foundAt: window.label,
              timestamp: timeAgo
            })
          }
        })
      }
    } catch (error) {
      console.error(`❌ Erro buscando há ${window.label}:`, error.message)
    }
  }

  return results
}

/**
 * Verifica se documento existe atualmente (incluindo draft)
 */
async function checkCurrentStatus(docId) {
  const docs = await client.fetch(
    `*[_id in [$published, $draft]]{_id, _type, titulo}`,
    {
      published: docId,
      draft: `drafts.${docId}`
    }
  )

  return docs
}

/**
 * Main
 */
async function main() {
  const searchTerm = process.argv[2]

  console.log('🚨 MODO DE EMERGÊNCIA - Busca Completa\n')
  console.log(`📦 Projeto: ${projectId} / Dataset: ${dataset}\n`)

  if (!searchTerm) {
    console.log('💡 Uso: node scripts/emergency-recovery.js <termo_de_busca>')
    console.log('\nExemplos:')
    console.log('  node scripts/emergency-recovery.js "Rua das Flores"')
    console.log('  node scripts/emergency-recovery.js "Casa com 3 quartos"')
    console.log('  node scripts/emergency-recovery.js casa-centro')
    console.log('\n🔍 Busca por: título, endereço ou slug')
    process.exit(0)
  }

  console.log(`🔎 Termo de busca: "${searchTerm}"\n`)
  console.log('─'.repeat(70))
  console.log('')

  // 1. Busca em múltiplas janelas
  const historicalResults = await searchAllTimeWindows(searchTerm)

  if (historicalResults.length === 0) {
    console.log('\n❌ Nenhum resultado encontrado em nenhuma janela de tempo')
    console.log('\n💡 Tente:')
    console.log('   - Usar parte do endereço ou título')
    console.log('   - Verificar se o nome está correto')
    console.log('   - Usar o slug (URL do imóvel)')
    process.exit(0)
  }

  console.log(`\n\n📋 ${historicalResults.length} resultado(s) encontrado(s):\n`)
  console.log('─'.repeat(70))

  // 2. Verifica status atual de cada resultado
  for (let i = 0; i < historicalResults.length; i++) {
    const doc = historicalResults[i]
    
    console.log(`\n${i + 1}. ${doc.titulo || 'Sem título'}`)
    console.log(`   📍 ${doc.endereco || 'N/A'}`)
    console.log(`   💰 R$ ${doc.preco?.toLocaleString('pt-BR') || 'N/A'}`)
    console.log(`   🏷️  ${doc.finalidade || 'N/A'} - ${doc.categoria?.name || 'N/A'}`)
    console.log(`   🆔 ID: ${doc._id}`)
    console.log(`   🔗 Slug: ${doc.slug || 'N/A'}`)
    console.log(`   🕐 Encontrado: há ${doc.foundAt}`)

    // Verifica se existe atualmente
    const current = await checkCurrentStatus(doc._id)
    
    if (current.length > 0) {
      console.log(`   ✅ Status: EXISTE ATUALMENTE`)
      current.forEach(c => {
        const type = c._id.startsWith('drafts.') ? 'Draft' : 'Publicado'
        console.log(`      - ${type}: ${c._id}`)
      })
    } else {
      console.log(`   🔴 Status: DELETADO (pode ser restaurado)`)
    }
  }

  console.log('\n' + '─'.repeat(70))

  // 3. Instruções de recuperação
  console.log('\n\n📝 PRÓXIMOS PASSOS:\n')

  const deleted = historicalResults.filter(async doc => {
    const current = await checkCurrentStatus(doc._id)
    return current.length === 0
  })

  if (deleted.length > 0) {
    console.log('Para restaurar um dos imóveis deletados, use:\n')
    deleted.forEach((doc, i) => {
      console.log(`   ${i + 1}. node scripts/recover-deleted-imovel.js restore ${doc._id}`)
    })
  }

  const existing = historicalResults.filter(async doc => {
    const current = await checkCurrentStatus(doc._id)
    return current.length > 0
  })

  if (existing.length > 0) {
    console.log('\n\nImóveis que JÁ EXISTEM (não precisam restauração):')
    existing.forEach(doc => {
      console.log(`   - ${doc.titulo} (${doc._id})`)
    })
  }

  console.log('\n\n💡 OU use o modo interativo:')
  console.log('   node scripts/recover-imovel-interactive.js\n')
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error.message)
  console.error('\nStack:', error.stack)
  process.exit(1)
})
