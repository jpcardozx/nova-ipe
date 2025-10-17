#!/usr/bin/env node

/**
 * 🚑 Script de Recuperação de Imóveis Deletados
 * 
 * Usa a API de time-travel do Sanity para recuperar imóveis deletados
 * 
 * USO:
 * node scripts/recover-deleted-imovel.js list                    # Lista imóveis deletados nas últimas 4 horas
 * node scripts/recover-deleted-imovel.js restore <id>            # Restaura um imóvel pelo ID
 * node scripts/recover-deleted-imovel.js restore-slug <slug>     # Restaura um imóvel pelo slug
 * node scripts/recover-deleted-imovel.js check-draft <id>        # Verifica se existe draft
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Carrega variáveis de ambiente
dotenv.config()
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN || 
              process.env.SANITY_API_WRITE_TOKEN || 
              process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!token) {
  console.error('❌ Token do Sanity não encontrado!')
  console.error('Configure uma das seguintes variáveis no .env.local:')
  console.error('  - SANITY_API_TOKEN')
  console.error('  - SANITY_API_WRITE_TOKEN')
  console.error('  - NEXT_PUBLIC_SANITY_TOKEN')
  console.error('')
  console.error('Obtenha um token em: https://www.sanity.io/manage')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-10-16',
  useCdn: false
})

// Horário 2 horas atrás (pode ajustar conforme necessário)
const TWO_HOURS_AGO = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
const FOUR_HOURS_AGO = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()

/**
 * Lista todos os imóveis que existiam há 4 horas mas não existem mais
 */
async function listDeletedImoveis() {
  console.log('\n🔍 Buscando imóveis deletados...\n')
  console.log(`📅 Comparando: ${FOUR_HOURS_AGO} vs agora\n`)

  try {
    // Busca imóveis que existiam 4 horas atrás
    const imoveisAntigos = await client.fetch(
      '*[_type == "imovel"] | order(_updatedAt desc) {_id, _updatedAt, titulo, "slug": slug.current, categoria->{name}, finalidade, endereco}',
      {},
      { at: FOUR_HOURS_AGO }
    )

    // Busca imóveis atuais
    const imoveisAtuais = await client.fetch(
      '*[_type == "imovel"]{_id}'
    )

    const idsAtuais = new Set(imoveisAtuais.map(i => i._id))
    const deletados = imoveisAntigos.filter(i => !idsAtuais.has(i._id))

    if (deletados.length === 0) {
      console.log('✅ Nenhum imóvel foi deletado nas últimas 4 horas')
      console.log('\n💡 Dica: Se o imóvel foi deletado antes disso, ajuste a constante FOUR_HOURS_AGO no script')
      return
    }

    console.log(`🔴 ${deletados.length} imóvel(is) deletado(s) encontrado(s):\n`)

    deletados.forEach((imovel, index) => {
      console.log(`${index + 1}. ${imovel.titulo || 'Sem título'}`)
      console.log(`   ID: ${imovel._id}`)
      console.log(`   Slug: ${imovel.slug || 'N/A'}`)
      console.log(`   Categoria: ${imovel.categoria?.name || 'N/A'}`)
      console.log(`   Finalidade: ${imovel.finalidade || 'N/A'}`)
      console.log(`   Endereço: ${imovel.endereco || 'N/A'}`)
      console.log(`   Última atualização: ${new Date(imovel._updatedAt).toLocaleString('pt-BR')}`)
      console.log('')
    })

    console.log('📝 Para restaurar, use:')
    console.log(`   node scripts/recover-deleted-imovel.js restore <id>`)
    console.log('   ou')
    console.log(`   node scripts/recover-deleted-imovel.js restore-slug <slug>`)

  } catch (error) {
    console.error('❌ Erro ao buscar imóveis:', error.message)
    throw error
  }
}

/**
 * Busca um imóvel no histórico pelo ID
 */
async function fetchDeletedImovel(id, timeAgo = FOUR_HOURS_AGO) {
  console.log(`\n🔍 Buscando imóvel ${id} no histórico...`)
  console.log(`📅 Data: ${timeAgo}\n`)

  try {
    const doc = await client.fetch(
      '*[_id == $id][0]',
      { id },
      { at: timeAgo }
    )

    if (!doc) {
      console.log('❌ Imóvel não encontrado nesse período')
      console.log('💡 Tente ajustar a data ou verifique o ID')
      return null
    }

    console.log('✅ Imóvel encontrado!')
    console.log(`   Título: ${doc.titulo || 'N/A'}`)
    console.log(`   Slug: ${doc.slug?.current || 'N/A'}`)
    console.log(`   Tipo: ${doc._type}`)
    console.log('')

    return doc
  } catch (error) {
    console.error('❌ Erro ao buscar imóvel:', error.message)
    throw error
  }
}

/**
 * Busca um imóvel no histórico pelo slug
 */
