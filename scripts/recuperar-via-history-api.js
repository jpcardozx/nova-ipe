#!/usr/bin/env node

/**
 * 🔍 Recuperação via History API HTTP
 * 
 * Usa a API de histórico do Sanity para acessar todas as revisões
 * Referência: https://www.sanity.io/docs/http-reference/history
 */

import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const PROJECT_ID = '0nks58lj'
const DATASET = 'production'
const TOKEN = process.env.SANITY_API_TOKEN
const DOCUMENT_ID = 'd5476428-a47b-4075-9383-f0cf58f58d66'

console.log('\n🔍 HISTORY API - Busca de Revisões')
console.log('═'.repeat(70))
console.log(`📋 Document ID: ${DOCUMENT_ID}`)
console.log(`📦 Project: ${PROJECT_ID}`)
console.log(`📊 Dataset: ${DATASET}`)
console.log('═'.repeat(70))
console.log('')

async function buscarHistoricoCompleto() {
  console.log('1️⃣ Buscando histórico de transações via History API...\n')
  
  // Endpoint da History API
  // GET /v1/data/history/{dataset}/transactions/{documentId}
  const url = `https://${PROJECT_ID}.api.sanity.io/v1/data/history/${DATASET}/transactions/${DOCUMENT_ID}`
  
  console.log(`🌐 Endpoint: ${url}`)
  console.log('')
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('✅ Resposta recebida!\n')
    console.log('─'.repeat(70))
    
    if (data.transactions && data.transactions.length > 0) {
      console.log(`📋 Total de transações encontradas: ${data.transactions.length}\n`)
      
      // Ordena por timestamp (mais recente primeiro)
      const transactions = data.transactions.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
      // Mostra as últimas 10 transações
      console.log('📝 Últimas transações:\n')
      
      transactions.slice(0, 10).forEach((tx, i) => {
        const date = new Date(tx.timestamp)
        const type = tx.mutations ? 
          (tx.mutations.some(m => m.delete) ? '🗑️  DELETE' :
           tx.mutations.some(m => m.create) ? '➕ CREATE' :
           tx.mutations.some(m => m.patch) ? '✏️  PATCH' :
           tx.mutations.some(m => m.createOrReplace) ? '🔄 CREATE/REPLACE' :
           '❓ OUTROS') : '❓ SEM MUTATIONS'
        
        console.log(`${i + 1}. ${type}`)
        console.log(`   Timestamp: ${date.toLocaleString('pt-BR')}`)
        console.log(`   Transaction ID: ${tx.id}`)
        console.log(`   Author: ${tx.author || 'N/A'}`)
        
        if (tx.mutations) {
          tx.mutations.forEach(mut => {
            if (mut.delete) {
              console.log(`   ⚠️  DELETOU: ${mut.delete.id}`)
            }
            if (mut.create) {
              console.log(`   📄 Documento criado`)
            }
            if (mut.patch) {
              console.log(`   📝 Campos modificados`)
            }
          })
        }
        console.log('')
      })
      
      return transactions
    } else {
      console.log('❌ Nenhuma transação encontrada para este documento')
      console.log('')
      console.log('💡 Isso pode significar:')
      console.log('   1. O documento nunca existiu')
      console.log('   2. Foi deletado e o histórico foi limpo')
      console.log('   3. O ID está incorreto')
      return []
    }
    
  } catch (error) {
    console.error('❌ Erro ao acessar History API:', error.message)
    
    if (error.message.includes('401')) {
      console.error('\n🔒 Erro de autenticação!')
      console.error('   Verifique se o token está correto')
    } else if (error.message.includes('403')) {
      console.error('\n🔒 Erro de permissão!')
      console.error('   O token pode não ter acesso à History API')
      console.error('   Pode ser necessário token com role "Administrator"')
    } else if (error.message.includes('404')) {
      console.error('\n❓ Documento não encontrado')
      console.error('   O documento pode nunca ter existido com esse ID')
    }
    
    throw error
  }
}

