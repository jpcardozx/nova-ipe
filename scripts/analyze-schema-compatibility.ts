#!/usr/bin/env tsx
/**
 * Análise completa: Schema WordPress vs Sanity
 * Verifica compatibilidade e necessidade de conversão
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

async function analyzeSchemaCompatibility() {
  console.log('🔍 ANÁLISE DE COMPATIBILIDADE: WordPress → Sanity')
  console.log('═'.repeat(70))
  console.log()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Buscar uma property sample do Supabase
  const { data: sampleWP } = await supabase
    .from('wordpress_properties')
    .select('data')
    .eq('status', 'pending')
    .limit(1)
    .single()

  if (!sampleWP) {
    console.error('❌ Nenhuma property encontrada')
    return
  }

  const wpFields = Object.keys(sampleWP.data)
  
  console.log('📋 CAMPOS DISPONÍVEIS NO WORDPRESS (WPL):')
  console.log('─'.repeat(70))
  console.log(`Total de campos: ${wpFields.length}`)
  console.log()

  // Agrupar por categoria
  const categories = {
    identificacao: wpFields.filter(k => 
      k.includes('id') || k.includes('mls') || k === 'kind'
    ),
    localizacao: wpFields.filter(k => 
      k.includes('location') || k.includes('street') || k.includes('field_42')
    ),
    caracteristicas: wpFields.filter(k => 
      k.includes('bedroom') || k.includes('bathroom') || k.includes('area') || 
      k.includes('price') || k.includes('living') || k.includes('lot')
    ),
    textos: wpFields.filter(k => 
      k.includes('field_312') || k.includes('field_313') || k.includes('field_308') ||
      k.includes('title') || k.includes('content') || k.includes('description')
    ),
    fotos: wpFields.filter(k => 
      k.includes('pic') || k.includes('image') || k.includes('photo') || k.includes('gallery')
    ),
    tipo: wpFields.filter(k => 
      k.includes('property_type') || k.includes('listing')
    ),
    outros: [] as string[]
  }

  // Outros campos
  categories.outros = wpFields.filter(k => 
    !categories.identificacao.includes(k) &&
    !categories.localizacao.includes(k) &&
    !categories.caracteristicas.includes(k) &&
    !categories.textos.includes(k) &&
    !categories.fotos.includes(k) &&
    !categories.tipo.includes(k)
  )

  Object.entries(categories).forEach(([cat, fields]) => {
    if (fields.length > 0) {
      console.log(`\n${cat.toUpperCase()}:`)
      fields.forEach(f => {
        const value = sampleWP.data[f]
        const preview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value
        console.log(`   ${f}: ${JSON.stringify(preview)}`)
      })
    }
  })

  console.log()
  console.log('═'.repeat(70))
  console.log('🎯 SCHEMA SANITY ESPERADO (imovel):')
  console.log('─'.repeat(70))

  const sanitySchema = {
    // Identificação
    _id: 'string',
    _type: 'imovel',
    titulo: 'string', // field_313 ou field_312
    slug: 'slug',
    
    // Localização
    localizacao: {
      pais: 'string', // location1_name
      estado: 'string', // location2_name
      cidade: 'string', // location3_name
      bairro: 'string', // location4_name
      rua: 'string', // field_42
      cep: 'string',
      lat: 'number',
      lng: 'number',
    },
    
    // Tipo e Finalidade
    tipo: 'reference → tipoImovel', // property_type
    finalidade: 'string', // listing (1=venda, 2=aluguel)
    
    // Características
    quartos: 'number', // bedrooms
    banheiros: 'number', // bathrooms
    vagas: 'number',
    areaUtil: 'number', // living_area
    areaTotal: 'number', // lot_area
    
    // Valores
    preco: 'number', // price
    precoCondominio: 'number',
    precoIPTU: 'number',
    
    // Descrição
    descricao: 'array<block>', // field_308
    caracteristicas: 'array<string>',
    
    // Fotos
    fotoPrincipal: 'image',
    fotos: 'array<image>',
    
    // Status
    status: 'string',
    destaque: 'boolean',
    
    // Metadata
    createdAt: 'datetime',
    updatedAt: 'datetime',
    wpId: 'number', // wp_id para tracking
  }

  console.log(JSON.stringify(sanitySchema, null, 2))
  console.log()
  
  console.log('═'.repeat(70))
  console.log('🔄 MAPEAMENTO NECESSÁRIO:')
  console.log('─'.repeat(70))
  console.log()

  const mapping = [
    { wp: 'field_313', sanity: 'titulo', conversion: 'string → string', status: '✅' },
    { wp: 'field_308', sanity: 'descricao', conversion: 'string → array<block>', status: '⚠️  Conversão' },
    { wp: 'location1_name', sanity: 'localizacao.pais', conversion: 'string → string', status: '✅' },
    { wp: 'location2_name', sanity: 'localizacao.estado', conversion: 'string → string', status: '✅' },
    { wp: 'location3_name', sanity: 'localizacao.cidade', conversion: 'string → string', status: '✅' },
    { wp: 'location4_name', sanity: 'localizacao.bairro', conversion: 'string → string', status: '✅' },
    { wp: 'field_42', sanity: 'localizacao.rua', conversion: 'string → string', status: '✅' },
    { wp: 'property_type', sanity: 'tipo (reference)', conversion: 'int → reference', status: '⚠️  Lookup' },
    { wp: 'listing', sanity: 'finalidade', conversion: '1=venda, 2=aluguel', status: '⚠️  Conversão' },
    { wp: 'bedrooms', sanity: 'quartos', conversion: 'float → number', status: '✅' },
    { wp: 'bathrooms', sanity: 'banheiros', conversion: 'float → number', status: '✅' },
    { wp: 'living_area', sanity: 'areaUtil', conversion: 'float → number', status: '✅' },
    { wp: 'lot_area', sanity: 'areaTotal', conversion: 'float → number', status: '✅' },
    { wp: 'price', sanity: 'preco', conversion: 'float → number', status: '✅' },
    { wp: 'pic_numb + gallery', sanity: 'fotos[]', conversion: 'URLs → image assets', status: '❌ Pendente' },
  ]

  console.log('| Campo WordPress | Campo Sanity | Conversão | Status |')
  console.log('|----------------|--------------|-----------|--------|')
  mapping.forEach(m => {
    console.log(`| ${m.wp.padEnd(15)} | ${m.sanity.padEnd(20)} | ${m.conversion.padEnd(20)} | ${m.status} |`)
  })

  console.log()
  console.log('═'.repeat(70))
  console.log('⚠️  CONVERSÕES NECESSÁRIAS:')
  console.log('─'.repeat(70))
  console.log()
  console.log('1. field_308 (descrição HTML) → Portable Text')
  console.log('   - HTML to Portable Text converter')
  console.log('   - Remover tags, preservar formatação')
  console.log()
  console.log('2. property_type (int) → Reference tipoImovel')
  console.log('   - Lookup table: 14 = Apartamento, etc')
  console.log('   - Criar/buscar documento tipoImovel no Sanity')
  console.log()
  console.log('3. listing (int) → string finalidade')
  console.log('   - 1 → "venda"')
  console.log('   - 2 → "aluguel"')
  console.log()
  console.log('4. gallery_image_ids → Sanity Image Assets')
  console.log('   - Download de Lightsail/R2')
  console.log('   - Upload para Sanity Asset API')
  console.log('   - Criar referências image')
  console.log()

  console.log('═'.repeat(70))
  console.log('📊 RESUMO DE COMPATIBILIDADE:')
  console.log('─'.repeat(70))
  console.log()
  const direct = mapping.filter(m => m.status === '✅').length
  const needsConversion = mapping.filter(m => m.status.includes('⚠️')).length
  const pending = mapping.filter(m => m.status === '❌').length
  
  console.log(`✅ Mapeamento direto:     ${direct}/${mapping.length}`)
  console.log(`⚠️  Precisa conversão:     ${needsConversion}/${mapping.length}`)
  console.log(`❌ Pendente (fotos):      ${pending}/${mapping.length}`)
  console.log()
  
  const compatibility = ((direct / mapping.length) * 100).toFixed(1)
  console.log(`🎯 Compatibilidade:       ${compatibility}%`)
  console.log()
}

analyzeSchemaCompatibility()
