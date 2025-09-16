/**
 * Script de teste para uploads no Sanity
 * Este script verifica se o upload está funcionando corretamente
 */

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: '.env.local' })

// Configuração do cliente Sanity
const sanityClient = createClient({
  projectId: '0nks58lj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function testUpload() {
  console.log('🧪 Testando configuração do Sanity...')

  try {
    // 1. Verificar configuração básica
    console.log('✅ Cliente configurado:', {
      projectId: sanityClient.config().projectId,
      dataset: sanityClient.config().dataset,
      apiVersion: sanityClient.config().apiVersion,
      hasToken: !!sanityClient.config().token
    })

    // 2. Testar conexão com API
    console.log('\n📡 Testando conexão com API...')
    const docs = await sanityClient.fetch('*[_type == "property"] | order(_createdAt desc) [0...2] { _id, title }')
    console.log('✅ Conexão OK. Documentos encontrados:', docs.length)

    // 3. Verificar permissões de upload
    console.log('\n🔑 Verificando permissões de upload...')

    // Criar um arquivo de teste simples (SVG)
    const testSvgContent = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#3B82F6"/>
        <text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="12">TEST</text>
      </svg>
    `

    const testBuffer = Buffer.from(testSvgContent, 'utf8')

    try {
      const uploadResult = await sanityClient.assets.upload('image', testBuffer, {
        filename: 'test-upload.svg',
        contentType: 'image/svg+xml'
      })

      console.log('✅ Upload de teste bem-sucedido!')
      console.log('📄 Asset criado:', {
        id: uploadResult._id,
        url: uploadResult.url,
        filename: uploadResult.originalFilename
      })

      // Limpar o arquivo de teste
      console.log('\n🧹 Removendo arquivo de teste...')
      await sanityClient.delete(uploadResult._id)
      console.log('✅ Arquivo de teste removido')

    } catch (uploadError) {
      console.error('❌ Erro no upload:', uploadError.message)

      if (uploadError.message.includes('401')) {
        console.log('💡 Dica: Verifique se o SANITY_API_TOKEN está correto e tem permissões de escrita')
      } else if (uploadError.message.includes('400')) {
        console.log('💡 Dica: Problema com formato do arquivo ou configuração')
      }

      throw uploadError
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)

    if (error.message.includes('Invalid API version')) {
      console.log('💡 Dica: Atualize a apiVersion para uma versão mais recente')
    } else if (error.message.includes('Unauthorized')) {
      console.log('💡 Dica: Verifique as credenciais do Sanity')
    }

    process.exit(1)
  }

  console.log('\n🎉 Todos os testes passaram! O Sanity está configurado corretamente.')
}

// Executar testes
testUpload()