async function fetchDeletedImovelBySlug(slug, timeAgo = FOUR_HOURS_AGO) {
  console.log(`\n🔍 Buscando imóvel com slug "${slug}" no histórico...`)
  console.log(`📅 Data: ${timeAgo}\n`)

  try {
    const doc = await client.fetch(
      '*[_type == "imovel" && slug.current == $slug][0]',
      { slug },
      { at: timeAgo }
    )

    if (!doc) {
      console.log('❌ Imóvel não encontrado nesse período')
      console.log('💡 Tente ajustar a data ou verifique o slug')
      return null
    }

    console.log('✅ Imóvel encontrado!')
    console.log(`   ID: ${doc._id}`)
    console.log(`   Título: ${doc.titulo || 'N/A'}`)
    console.log(`   Tipo: ${doc._type}`)
    console.log('')

    return doc
  } catch (error) {
    console.error('❌ Erro ao buscar imóvel:', error.message)
    throw error
  }
}

/**
 * Verifica se existe draft do documento
 */
async function checkDraft(id) {
  const draftId = id.startsWith('drafts.') ? id : `drafts.${id}`
  const publishedId = id.replace('drafts.', '')

  console.log(`\n🔍 Verificando drafts...\n`)

  try {
    const docs = await client.fetch(
      '*[_id in [$draft, $published]]{_id, _type, titulo, "slug": slug.current}',
      { draft: draftId, published: publishedId }
    )

    if (docs.length === 0) {
      console.log('❌ Nenhum draft ou documento publicado encontrado')
      return false
    }

    console.log(`✅ ${docs.length} documento(s) encontrado(s):\n`)
    docs.forEach(doc => {
      console.log(`   ${doc._id.startsWith('drafts.') ? '📝 Draft' : '📄 Publicado'}: ${doc._id}`)
      console.log(`   Título: ${doc.titulo || 'N/A'}`)
      console.log('')
    })

    return docs.length > 0
  } catch (error) {
    console.error('❌ Erro ao verificar draft:', error.message)
    throw error
  }
}

/**
 * Restaura um imóvel deletado
 */
async function restoreImovel(doc) {
  console.log(`\n🚑 Restaurando imóvel: ${doc.titulo || doc._id}`)
  console.log(`   ID: ${doc._id}\n`)

  try {
    // Cria o documento com o mesmo ID original
    const result = await client
      .transaction()
      .createIfNotExists(doc)
      .commit()

    console.log('✅ Imóvel restaurado com sucesso!')
    console.log(`   ID: ${result[0]._id}`)
    console.log(`   Transação: ${result[0]._rev}`)
    console.log('')
    console.log('🎉 Pronto! Verifique no Studio:')
    console.log(`   /studio/desk/imovel;${doc._id}`)

    return result
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  O documento já existe!')
      console.log('   Use createOrReplace se quiser sobrescrever')
    } else {
      console.error('❌ Erro ao restaurar:', error.message)
    }
    throw error
  }
}

/**
 * Main CLI
 */
async function main() {
  const command = process.argv[2]
  const arg = process.argv[3]

  console.log('🚑 Ferramenta de Recuperação de Imóveis - Ipê Imóveis')
  console.log(`📦 Projeto: ${projectId} / Dataset: ${dataset}`)

  try {
    switch (command) {
      case 'list':
        await listDeletedImoveis()
        break

      case 'restore':
        if (!arg) {
          console.error('\n❌ Forneça o ID do imóvel')
          console.error('   Uso: node scripts/recover-deleted-imovel.js restore <id>')
          process.exit(1)
        }
        const doc = await fetchDeletedImovel(arg)
        if (doc) {
          await restoreImovel(doc)
        }
        break

      case 'restore-slug':
        if (!arg) {
          console.error('\n❌ Forneça o slug do imóvel')
          console.error('   Uso: node scripts/recover-deleted-imovel.js restore-slug <slug>')
          process.exit(1)
        }
        const docBySlug = await fetchDeletedImovelBySlug(arg)
        if (docBySlug) {
          await restoreImovel(docBySlug)
        }
        break

      case 'check-draft':
        if (!arg) {
          console.error('\n❌ Forneça o ID do imóvel')
          console.error('   Uso: node scripts/recover-deleted-imovel.js check-draft <id>')
          process.exit(1)
        }
        await checkDraft(arg)
        break

      default:
        console.log('\n📖 Uso:')
        console.log('   list              - Lista imóveis deletados nas últimas 4 horas')
        console.log('   restore <id>      - Restaura um imóvel pelo ID')
        console.log('   restore-slug <slug> - Restaura um imóvel pelo slug')
        console.log('   check-draft <id>  - Verifica se existe draft do imóvel')
        console.log('')
        console.log('🔍 Exemplos:')
        console.log('   node scripts/recover-deleted-imovel.js list')
        console.log('   node scripts/recover-deleted-imovel.js restore imovel-abc123')
        console.log('   node scripts/recover-deleted-imovel.js restore-slug casa-em-guararema')
        console.log('')
    }
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message)
    process.exit(1)
  }
}

main()
