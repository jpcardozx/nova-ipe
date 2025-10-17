#!/usr/bin/env node

/**
 * 🔍 Busca Específica no Histórico do DRAFT
 * Última tentativa - buscar o draft que nunca foi publicado
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: '0nks58lj',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2025-10-16',
  useCdn: false
})

const DRAFT_ID = `drafts.d5476428-a47b-4075-9383-f0cf58f58d66`
const PUBLISHED_ID = `d5476428-a47b-4075-9383-f0cf58f58d66`
const TITULO = 'Casa Charmosa com Vista no Condomínio Alpes'

console.log('\n🔍 BUSCA HISTÓRICA DETALHADA - DRAFT')
console.log('═'.repeat(70))
console.log(`📋 Título esperado: ${TITULO}`)
console.log(`🆔 Draft ID: ${DRAFT_ID}`)
console.log(`🆔 Published ID: ${PUBLISHED_ID}`)
console.log('═'.repeat(70))
console.log('')

async function buscarDraftNoHistorico() {
  console.log('⏰ Buscando DRAFT em diferentes períodos...\n')
  
  const periodos = [
    { horas: 1, label: '1 hora' },
    { horas: 2, label: '2 horas' },
    { horas: 3, label: '3 horas' },
    { horas: 6, label: '6 horas' },
    { horas: 12, label: '12 horas' },
    { horas: 24, label: '1 dia' },
    { horas: 48, label: '2 dias' },
    { horas: 72, label: '3 dias' },
    { horas: 120, label: '5 dias' },
    { horas: 168, label: '1 semana' },
    { horas: 336, label: '2 semanas' },
    { horas: 720, label: '1 mês' },
  ]
  
  const encontrados = []
  
  for (const periodo of periodos) {
    const timeAgo = new Date(Date.now() - periodo.horas * 60 * 60 * 1000).toISOString()
    
    try {
      // Busca o draft E o publicado
      const [draft, publicado] = await Promise.all([
        client.fetch('*[_id == $id][0]', { id: DRAFT_ID }, { at: timeAgo }),
        client.fetch('*[_id == $id][0]', { id: PUBLISHED_ID }, { at: timeAgo })
      ])
      
      const status = []
      
      if (draft) {
        const temConteudo = draft.titulo || draft.endereco || draft.preco
        status.push(`Draft: ${temConteudo ? '✅ COM CONTEÚDO' : '⚠️  VAZIO'}`)
        
        if (temConteudo) {
          encontrados.push({
            tipo: 'draft',
            doc: draft,
            periodo: periodo.label,
            timeAgo,
            horas: periodo.horas
          })
        }
      } else {
        status.push('Draft: ❌')
      }
      
      if (publicado) {
        const temConteudo = publicado.titulo || publicado.endereco || publicado.preco
        status.push(`Publicado: ${temConteudo ? '✅ COM CONTEÚDO' : '⚠️  VAZIO'}`)
        
        if (temConteudo) {
          encontrados.push({
            tipo: 'publicado',
            doc: publicado,
            periodo: periodo.label,
            timeAgo,
            horas: periodo.horas
          })
        }
      } else {
        status.push('Publicado: ❌')
      }
      
      const statusStr = status.join(' | ')
      const icon = encontrados.some(e => e.horas === periodo.horas) ? '✅' : '❌'
      
      console.log(`${icon} ${periodo.label.padEnd(10)} (${new Date(timeAgo).toLocaleString('pt-BR')})`)
      console.log(`   ${statusStr}`)
      
    } catch (error) {
      console.log(`❌ ${periodo.label.padEnd(10)} Erro: ${error.message}`)
    }
  }
  
  return encontrados
}

async function mostrarResultados(encontrados) {
  console.log('\n' + '═'.repeat(70))
  console.log('📊 RESULTADOS DA BUSCA')
  console.log('═'.repeat(70))
  console.log('')
  
  if (encontrados.length === 0) {
    console.log('❌ NENHUM DOCUMENTO COM CONTEÚDO ENCONTRADO')
    console.log('')
    console.log('🔍 ANÁLISE:')
    console.log('   O documento (draft ou publicado) não foi encontrado em')
    console.log('   nenhum período dos últimos 30 dias.')
    console.log('')
    console.log('💡 ISSO SIGNIFICA:')
    console.log('   1. O documento nunca existiu com esse ID, OU')
    console.log('   2. Foi deletado há MAIS de 30 dias, OU')
    console.log('   3. O ID informado está incorreto')
    console.log('')
    console.log('🎯 PRÓXIMOS PASSOS:')
    console.log('   1. ✅ Confirme o ID exato no Studio')
    console.log('      Acesse: https://imobiliariaipe.com.br/studio')
    console.log('      Copie o ID completo da URL')
    console.log('')
    console.log('   2. ✅ Contate o suporte do Sanity')
    console.log('      https://www.sanity.io/help')
    console.log('      Project ID: 0nks58lj')
    console.log('      Dataset: production')
    console.log(`      Document ID: ${PUBLISHED_ID}`)
    console.log('      Usuário: julia@imobiliariaipe.com.br')
    console.log('      Data: 16/10/2025')
    console.log('')
    console.log('   3. ✅ Verifique Activity Log no Sanity Manage')
    console.log('      https://www.sanity.io/manage/personal/project/0nks58lj/activity')
    console.log('      Filtre por julia@imobiliariaipe.com.br')
    console.log('')
    return null
  }
  
  // Pega o mais recente
  const maisRecente = encontrados.sort((a, b) => b.horas - a.horas)[0]
  
  console.log(`✅ ${encontrados.length} versão(ões) encontrada(s)!`)
  console.log('')
  console.log('📄 VERSÃO MAIS RECENTE:')
  console.log('─'.repeat(70))
  console.log(`   Tipo: ${maisRecente.tipo.toUpperCase()}`)
  console.log(`   Período: ${maisRecente.periodo} atrás`)
  console.log(`   Timestamp: ${new Date(maisRecente.timeAgo).toLocaleString('pt-BR')}`)
  console.log('')
  console.log(`   ID: ${maisRecente.doc._id}`)
  console.log(`   Título: ${maisRecente.doc.titulo || 'N/A'}`)
  console.log(`   Endereço: ${maisRecente.doc.endereco || 'N/A'}`)
  console.log(`   Preço: R$ ${maisRecente.doc.preco?.toLocaleString('pt-BR') || 'N/A'}`)
  console.log(`   Categoria: ${maisRecente.doc.categoria?.name || 'N/A'}`)
  console.log(`   Fotos: ${maisRecente.doc.fotos?.length || 0}`)
  console.log('─'.repeat(70))
  console.log('')
  
  return maisRecente
}

async function restaurar(versao) {
  const { doc } = versao
  
  console.log('🚑 INICIANDO RESTAURAÇÃO...\n')
  
  // Remove _rev
  const { _rev, ...docLimpo } = doc
  
  // Garante que vai criar como PUBLICADO (sem drafts.)
  docLimpo._id = PUBLISHED_ID
  
  console.log(`📝 Restaurando como: ${docLimpo._id}`)
  console.log(`   Título: ${docLimpo.titulo}`)
  console.log('')
  console.log('⏱️  Aguarde 3 segundos... (Ctrl+C para cancelar)')
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   2...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   1...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('')
  
  try {
    const resultado = await client.createOrReplace(docLimpo)
    
    console.log('✅ SUCESSO! Documento restaurado!')
    console.log('─'.repeat(70))
    console.log(`   ID: ${resultado._id}`)
    console.log(`   Rev: ${resultado._rev}`)
    console.log('─'.repeat(70))
    console.log('')
    console.log('🎉 Acesse no Studio:')
    console.log(`   https://imobiliariaipe.com.br/studio/structure/imovel;${resultado._id}`)
    console.log('')
    
    // Remove draft vazio se existir
    try {
      await client.delete(DRAFT_ID)
      console.log('🗑️  Draft vazio removido')
    } catch (e) {
      // Ignora
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message)
    throw error
  }
}

async function main() {
  const encontrados = await buscarDraftNoHistorico()
  const versao = await mostrarResultados(encontrados)
  
  if (versao) {
    console.log('═'.repeat(70))
    await restaurar(versao)
  }
  
  console.log('═'.repeat(70))
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error.message)
  process.exit(1)
})
