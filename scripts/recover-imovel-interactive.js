#!/usr/bin/env node

/**
 * 🚑 Script Interativo de Recuperação de Imóveis
 * 
 * Versão simplificada e interativa para recuperar imóveis deletados
 */

import { createClient } from '@sanity/client'
import * as readline from 'readline'
import dotenv from 'dotenv'

// Carrega variáveis de ambiente
dotenv.config()
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN || 
              process.env.SANITY_API_WRITE_TOKEN || 
              process.env.NEXT_PUBLIC_SANITY_TOKEN

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.clear()
  console.log('╔═════════════════════════════════════════════════════════════╗')
  console.log('║     🚑 RECUPERAÇÃO DE IMÓVEIS DELETADOS - Ipê Imóveis     ║')
  console.log('╚═════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📦 Projeto: ${projectId}`)
  console.log(`📊 Dataset: ${dataset}`)
  console.log('')

  // Verifica token
  if (!token) {
    console.log('❌ Token do Sanity não configurado!')
    console.log('')
    console.log('🔧 Para configurar:')
    console.log('   1. Acesse: https://www.sanity.io/manage')
    console.log(`   2. Selecione o projeto: ${projectId}`)
    console.log('   3. Vá em API → Tokens')
    console.log('   4. Crie um token com permissão de Editor')
    console.log('   5. Adicione no .env.local:')
    console.log('')
    console.log('      SANITY_API_TOKEN=seu_token_aqui')
    console.log('')
    rl.close()
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2025-10-16',
    useCdn: false
  })

  // Pergunta quantas horas atrás buscar
  console.log('⏰ Há quanto tempo o imóvel foi deletado?')
  console.log('')
  console.log('   1. Últimas 2 horas')
  console.log('   2. Últimas 4 horas (padrão)')
  console.log('   3. Últimas 8 horas')
  console.log('   4. Últimas 24 horas')
  console.log('   5. Últimas 48 horas')
  console.log('   6. Última semana')
  console.log('')

  const timeChoice = await question('Escolha uma opção [2]: ')
  
  let hoursAgo = 4 // padrão
  switch (timeChoice.trim() || '2') {
    case '1': hoursAgo = 2; break
    case '2': hoursAgo = 4; break
    case '3': hoursAgo = 8; break
    case '4': hoursAgo = 24; break
    case '5': hoursAgo = 48; break
    case '6': hoursAgo = 168; break
    default: hoursAgo = 4
  }

  const timeAgo = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
  
  console.log('')
  console.log(`🔍 Buscando imóveis deletados desde ${new Date(timeAgo).toLocaleString('pt-BR')}...`)
  console.log('')

  try {
    // Busca imóveis antigos
    const imoveisAntigos = await client.fetch(
      '*[_type == "imovel"] | order(_updatedAt desc) {_id, _updatedAt, titulo, "slug": slug.current, categoria->{name}, finalidade, endereco, preco}',
      {},
      { at: timeAgo }
    )

    // Busca imóveis atuais
    const imoveisAtuais = await client.fetch('*[_type == "imovel"]{_id}')

    const idsAtuais = new Set(imoveisAtuais.map(i => i._id))
    const deletados = imoveisAntigos.filter(i => !idsAtuais.has(i._id))

    if (deletados.length === 0) {
      console.log('✅ Nenhum imóvel foi deletado nesse período!')
      console.log('')
      console.log('💡 Dica: Tente aumentar o período de busca')
      rl.close()
      return
    }

    console.log(`🔴 ${deletados.length} imóvel(is) deletado(s) encontrado(s):`)
    console.log('')
    console.log('─'.repeat(70))

    deletados.forEach((imovel, index) => {
      console.log(`${index + 1}. ${imovel.titulo || 'Sem título'}`)
      console.log(`   📍 ${imovel.endereco || 'Endereço não informado'}`)
      console.log(`   💰 R$ ${imovel.preco?.toLocaleString('pt-BR') || 'N/A'}`)
      console.log(`   🏷️  ${imovel.finalidade || 'N/A'} - ${imovel.categoria?.name || 'N/A'}`)
      console.log(`   🆔 ID: ${imovel._id}`)
      console.log(`   🔗 Slug: ${imovel.slug || 'N/A'}`)
      console.log(`   📅 Última modificação: ${new Date(imovel._updatedAt).toLocaleString('pt-BR')}`)
      console.log('─'.repeat(70))
    })

    console.log('')
    const escolha = await question(`Digite o número do imóvel para restaurar (1-${deletados.length}) ou [Enter] para sair: `)

    if (!escolha.trim()) {
      console.log('👋 Operação cancelada')
      rl.close()
      return
    }

    const index = parseInt(escolha) - 1
    
    if (index < 0 || index >= deletados.length) {
      console.log('❌ Número inválido!')
      rl.close()
      return
    }

    const imovelParaRestaurar = deletados[index]

    console.log('')
    console.log('🚑 Restaurando imóvel...')
    console.log(`   Título: ${imovelParaRestaurar.titulo}`)
    console.log(`   ID: ${imovelParaRestaurar._id}`)
    console.log('')

    const confirmacao = await question('⚠️  Confirma a restauração? (s/N): ')

    if (confirmacao.toLowerCase() !== 's') {
      console.log('👋 Operação cancelada')
      rl.close()
      return
    }

    // Busca o documento completo no histórico
    const docCompleto = await client.fetch(
      '*[_id == $id][0]',
      { id: imovelParaRestaurar._id },
      { at: timeAgo }
    )

    if (!docCompleto) {
      console.log('❌ Erro: Não foi possível recuperar o documento completo')
      rl.close()
      return
    }

    // Restaura
    const result = await client
      .transaction()
      .createIfNotExists(docCompleto)
      .commit()

    console.log('')
    console.log('✅ Imóvel restaurado com sucesso!')
    console.log('')
    console.log('🎉 Pronto! Acesse o Studio para verificar:')
    console.log(`   ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/studio/desk/imovel;${result[0]._id}`)
    console.log('')

  } catch (error) {
    console.error('')
    console.error('❌ Erro:', error.message)
    
    if (error.message.includes('already exists')) {
      console.error('')
      console.error('⚠️  Este imóvel já existe! Ele pode ter sido restaurado anteriormente.')
    } else if (error.message.includes('Unauthorized')) {
      console.error('')
      console.error('🔒 Erro de autenticação. Verifique se o token tem permissões de escrita.')
    }
  } finally {
    rl.close()
  }
}

main().catch(error => {
  console.error('💥 Erro fatal:', error.message)
  rl.close()
  process.exit(1)
})