async function buscarRevisaoEspecifica(transactionId) {
  console.log(`\n2️⃣ Buscando conteúdo da revisão: ${transactionId}...\n`)
  
  // Endpoint para buscar o conteúdo de uma revisão específica
  // GET /v1/data/history/{dataset}/documents/{documentId}?revision={transactionId}
  const url = `https://${PROJECT_ID}.api.sanity.io/v1/data/history/${DATASET}/documents/${DOCUMENT_ID}?revision=${transactionId}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const document = await response.json()
    
    console.log('✅ Documento recuperado!\n')
    console.log('─'.repeat(70))
    console.log(JSON.stringify(document, null, 2))
    console.log('─'.repeat(70))
    
    return document
    
  } catch (error) {
    console.error('❌ Erro ao buscar revisão:', error.message)
    return null
  }
}

async function restaurarDocumento(doc) {
  console.log('\n3️⃣ Restaurando documento...\n')
  
  // Remove campos do sistema que não devem ser enviados
  const { _rev, ...docLimpo } = doc
  
  // Garante o ID correto (publicado, não draft)
  docLimpo._id = DOCUMENT_ID
  
  console.log(`📝 Preparando para restaurar:`)
  console.log(`   ID: ${docLimpo._id}`)
  console.log(`   Título: ${docLimpo.titulo || 'N/A'}`)
  console.log('')
  
  const url = `https://${PROJECT_ID}.api.sanity.io/v1/data/mutate/${DATASET}`
  
  const payload = {
    mutations: [
      {
        createOrReplace: docLimpo
      }
    ]
  }
  
  console.log('⏱️  Aguarde 3 segundos... (Ctrl+C para cancelar)')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   2...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('   1...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('')
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    
    console.log('✅ DOCUMENTO RESTAURADO COM SUCESSO!')
    console.log('─'.repeat(70))
    console.log(JSON.stringify(result, null, 2))
    console.log('─'.repeat(70))
    console.log('')
    console.log('🎉 Acesse no Studio:')
    console.log(`   https://imobiliariaipe.com.br/studio/structure/imovel;${DOCUMENT_ID}`)
    console.log('')
    
    return result
    
  } catch (error) {
    console.error('❌ Erro ao restaurar:', error.message)
    throw error
  }
}

async function main() {
  try {
    // 1. Busca o histórico de transações
    const transactions = await buscarHistoricoCompleto()
    
    if (transactions.length === 0) {
      console.log('\n═'.repeat(70))
      console.log('❌ Sem transações para processar')
      console.log('═'.repeat(70))
      return
    }
    
    // 2. Encontra a última transação ANTES do delete
    console.log('\n─'.repeat(70))
    console.log('🔍 Procurando última versão válida do documento...\n')
    
    const deleteTransaction = transactions.find(tx => 
      tx.mutations?.some(m => m.delete)
    )
    
    if (deleteTransaction) {
      console.log('🗑️  DELETE encontrado:')
      console.log(`   Data: ${new Date(deleteTransaction.timestamp).toLocaleString('pt-BR')}`)
      console.log(`   Transaction ID: ${deleteTransaction.id}`)
      console.log(`   Author: ${deleteTransaction.author || 'N/A'}`)
      console.log('')
    }
    
    // Pega a transação anterior ao delete (ou a mais recente se não houver delete)
    const deleteIndex = deleteTransaction ? transactions.indexOf(deleteTransaction) : -1
    const validTransaction = deleteIndex > 0 ? transactions[deleteIndex + 1] : transactions[0]
    
    if (validTransaction) {
      console.log('✅ Última versão válida encontrada:')
      console.log(`   Data: ${new Date(validTransaction.timestamp).toLocaleString('pt-BR')}`)
      console.log(`   Transaction ID: ${validTransaction.id}`)
      console.log('')
      
      // 3. Busca o conteúdo dessa revisão
      const doc = await buscarRevisaoEspecifica(validTransaction.id)
      
      if (doc && doc.titulo) {
        // 4. Restaura o documento
        await restaurarDocumento(doc)
      } else {
        console.log('\n⚠️  Revisão encontrada mas sem conteúdo completo')
        console.log('   Tente outra revisão manualmente')
      }
    } else {
      console.log('❌ Não foi possível encontrar uma versão válida')
    }
    
    console.log('\n═'.repeat(70))
    
  } catch (error) {
    console.error('\n💥 Erro no processo:', error.message)
    console.log('\n═'.repeat(70))
    process.exit(1)
  }
}

main()
