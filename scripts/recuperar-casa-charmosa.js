#!/usr/bin/env node

/**
 * 🎯 Recuperação por Título - Casa Charmosa com Vista no Condomínio Alpes
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

const TITULO = 'Casa Charmosa com Vista no Condomínio Alpes'
const IMOVEL_ID = 'd5476428-a47b-4075-9383-f0cf58f58d66'

console.log('\n🎯 RECUPERAÇÃO POR TÍTULO')
console.log('═'.repeat(70))
console.log(`📋 Título: ${TITULO}`)
console.log(`🆔 ID: ${IMOVEL_ID}`)
console.log('═'.repeat(70))
console.log('')

async function buscarPorTituloNoHistorico() {
  console.log('🔍 Buscando por título no histórico...\n')
  
  const periodos = [
    { horas: 3, label: '3 horas' },
    { horas: 6, label: '6 horas' },
    { horas: 12, label: '12 horas' },
    { horas: 24, label: '1 dia' },
    { horas: 48, label: '2 dias' },
    { horas: 72, label: '3 dias' },
    { horas: 168, label: '1 semana' },
    { horas: 336, label: '2 semanas' },
    { horas: 720, label: '1 mês' },
  ]
  
  for (const periodo of periodos) {
    const timeAgo = new Date(Date.now() - periodo.horas * 60 * 60 * 1000).toISOString()
    
    try {
      console.log(`⏰ ${periodo.label} atrás (${new Date(timeAgo).toLocaleString('pt-BR')})...`)
      
      // Busca por título exato ou parcial
      const results = await client.fetch(
        `*[_type == "imovel" && (
          titulo match $titulo ||
          titulo match $tituloPartial1 ||
          titulo match $tituloPartial2
        )] {
          _id,
          _rev,
          _type,
          _createdAt,
          _updatedAt,
          titulo,
          "slug": slug.current,
          endereco,
          preco,
          categoria->{name},
          finalidade,
          descricao,
          fotos,
          dormitorios,
          banheiros,
          garagens,
          area_total,
          area_construida
        }`,
        {
          titulo: TITULO,
          tituloPartial1: '*Charmosa*Vista*Alpes*',
          tituloPartial2: '*Casa Charmosa*'
        },
        { at: timeAgo }
      )
      
      if (results.length > 0) {
        console.log(`   ✅ ENCONTRADO ${results.length} resultado(s)!\n`)
        
        for (const doc of results) {
          console.log('─'.repeat(70))
          console.log(`📄 DOCUMENTO RECUPERADO:\n`)
          console.log(`   ID: ${doc._id}`)
          console.log(`   Título: ${doc.titulo}`)
          console.log(`   Slug: ${doc.slug || 'N/A'}`)
          console.log(`   Endereço: ${doc.endereco || 'N/A'}`)
          console.log(`   Preço: R$ ${doc.preco?.toLocaleString('pt-BR') || 'N/A'}`)
          console.log(`   Categoria: ${doc.categoria?.name || 'N/A'}`)
          console.log(`   Finalidade: ${doc.finalidade || 'N/A'}`)
          console.log(`   Dormitórios: ${doc.dormitorios || 'N/A'}`)
          console.log(`   Banheiros: ${doc.banheiros || 'N/A'}`)
          console.log(`   Garagens: ${doc.garagens || 'N/A'}`)
          console.log(`   Área Total: ${doc.area_total || 'N/A'} m²`)
          console.log(`   Criado: ${doc._createdAt ? new Date(doc._createdAt).toLocaleString('pt-BR') : 'N/A'}`)
          console.log(`   Atualizado: ${doc._updatedAt ? new Date(doc._updatedAt).toLocaleString('pt-BR') : 'N/A'}`)
          console.log(`   Fotos: ${doc.fotos?.length || 0}`)
          console.log('')
          
          return { doc, periodo: periodo.label, timeAgo }
        }
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
  }
  
  console.log('\n❌ Não encontrado em nenhum período')
  return null
}

async function restaurarDocumento(documentoRecuperado) {
  const { doc, periodo, timeAgo } = documentoRecuperado
  
  console.log('─'.repeat(70))
  console.log('🚑 PREPARANDO RESTAURAÇÃO...\n')
  
  // Remove _rev para poder criar como novo
  const { _rev, ...docLimpo } = doc
  
  // Garante o ID correto
  docLimpo._id = IMOVEL_ID
  
  console.log(`📝 Documento será restaurado com ID: ${docLimpo._id}`)
  console.log(`   Fonte: ${periodo} atrás`)
  console.log('')
  
  console.log('⚠️  CONFIRMAÇÃO:')
  console.log(`   Título: ${docLimpo.titulo}`)
  console.log(`   ID: ${docLimpo._id}`)
  console.log('')
  
  // Aguarda 3 segundos para dar tempo de cancelar
  console.log('   Restaurando em 3 segundos... (Ctrl+C para cancelar)')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   2...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   1...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('')
  
  try {
    // Cria ou substitui o documento
    const resultado = await client.createOrReplace(docLimpo)
    
    console.log('✅ DOCUMENTO RESTAURADO COM SUCESSO!')
    console.log('─'.repeat(70))
    console.log(`   ID: ${resultado._id}`)
    console.log(`   Rev: ${resultado._rev}`)
    console.log('─'.repeat(70))
    console.log('')
    console.log('🎉 Pronto! Acesse no Studio:')
    console.log(`   https://imobiliariaipe.com.br/studio/structure/imovel;${resultado._id}`)
    console.log('')
    
    // Limpa draft vazio se existir
    try {
      console.log('🗑️  Verificando draft vazio...')
      const draft = await client.fetch('*[_id == $id][0]', { id: `drafts.${IMOVEL_ID}` })
      
      if (draft && !draft.titulo) {
        await client.delete(`drafts.${IMOVEL_ID}`)
        console.log('   ✅ Draft vazio removido')
      }
    } catch (e) {
      // Ignora se não existir
    }
    
    return resultado
    
  } catch (error) {
    console.error('\n❌ ERRO ao restaurar:', error.message)
    
    if (error.message.includes('Insufficient permissions')) {
      console.error('\n🔒 Problema de permissão!')
      console.error('   O token pode não ter permissão de escrita.')
      console.error('   Verifique se o token tem role "Editor" ou "Administrator"')
    }
    
    throw error
  }
}

async function buscarAtualmente() {
  console.log('1️⃣ Verificando se existe atualmente...\n')
  
  try {
    const atual = await client.fetch(
      '*[_type == "imovel" && titulo match $titulo][0]',
      { titulo: TITULO }
    )
    
    if (atual) {
      console.log(`✅ Documento encontrado atualmente!`)
      console.log(`   ID: ${atual._id}`)
      console.log(`   Título: ${atual.titulo}`)
      console.log('')
      console.log('⚠️  O documento já existe. Não precisa recuperar.')
      console.log(`   Acesse: https://imobiliariaipe.com.br/studio/structure/imovel;${atual._id}`)
      return atual
    } else {
      console.log('❌ Documento não encontrado atualmente')
      console.log('   → Precisa recuperar do histórico\n')
      return null
    }
  } catch (error) {
    console.error(`Erro ao verificar: ${error.message}\n`)
    return null
  }
}

async function main() {
  // Verifica se já existe
  const atual = await buscarAtualmente()
  
  if (atual) {
    return
  }
  
  console.log('─'.repeat(70))
  console.log('')
  
  // Busca no histórico
  const resultado = await buscarPorTituloNoHistorico()
  
  if (resultado) {
    console.log('\n' + '═'.repeat(70))
    await restaurarDocumento(resultado)
  } else {
    console.log('\n' + '═'.repeat(70))
    console.log('❌ DOCUMENTO NÃO ENCONTRADO')
    console.log('═'.repeat(70))
    console.log('')
    console.log('💡 POSSÍVEIS CAUSAS:')
    console.log('   1. Foi deletado há mais de 1 mês')
    console.log('   2. Título diferente do informado')
    console.log('   3. Nunca foi publicado (sempre foi draft)')
    console.log('')
    console.log('🔧 ALTERNATIVAS:')
    console.log('   1. Contatar suporte do Sanity')
    console.log('   2. Verificar backups locais')
    console.log('   3. Recadastrar manualmente')
    console.log('')
  }
  
  console.log('═'.repeat(70))
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error.message)
  console.error(error.stack)
  process.exit(1)
})
