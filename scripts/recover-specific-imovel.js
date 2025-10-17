#!/usr/bin/env node

/**
 * 🚑 Recuperação Específica - Documento Publicado Deletado
 * 
 * Para quando o draft existe mas está vazio e o publicado foi deletado
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
  console.error('❌ Token do Sanity não encontrado!')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-10-16',
  useCdn: false
})

const IMOVEL_ID = 'd5476428-a47b-4075-9383-f0cf58f58d66'

console.log('\n🚑 RECUPERAÇÃO DE DOCUMENTO PUBLICADO DELETADO')
console.log('═'.repeat(70))
console.log(`📋 ID: ${IMOVEL_ID}\n`)

async function buscarNoHistorico() {
  console.log('🔍 Buscando nas últimas 48 horas...\n')
  
  const periodos = [
    { horas: 2, label: '2 horas' },
    { horas: 6, label: '6 horas' },
    { horas: 12, label: '12 horas' },
    { horas: 24, label: '24 horas' },
    { horas: 48, label: '48 horas' },
  ]
  
  for (const periodo of periodos) {
    const timeAgo = new Date(Date.now() - periodo.horas * 60 * 60 * 1000).toISOString()
    
    try {
      console.log(`⏰ Verificando há ${periodo.label} (${new Date(timeAgo).toLocaleString('pt-BR')})...`)
      
      // Busca o documento publicado (sem o prefixo drafts.)
      const doc = await client.fetch(
        '*[_id == $id][0]',
        { id: IMOVEL_ID },
        { at: timeAgo }
      )
      
      if (doc && doc._id === IMOVEL_ID) {
        console.log(`   ✅ ENCONTRADO!\n`)
        console.log('─'.repeat(70))
        console.log(`📄 DOCUMENTO RECUPERADO:\n`)
        console.log(`   Título: ${doc.titulo || 'N/A'}`)
        console.log(`   Tipo: ${doc._type}`)
        console.log(`   ID: ${doc._id}`)
        console.log(`   Rev: ${doc._rev}`)
        console.log(`   Criado: ${doc._createdAt ? new Date(doc._createdAt).toLocaleString('pt-BR') : 'N/A'}`)
        console.log(`   Atualizado: ${doc._updatedAt ? new Date(doc._updatedAt).toLocaleString('pt-BR') : 'N/A'}`)
        
        if (doc.slug?.current) {
          console.log(`   Slug: ${doc.slug.current}`)
        }
        if (doc.endereco) {
          console.log(`   Endereço: ${doc.endereco}`)
        }
        if (doc.preco) {
          console.log(`   Preço: R$ ${doc.preco.toLocaleString('pt-BR')}`)
        }
        
        console.log('─'.repeat(70))
        
        return doc
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
    }
  }
  
  console.log('\n❌ Documento não encontrado em nenhum período')
  return null
}

async function restaurarDocumento(doc) {
  console.log('\n🔧 RESTAURANDO DOCUMENTO...\n')
  
  try {
    // Primeiro, verifica se já existe
    const existente = await client.fetch('*[_id == $id][0]', { id: IMOVEL_ID })
    
    if (existente && existente._id === IMOVEL_ID && existente.titulo) {
      console.log('⚠️  O documento publicado JÁ EXISTE!')
      console.log(`   Título atual: ${existente.titulo}`)
      console.log('\n🤔 Pode ser que ele já tenha sido restaurado.')
      console.log('   Verifique no Studio: https://imobiliariaipe.com.br/studio/structure/imovel;' + IMOVEL_ID)
      return
    }
    
    // Remove campos do sistema que não devem ser restaurados
    const { _rev, ...docLimpo } = doc
    
    // Garante que o _id está correto (sem drafts.)
    docLimpo._id = IMOVEL_ID
    
    console.log('📝 Criando documento publicado...')
    
    // Usa createOrReplace para garantir que vai sobrescrever qualquer coisa que estiver lá
    const resultado = await client.createOrReplace(docLimpo)
    
    console.log('\n✅ DOCUMENTO RESTAURADO COM SUCESSO!')
    console.log('─'.repeat(70))
    console.log(`   ID: ${resultado._id}`)
    console.log(`   Rev: ${resultado._rev}`)
    console.log('─'.repeat(70))
    
    console.log('\n🎉 Pronto! Acesse no Studio:')
    console.log(`   https://imobiliariaipe.com.br/studio/structure/imovel;${IMOVEL_ID}`)
    
    // Agora, opcionalmente, delete o draft vazio
    console.log('\n🗑️  Removendo draft vazio...')
    try {
      await client.delete(`drafts.${IMOVEL_ID}`)
      console.log('   ✅ Draft vazio removido')
    } catch (error) {
      console.log(`   ⚠️  Não foi possível remover o draft: ${error.message}`)
      console.log('   (Você pode deletá-lo manualmente no Studio)')
    }
    
  } catch (error) {
    console.error('\n❌ ERRO ao restaurar:', error.message)
    throw error
  }
}

async function main() {
  console.log('🎯 ESTRATÉGIA:')
  console.log('   1. Buscar documento publicado no histórico')
  console.log('   2. Restaurar como documento publicado')
  console.log('   3. Remover draft vazio (se existir)\n')
  console.log('═'.repeat(70))
  console.log('')
  
  const doc = await buscarNoHistorico()
  
  if (doc) {
    console.log('\n⚠️  Confirma a restauração?')
    console.log('   O documento será restaurado como PUBLICADO')
    console.log('   O draft vazio será removido\n')
    
    // Aguarda 2 segundos para dar tempo de cancelar
    console.log('   Iniciando em 3 segundos... (Ctrl+C para cancelar)')
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('   2...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('   1...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('')
    
    await restaurarDocumento(doc)
  } else {
    console.log('\n💡 ALTERNATIVAS:')
    console.log('   1. Tente buscar com período maior (edite o script)')
    console.log('   2. Use o backup do dataset (se tiver)')
    console.log('   3. Contate o suporte do Sanity')
  }
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error.message)
  console.error(error.stack)
  process.exit(1)
})
