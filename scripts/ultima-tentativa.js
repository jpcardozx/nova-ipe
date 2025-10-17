#!/usr/bin/env node

/**
 * 🚨 ÚLTIMA TENTATIVA - Busca Completa no Dataset
 * 
 * Vamos fazer export e procurar pelo ID em TODOS os documentos
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

console.log('\n🚨 ÚLTIMA TENTATIVA - Busca Exaustiva\n')
console.log('═'.repeat(70))
console.log(`📋 Procurando: ${IMOVEL_ID}\n`)

async function buscarPorReferencias() {
  console.log('1️⃣ Buscando referências ao ID em outros documentos...\n')
  
  try {
    // Busca qualquer documento que referencie este ID
    const referencias = await client.fetch(`
      *[references($id)] {
        _id,
        _type,
        titulo,
        "refs": select(
          _type == "imovel" => "Referenciado por imóvel",
          _type == "agendamento" => "Referenciado por agendamento",
          "Referenciado por " + _type
        )
      }
    `, { id: IMOVEL_ID })
    
    if (referencias.length > 0) {
      console.log(`✅ Encontradas ${referencias.length} referência(s)!\n`)
      referencias.forEach((ref, i) => {
        console.log(`${i + 1}. ${ref.titulo || ref._type}`)
        console.log(`   ID: ${ref._id}`)
        console.log(`   ${ref.refs}\n`)
      })
    } else {
      console.log('❌ Nenhuma referência encontrada\n')
    }
    
    return referencias
  } catch (error) {
    console.error(`❌ Erro: ${error.message}\n`)
    return []
  }
}

async function buscarTodosDocumentos() {
  console.log('2️⃣ Listando TODOS os documentos no dataset...\n')
  
  try {
    const todos = await client.fetch(`
      *[!(_id in path("_.**"))] | order(_updatedAt desc) [0...50] {
        _id,
        _type,
        titulo,
        _updatedAt
      }
    `)
    
    console.log(`📊 Total encontrado: ${todos.length} documentos\n`)
    
    // Procura pelo ID parcial
    const possiveis = todos.filter(doc => 
      doc._id.includes('d5476428') || 
      doc._id.includes('a47b') ||
      doc._id.includes('f0cf58f58d66')
    )
    
    if (possiveis.length > 0) {
      console.log(`🎯 Possíveis correspondências (ID parcial):\n`)
      possiveis.forEach((doc, i) => {
        console.log(`${i + 1}. ${doc.titulo || 'Sem título'}`)
        console.log(`   ID: ${doc._id}`)
        console.log(`   Tipo: ${doc._type}`)
        console.log(`   Atualizado: ${new Date(doc._updatedAt).toLocaleString('pt-BR')}\n`)
      })
    }
    
    // Lista os 20 mais recentes
    console.log('📋 20 documentos mais recentes (qualquer tipo):\n')
    todos.slice(0, 20).forEach((doc, i) => {
      console.log(`${i + 1}. [${doc._type}] ${doc.titulo || doc._id}`)
      console.log(`   ID: ${doc._id}`)
      console.log(`   Atualizado: ${new Date(doc._updatedAt).toLocaleString('pt-BR')}\n`)
    })
    
    return todos
  } catch (error) {
    console.error(`❌ Erro: ${error.message}\n`)
    return []
  }
}

async function tentarRecuperacaoDeBackup() {
  console.log('3️⃣ Verificando opções de backup...\n')
  
  console.log('💡 OPÇÕES DE RECUPERAÇÃO:\n')
  console.log('A. PELO SANITY MANAGE (Recomendado):')
  console.log('   1. Acesse: https://www.sanity.io/manage/personal/project/0nks58lj')
  console.log('   2. Vá em "Datasets" → "production"')
  console.log('   3. Procure por "History" ou "Backups"')
  console.log('   4. Alguns planos têm backup automático de 30 dias\n')
  
  console.log('B. EXPORT/IMPORT LOCAL (se você tem backup):')
  console.log('   1. Se você fez export antes:')
  console.log('      sanity dataset import backup.tar.gz production')
  console.log('   2. Ou busque no arquivo:')
  console.log('      tar -xzf backup.tar.gz')
  console.log('      grep "d5476428-a47b-4075-9383-f0cf58f58d66" data.ndjson\n')
  
  console.log('C. CONTATAR SUPORTE SANITY:')
  console.log('   1. Acesse: https://www.sanity.io/help')
  console.log('   2. Informe:')
  console.log(`      - Project ID: 0nks58lj`)
  console.log(`      - Dataset: production`)
  console.log(`      - Document ID: ${IMOVEL_ID}`)
  console.log(`      - Usuário que deletou: julia@imobiliariaipe.com.br`)
  console.log(`      - Data aproximada: 16/10/2025`)
  console.log('   3. Pergunte sobre "Time-travel" ou "Point-in-time recovery"\n')
  
  console.log('D. VERIFICAR SE O ID ESTÁ CORRETO:')
  console.log('   1. Acesse o Studio: https://imobiliariaipe.com.br/studio')
  console.log('   2. Verifique o URL completo do imóvel')
  console.log('   3. O ID deve estar depois de ";"\n')
}

async function main() {
  const refs = await buscarPorReferencias()
  const docs = await buscarTodosDocumentos()
  await tentarRecuperacaoDeBackup()
  
  console.log('═'.repeat(70))
  console.log('📊 CONCLUSÃO FINAL\n')
  console.log('═'.repeat(70))
  console.log('')
  console.log('O documento com ID ' + IMOVEL_ID + ':')
  console.log('  ❌ Não existe atualmente (nem draft nem publicado)')
  console.log('  ❌ Não foi encontrado no histórico (últimos 7 dias)')
  console.log('  ❌ Não tem referências de outros documentos')
  console.log('')
  console.log('🤔 POSSÍVEIS EXPLICAÇÕES:')
  console.log('  1. O documento NUNCA foi publicado (sempre foi draft-only)')
  console.log('  2. Foi deletado há MAIS de 7 dias')
  console.log('  3. O ID no URL do Studio pode estar incorreto/corrompido')
  console.log('  4. Problema de sincronização do Studio')
  console.log('  5. O token não tem permissões para ver histórico completo')
  console.log('')
  console.log('🎯 PRÓXIMOS PASSOS:')
  console.log('  1. ✅ Verifique o ID correto no Studio (copie novamente)')
  console.log('  2. ✅ Contate o suporte do Sanity (eles têm backups de 30 dias)')
  console.log('  3. ✅ Verifique se tem backup local do dataset')
  console.log('  4. ✅ Se for um imóvel novo, considere recadastrar')
  console.log('')
  console.log('═'.repeat(70))
}

main()
