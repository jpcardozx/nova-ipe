#!/usr/bin/env node

/**
 * 🔍 Verificação Detalhada do Draft
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

const IMOVEL_ID = 'd5476428-a47b-4075-9383-f0cf58f58d66'

console.log('\n🔍 ANÁLISE DETALHADA DO DRAFT\n')
console.log('═'.repeat(70))

async function analisarDraft() {
  try {
    // Busca o draft completo
    const draft = await client.fetch('*[_id == $id][0]', { id: `drafts.${IMOVEL_ID}` })
    
    if (!draft) {
      console.log('❌ Draft não encontrado!\n')
      console.log('💡 Isso significa que:')
      console.log('   - O draft também foi deletado, OU')
      console.log('   - O ID está incorreto\n')
      
      // Busca todos os drafts para comparar
      const todosDrafts = await client.fetch('*[_id match "drafts.*"][0...5]{_id, _type, titulo, _updatedAt}')
      
      if (todosDrafts.length > 0) {
        console.log('📋 Alguns drafts existentes no sistema:\n')
        todosDrafts.forEach((d, i) => {
          console.log(`${i + 1}. ${d.titulo || 'Sem título'}`)
          console.log(`   ID: ${d._id}`)
          console.log(`   Tipo: ${d._type}`)
          console.log(`   Atualizado: ${new Date(d._updatedAt).toLocaleString('pt-BR')}\n`)
        })
      } else {
        console.log('ℹ️  Nenhum draft encontrado no sistema\n')
      }
      
      return null
    }
    
    console.log('✅ DRAFT ENCONTRADO!\n')
    console.log('📄 Informações Completas:\n')
    console.log(JSON.stringify(draft, null, 2))
    console.log('\n')
    console.log('═'.repeat(70))
    console.log('📊 ANÁLISE:\n')
    
    // Analisa os campos
    const campos = Object.keys(draft)
    console.log(`   Total de campos: ${campos.length}\n`)
    
    const camposVazios = campos.filter(k => {
      const val = draft[k]
      return val === null || val === undefined || val === '' || 
             (Array.isArray(val) && val.length === 0) ||
             (typeof val === 'object' && Object.keys(val).length === 0)
    })
    
    console.log(`   Campos vazios: ${camposVazios.length}`)
    if (camposVazios.length > 0) {
      console.log(`   → ${camposVazios.join(', ')}\n`)
    }
    
    const camposPreenchidos = campos.filter(k => !camposVazios.includes(k))
    console.log(`   Campos preenchidos: ${camposPreenchidos.length}`)
    if (camposPreenchidos.length > 0) {
      console.log(`   → ${camposPreenchidos.join(', ')}\n`)
    }
    
    // Informações importantes
    console.log('═'.repeat(70))
    console.log('🔑 DADOS PRINCIPAIS:\n')
    console.log(`   ID: ${draft._id}`)
    console.log(`   Tipo: ${draft._type}`)
    console.log(`   Título: ${draft.titulo || '(vazio)'}`)
    console.log(`   Criado: ${draft._createdAt ? new Date(draft._createdAt).toLocaleString('pt-BR') : 'N/A'}`)
    console.log(`   Atualizado: ${draft._updatedAt ? new Date(draft._updatedAt).toLocaleString('pt-BR') : 'N/A'}`)
    console.log(`   Revisão: ${draft._rev}\n`)
    
    // Verifica se tem conteúdo relevante
    const temConteudo = draft.titulo || draft.endereco || draft.preco || (draft.fotos && draft.fotos.length > 0)
    
    if (temConteudo) {
      console.log('✅ O draft tem conteúdo!')
      console.log('   Pode ser possível recuperar informações dele\n')
    } else {
      console.log('⚠️  O draft está praticamente vazio')
      console.log('   Precisamos buscar o documento publicado no histórico\n')
    }
    
    return draft
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    return null
  }
}

async function buscarNoHistoricoDoDraft() {
  console.log('\n═'.repeat(70))
  console.log('🕐 BUSCANDO HISTÓRICO DO DRAFT\n')
  
  const periodos = [1, 3, 6, 12, 24, 48, 72, 168] // horas
  
  for (const horas of periodos) {
    const timeAgo = new Date(Date.now() - horas * 60 * 60 * 1000).toISOString()
    
    try {
      const draft = await client.fetch(
        '*[_id == $id][0]',
        { id: `drafts.${IMOVEL_ID}` },
        { at: timeAgo }
      )
      
      if (draft && draft.titulo) {
        console.log(`✅ ${horas}h atrás: ENCONTRADO - "${draft.titulo}"`)
        console.log(`   Criado: ${new Date(draft._createdAt).toLocaleString('pt-BR')}`)
        console.log(`   Atualizado: ${new Date(draft._updatedAt).toLocaleString('pt-BR')}`)
        console.log('')
        
        return { draft, horas, timeAgo }
      }
    } catch (error) {
      // ignora
    }
  }
  
  console.log('❌ Draft não encontrado em nenhum período\n')
  return null
}

async function main() {
  const draft = await analisarDraft()
  
  if (!draft || !draft.titulo) {
    const historicoDraft = await buscarNoHistoricoDoDraft()
    
    if (historicoDraft) {
      console.log('═'.repeat(70))
      console.log('🎯 SOLUÇÃO ENCONTRADA!\n')
      console.log(`O draft existia há ${historicoDraft.horas} horas com conteúdo.`)
      console.log('Podemos recuperá-lo desse período.\n')
      console.log('Execute:')
      console.log(`node scripts/recover-draft-from-history.js ${historicoDraft.timeAgo}`)
    } else {
      console.log('═'.repeat(70))
      console.log('❌ SITUAÇÃO CRÍTICA\n')
      console.log('Nem o draft nem o publicado foram encontrados no histórico.')
      console.log('\n💡 OPÇÕES:')
      console.log('   1. Verificar se o ID está correto no Studio')
      console.log('   2. Buscar em backups do dataset')
      console.log('   3. Contatar suporte do Sanity')
      console.log('   4. O documento pode nunca ter existido')
    }
  }
  
  console.log('\n' + '═'.repeat(70))
}

main()
