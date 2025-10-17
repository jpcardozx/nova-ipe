#!/usr/bin/env node

/**
 * 🔍 Investigação Completa - Rastreamento de Deleção
 * 
 * Busca informações sobre deleções e alterações por usuário específico
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

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
const USER_EMAIL = 'julia@imobiliariaipe.com.br'

console.log('\n🔍 INVESTIGAÇÃO DE DELEÇÃO')
console.log('═'.repeat(70))
console.log(`📋 ID do imóvel: ${IMOVEL_ID}`)
console.log(`👤 Usuário: ${USER_EMAIL}`)
console.log('═'.repeat(70))
console.log('')

async function verificarDocumentoAtual() {
  console.log('1️⃣ VERIFICANDO DOCUMENTO ATUAL...\n')
  
  try {
    // Verifica draft e publicado
    const docs = await client.fetch(
      '*[_id in [$published, $draft]]',
      {
        published: IMOVEL_ID,
        draft: `drafts.${IMOVEL_ID}`
      }
    )
    
    console.log(`   Encontrados: ${docs.length} documento(s)\n`)
    
    for (const doc of docs) {
      const tipo = doc._id.startsWith('drafts.') ? '📝 DRAFT' : '📄 PUBLICADO'
      console.log(`   ${tipo}:`)
      console.log(`      ID: ${doc._id}`)
      console.log(`      Título: ${doc.titulo || '(vazio)'}`)
      console.log(`      Tipo: ${doc._type}`)
      console.log(`      Criado: ${doc._createdAt ? new Date(doc._createdAt).toLocaleString('pt-BR') : 'N/A'}`)
      console.log(`      Atualizado: ${doc._updatedAt ? new Date(doc._updatedAt).toLocaleString('pt-BR') : 'N/A'}`)
      console.log(`      Rev: ${doc._rev}`)
      console.log('')
    }
    
    return docs
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}\n`)
    return []
  }
}

async function buscarHistoricoCompleto() {
  console.log('2️⃣ BUSCANDO HISTÓRICO COMPLETO (últimos 7 dias)...\n')
  
  const periodos = [
    { dias: 0.125, label: '3 horas', horas: 3 },
    { dias: 0.25, label: '6 horas', horas: 6 },
    { dias: 0.5, label: '12 horas', horas: 12 },
    { dias: 1, label: '1 dia', horas: 24 },
    { dias: 2, label: '2 dias', horas: 48 },
    { dias: 3, label: '3 dias', horas: 72 },
    { dias: 7, label: '7 dias', horas: 168 },
  ]
  
  const encontrados = []
  
  for (const periodo of periodos) {
    const timeAgo = new Date(Date.now() - periodo.horas * 60 * 60 * 1000).toISOString()
    
    try {
      console.log(`   ⏰ ${periodo.label} atrás (${new Date(timeAgo).toLocaleString('pt-BR')})...`)
      
      // Busca AMBOS - draft e publicado
      const [publicado, draft] = await Promise.all([
        client.fetch('*[_id == $id][0]', { id: IMOVEL_ID }, { at: timeAgo }),
        client.fetch('*[_id == $id][0]', { id: `drafts.${IMOVEL_ID}` }, { at: timeAgo })
      ])
      
      if (publicado && publicado.titulo) {
        console.log(`      ✅ PUBLICADO encontrado: "${publicado.titulo}"`)
        encontrados.push({
          tipo: 'publicado',
          periodo: periodo.label,
          timestamp: timeAgo,
          doc: publicado
        })
      }
      
      if (draft && draft.titulo) {
        console.log(`      ✅ DRAFT encontrado: "${draft.titulo}"`)
        encontrados.push({
          tipo: 'draft',
          periodo: periodo.label,
          timestamp: timeAgo,
          doc: draft
        })
      }
      
    } catch (error) {
      console.log(`      ❌ Erro: ${error.message}`)
    }
  }
  
  console.log('')
  return encontrados
}

async function buscarPorSlugOuTitulo() {
  console.log('3️⃣ BUSCANDO OUTROS IMÓVEIS SIMILARES (caso o ID tenha mudado)...\n')
  
  try {
    // Busca todos os imóveis recentemente modificados
    const recentes = await client.fetch(
      `*[_type == "imovel"] | order(_updatedAt desc) [0...10] {
        _id,
        _updatedAt,
        titulo,
        "slug": slug.current,
        endereco
      }`
    )
    
    console.log(`   📋 Últimos 10 imóveis modificados:\n`)
    
    recentes.forEach((imovel, i) => {
      console.log(`   ${i + 1}. ${imovel.titulo || 'Sem título'}`)
      console.log(`      ID: ${imovel._id}`)
      console.log(`      Slug: ${imovel.slug || 'N/A'}`)
      console.log(`      Endereço: ${imovel.endereco || 'N/A'}`)
      console.log(`      Atualizado: ${new Date(imovel._updatedAt).toLocaleString('pt-BR')}`)
      console.log('')
    })
    
    return recentes
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}\n`)
    return []
  }
}

async function buscarHistoricoDeTransacoes() {
  console.log('4️⃣ BUSCANDO TRANSAÇÕES RELACIONADAS (History API)...\n')
  
  try {
    // O Sanity mantém um histórico de transações
    // Vamos buscar transações recentes para este documento
    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/transactions/${IMOVEL_ID}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data && data.documents && data.documents.length > 0) {
        console.log(`   ✅ Encontradas ${data.documents.length} revisões\n`)
        
        // Mostra as últimas 5 revisões
        const ultimas = data.documents.slice(-5).reverse()
        
        ultimas.forEach((rev, i) => {
          console.log(`   Revisão ${i + 1}:`)
          console.log(`      Timestamp: ${new Date(rev.timestamp).toLocaleString('pt-BR')}`)
          console.log(`      Rev ID: ${rev.id}`)
          console.log(`      Autor: ${rev.author || 'N/A'}`)
          console.log('')
        })
        
        return data
      } else {
        console.log('   ⚠️  Nenhuma revisão encontrada\n')
      }
    } else {
      console.log(`   ⚠️  Não foi possível acessar histórico (${response.status})\n`)
    }
  } catch (error) {
    console.log(`   ⚠️  History API não disponível: ${error.message}\n`)
  }
  
  return null
}

async function buscarTodosImoveis() {
  console.log('5️⃣ ESTATÍSTICAS GERAIS...\n')
  
  try {
    const stats = await client.fetch(`{
      "total": count(*[_type == "imovel"]),
      "totalComDraft": count(*[_type == "imovel" && _id match "drafts.*"]),
      "totalPublicados": count(*[_type == "imovel" && !(_id match "drafts.*")]),
      "ultimaAtualizacao": *[_type == "imovel"] | order(_updatedAt desc) [0]._updatedAt
    }`)
    
    console.log(`   📊 Total de imóveis: ${stats.total}`)
    console.log(`   📝 Drafts: ${stats.totalComDraft}`)
    console.log(`   📄 Publicados: ${stats.totalPublicados}`)
    console.log(`   ⏰ Última atualização: ${new Date(stats.ultimaAtualizacao).toLocaleString('pt-BR')}`)
    console.log('')
    
    return stats
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}\n`)
    return null
  }
}

async function main() {
  const docsAtuais = await verificarDocumentoAtual()
  const historico = await buscarHistoricoCompleto()
  const similares = await buscarPorSlugOuTitulo()
  const transacoes = await buscarHistoricoDeTransacoes()
  const stats = await buscarTodosImoveis()
  
  console.log('\n═'.repeat(70))
  console.log('📊 RESUMO DA INVESTIGAÇÃO')
  console.log('═'.repeat(70))
  console.log('')
  
  if (docsAtuais.length > 0) {
    console.log('✅ Documento existe atualmente:')
    docsAtuais.forEach(doc => {
      const tipo = doc._id.startsWith('drafts.') ? 'Draft' : 'Publicado'
      console.log(`   - ${tipo}: ${doc.titulo || '(vazio)'}`)
    })
    console.log('')
  }
  
  if (historico.length > 0) {
    console.log('✅ Encontrado no histórico:')
    const maisRecente = historico[0]
    console.log(`   - Tipo: ${maisRecente.tipo}`)
    console.log(`   - Período: ${maisRecente.periodo} atrás`)
    console.log(`   - Título: ${maisRecente.doc.titulo}`)
    console.log('')
    console.log('🎯 PRÓXIMO PASSO:')
    console.log(`   Execute o script de recuperação com período de ${maisRecente.periodo}`)
    console.log('')
  } else {
    console.log('❌ Não encontrado no histórico dos últimos 7 dias')
    console.log('')
    console.log('💡 POSSÍVEIS CAUSAS:')
    console.log('   1. Documento foi criado há menos de 7 dias e deletado')
    console.log('   2. ID do documento mudou')
    console.log('   3. Documento foi deletado há mais de 7 dias')
    console.log('   4. Problema com as permissões de acesso ao histórico')
    console.log('')
    console.log('🔧 ALTERNATIVAS:')
    console.log('   1. Verificar se algum dos imóveis similares é o correto')
    console.log('   2. Contatar suporte do Sanity com o ID do documento')
    console.log('   3. Restaurar de backup (se disponível)')
    console.log('')
  }
  
  console.log('═'.repeat(70))
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error.message)
  process.exit(1)
})
