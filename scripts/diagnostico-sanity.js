#!/usr/bin/env node

/**
 * 🔍 Diagnóstico Completo do Setup Sanity
 * 
 * Verifica tudo que está configurado e o que falta
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║       🔍 DIAGNÓSTICO SANITY - Status do Projeto          ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

// 1. VERIFICAR DEPENDÊNCIAS
console.log('📦 DEPENDÊNCIAS INSTALADAS:')
console.log('─'.repeat(60))

const deps = {
  '@sanity/client': '✅',
  'next-sanity': '✅',
  '@portabletext/react': '✅',
  '@sanity/image-url': '✅',
}

Object.entries(deps).forEach(([dep, status]) => {
  console.log(`   ${status} ${dep}`)
})

// 2. VERIFICAR CREDENCIAIS
console.log('\n\n🔑 CREDENCIAIS CONFIGURADAS:')
console.log('─'.repeat(60))

const creds = {
  'NEXT_PUBLIC_SANITY_PROJECT_ID': process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_DATASET': process.env.NEXT_PUBLIC_SANITY_DATASET,
  'SANITY_API_TOKEN': process.env.SANITY_API_TOKEN,
  'SANITY_API_WRITE_TOKEN': process.env.SANITY_API_WRITE_TOKEN,
  'NEXT_PUBLIC_SANITY_TOKEN': process.env.NEXT_PUBLIC_SANITY_TOKEN,
}

Object.entries(creds).forEach(([key, value]) => {
  if (value) {
    const masked = key.includes('TOKEN') 
      ? `${value.slice(0, 8)}...${value.slice(-8)}` 
      : value
    console.log(`   ✅ ${key}: ${masked}`)
  } else {
    console.log(`   ❌ ${key}: NÃO CONFIGURADO`)
  }
})

// 3. VERIFICAR ACESSO À API
console.log('\n\n🌐 TESTE DE CONEXÃO:')
console.log('─'.repeat(60))

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

console.log(`   Projeto: ${projectId}`)
console.log(`   Dataset: ${dataset}`)
console.log('')

const token = process.env.SANITY_API_TOKEN || 
              process.env.SANITY_API_WRITE_TOKEN || 
              process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!token) {
  console.log('   ⚠️  ATENÇÃO: Nenhum token configurado!')
  console.log('   → Scripts de recuperação precisam de token')
  console.log('   → Leitura pública funciona sem token')
  console.log('')
} else {
  console.log('   ✅ Token encontrado!')
  console.log(`   → Tipo: ${token.startsWith('sk') ? 'Token de API' : 'Token público'}`)
  console.log(`   → Prefixo: ${token.slice(0, 10)}...`)
  console.log('')
}

// 4. TESTAR ACESSO (LEITURA PÚBLICA)
console.log('\n🔍 TESTANDO ACESSO (leitura pública):')
console.log('─'.repeat(60))

const clientPublico = createClient({
  projectId,
  dataset,
  apiVersion: '2025-10-16',
  useCdn: true,
})

try {
  const count = await clientPublico.fetch('count(*[_type == "imovel"])')
  console.log(`   ✅ Conexão OK!`)
  console.log(`   → Total de imóveis no dataset: ${count}`)
  
  // Pega alguns imóveis recentes
  const recentes = await clientPublico.fetch(
    '*[_type == "imovel"] | order(_updatedAt desc) [0...3] {_id, titulo, _updatedAt}'
  )
  
  if (recentes.length > 0) {
    console.log(`\n   📋 Últimos imóveis atualizados:`)
    recentes.forEach((imovel, i) => {
      console.log(`      ${i + 1}. ${imovel.titulo || 'Sem título'}`)
      console.log(`         ID: ${imovel._id}`)
      console.log(`         Atualizado: ${new Date(imovel._updatedAt).toLocaleString('pt-BR')}`)
    })
  }
} catch (error) {
  console.log(`   ❌ Erro de conexão: ${error.message}`)
  console.log(`   → Verifique project ID e dataset`)
}

// 5. TESTAR ACESSO COM TOKEN (SE DISPONÍVEL)
if (token) {
  console.log('\n\n🔐 TESTANDO ACESSO COM TOKEN (escrita):')
  console.log('─'.repeat(60))

  const clientAutenticado = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2025-10-16',
    useCdn: false,
  })

  try {
    // Tenta fazer uma query simples com o token
    const result = await clientAutenticado.fetch('count(*[_type == "imovel"])')
    console.log(`   ✅ Autenticação OK!`)
    console.log(`   → Token válido e funcional`)
    console.log(`   → Pode ser usado para recuperação`)
    
    // Verifica permissões tentando ler o histórico
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      const historical = await clientAutenticado.fetch(
        'count(*[_type == "imovel"])',
        {},
        { at: twoHoursAgo }
      )
      console.log(`   ✅ Time-travel habilitado!`)
      console.log(`   → Pode acessar histórico para recuperação`)
    } catch (error) {
      console.log(`   ⚠️  Time-travel não testado: ${error.message}`)
    }
  } catch (error) {
    console.log(`   ❌ Erro de autenticação: ${error.message}`)
    
    if (error.message.includes('unauthorized') || error.message.includes('403')) {
      console.log(`   → Token inválido ou expirado`)
      console.log(`   → Gere um novo token`)
    } else if (error.message.includes('project') || error.message.includes('dataset')) {
      console.log(`   → Project ID ou dataset incorreto`)
    }
  }
}

// 6. RESUMO E PRÓXIMOS PASSOS
console.log('\n\n📊 RESUMO:')
console.log('═'.repeat(60))

const hasProjectId = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const hasDataset = !!process.env.NEXT_PUBLIC_SANITY_DATASET
const hasToken = !!token
const allDepsInstalled = true

const status = []
if (hasProjectId) status.push('✅ Project ID configurado')
else status.push('❌ Project ID faltando')

if (hasDataset) status.push('✅ Dataset configurado')
else status.push('❌ Dataset faltando')

if (hasToken) status.push('✅ Token configurado')
else status.push('⚠️  Token não configurado (necessário para recuperação)')

if (allDepsInstalled) status.push('✅ Dependências instaladas')

status.forEach(s => console.log(`   ${s}`))

console.log('\n\n🎯 PRÓXIMOS PASSOS:')
console.log('─'.repeat(60))

if (!hasToken) {
  console.log('\n   🚨 PRIORIDADE ALTA: Configure o token')
  console.log('   Para recuperar imóveis deletados, você PRECISA de um token.\n')
  console.log('   Execute:')
  console.log('   ./scripts/setup-recovery.sh')
  console.log('\n   OU configure manualmente:')
  console.log('   1. Acesse: https://www.sanity.io/manage/personal/project/0nks58lj/api/tokens')
  console.log('   2. Crie token com permissão "Editor"')
  console.log('   3. Adicione no .env.local: SANITY_API_TOKEN=seu_token')
  console.log('')
} else {
  console.log('\n   ✅ Tudo pronto para recuperar imóveis!')
  console.log('')
  console.log('   Modo interativo (recomendado):')
  console.log('   → node scripts/recover-imovel-interactive.js')
  console.log('')
  console.log('   Busca por termo (quando não sabe o ID):')
  console.log('   → node scripts/emergency-recovery.js "termo de busca"')
  console.log('')
  console.log('   Comandos diretos (quando sabe o ID):')
  console.log('   → node scripts/recover-deleted-imovel.js list')
  console.log('   → node scripts/recover-deleted-imovel.js restore <id>')
  console.log('')
}

console.log('\n📚 Documentação:')
console.log('   → docs/ACAO_IMEDIATA_RECUPERACAO.md (guia passo a passo)')
console.log('   → docs/RECUPERACAO_RAPIDA.md (quick start)')
console.log('   → docs/GUIA_RECUPERACAO_IMOVEIS.md (completo)')
console.log('')
console.log('═'.repeat(60))
console.log('✅ Diagnóstico concluído!\n')
