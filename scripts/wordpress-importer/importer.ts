import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'
import type { ImportCheckpoint, WPLProperty, SanityProperty } from './types'
import { PROPERTY_TYPE_MAPPINGS, LISTING_TYPE_MAPPINGS } from './types'
// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const CHECKPOINT_FILE = path.join(process.cwd(), 'scripts/wordpress-importer/checkpoint.json')
const BATCH_SIZE = 30

// Sanity client config (lazy initialization for optional Sanity migration)
let _sanityClient: any = null
function getSanityClient() {
  if (!_sanityClient) {
    _sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-08',
      token: process.env.SANITY_API_TOKEN || '',
      useCdn: false
    })
  }
  return _sanityClient
}

// For backward compatibility
const client = getSanityClient()

// Load checkpoint
export function loadCheckpoint(): ImportCheckpoint {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      const data = fs.readFileSync(CHECKPOINT_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('⚠️  Failed to load checkpoint, starting fresh')
  }

  return {
    lastProcessedId: 0,
    totalProcessed: 0,
    totalFailed: 0,
    errors: [],
    completedBatches: [],
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
  }
}

// Save checkpoint
export function saveCheckpoint(checkpoint: ImportCheckpoint): void {
  checkpoint.lastUpdatedAt = new Date().toISOString()
  fs.mkdirSync(path.dirname(CHECKPOINT_FILE), { recursive: true })
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2))
}

// Parse SQL INSERT statements
export function parsePropertiesFromSQL(sqlFilePath: string): WPLProperty[] {
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8')
  const properties: WPLProperty[] = []

  // Find INSERT INTO wp_wpl_properties VALUES statements
  const insertPattern = /INSERT INTO `wp_wpl_properties` VALUES\s*\(([\s\S]+?)\);/gi
  const matches = sqlContent.matchAll(insertPattern)

  for (const match of matches) {
    const valuesStr = match[1]
    // Parse each row - WPL properties are complex with lots of fields
    // For now, we'll use a simplified parser for the key fields
    // In production, you'd want a proper SQL parser
    
    try {
      // Split by ),( to get individual rows
      const rows = valuesStr.split(/\),\s*\(/g)
      
      for (let row of rows) {
        row = row.replace(/^\(/, '').replace(/\)$/, '')
        const values = parseRowValues(row)
        
        if (values && values.length > 50) {
          const property: WPLProperty = {
            id: parseInt(values[0]) || 0,
            kind: parseInt(values[1]) || 0,
            deleted: parseInt(values[2]) || 0,
            mls_id: cleanString(values[3]),
            listing: parseInt(values[8]) || 0,
            property_type: parseInt(values[9]) || 0,
            location1_name: cleanString(values[17]), // Brasil
            location2_name: cleanString(values[18]), // São Paulo
            location3_name: cleanString(values[19]), // Guararema
            location4_name: cleanString(values[20]), // Bairro
            price: parseFloat(values[25]) || 0,
            price_unit: parseInt(values[26]) || 0,
            bedrooms: parseFloat(values[29]) || 0,
            bathrooms: parseFloat(values[31]) || 0,
            living_area: parseFloat(values[32]) || 0,
            living_area_unit: parseInt(values[33]) || 0,
            lot_area: parseFloat(values[35]) || 0,
            lot_area_unit: parseInt(values[36]) || 0,
            add_date: cleanString(values[42]),
            pic_numb: parseInt(values[6]) || 0,
            field_42: cleanString(values[63]), // Rua
            field_312: cleanString(values[64]), // Título página
            field_313: cleanString(values[65]), // Título imóvel
            field_308: cleanString(values[66]), // Descrição
            rendered_data: cleanString(values[125]) // JSON data
          }

          if (property.deleted === 0 && property.id > 0) {
            properties.push(property)
          }
        }
      }
    } catch (error) {
      console.error('Error parsing row:', error)
    }
  }

  return properties
}

function parseRowValues(row: string): string[] {
  const values: string[] = []
  let current = ''
  let inString = false
  let escapeNext = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (escapeNext) {
      current += char
      escapeNext = false
      continue
    }

    if (char === '\\') {
      escapeNext = true
      continue
    }

    if (char === "'" && !escapeNext) {
      inString = !inString
      continue
    }

    if (char === ',' && !inString) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current) {
    values.push(current.trim())
  }

  return values
}

function cleanString(value: string): string {
  if (!value || value === 'NULL') return ''
  return value
    .replace(/^'|'$/g, '')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
}

// Transform WPL property to Sanity property
export function transformToSanity(wplProperty: WPLProperty): SanityProperty {
  // Parse JSON data if available
  let parsedData: any = {}
  if (wplProperty.rendered_data) {
    try {
      parsedData = JSON.parse(wplProperty.rendered_data)
    } catch (e) {
      console.warn(`Failed to parse JSON for property ${wplProperty.id}`)
    }
  }

  // Determine property type
  const tipoImovel = PROPERTY_TYPE_MAPPINGS[wplProperty.property_type] || 'Outro'
  
  // Determine listing type (Venda/Aluguel)
  const finalidade = LISTING_TYPE_MAPPINGS[wplProperty.listing] || 'Venda'

  // Build title
  const titulo = wplProperty.field_313 || 
                 wplProperty.field_312 || 
                 `${tipoImovel} em ${wplProperty.location4_name || wplProperty.location3_name}`

  // Generate slug
  const slugBase = slugify(titulo + '-' + wplProperty.mls_id)

  return {
    _type: 'imovel',
    titulo: titulo.substring(0, 200),
    slug: {
      _type: 'slug',
      current: slugBase.substring(0, 96)
    },
    finalidade,
    tipoImovel,
    descricao: wplProperty.field_308,
    dormitorios: Math.floor(wplProperty.bedrooms),
    banheiros: Math.floor(wplProperty.bathrooms),
    areaUtil: wplProperty.living_area || undefined,
    preco: wplProperty.price || undefined,
    endereco: wplProperty.field_42,
    bairro: wplProperty.location4_name || 'Centro',
    cidade: wplProperty.location3_name || 'Guararema',
    estado: 'SP',
    codigoInterno: wplProperty.mls_id || wplProperty.id.toString(),
    status: 'disponivel',
    _wpId: wplProperty.id,
    _wpPhotos: wplProperty.pic_numb
  }
}

// Check if property already exists (avoid duplicates)
export async function propertyExists(wpId: number): Promise<boolean> {
  const query = `*[_type == "imovel" && _wpId == $wpId][0]._id`
  const result = await client.fetch(query, { wpId })
  return !!result
}

// Import single property
export async function importProperty(wplProperty: WPLProperty): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if already exists
    const exists = await propertyExists(wplProperty.id)
    if (exists) {
      console.log(`  ⏭️  Property ${wplProperty.id} (${wplProperty.mls_id}) already exists, skipping`)
      return { success: true }
    }

    // Transform to Sanity format
    const sanityProperty = transformToSanity(wplProperty)

    // Create in Sanity
    const result = await client.create(sanityProperty)

    console.log(`  ✅ Created property ${wplProperty.id} (${wplProperty.mls_id}) → ${result._id}`)
    return { success: true }
  } catch (error: any) {
    console.error(`  ❌ Failed to import property ${wplProperty.id}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Import batch of properties
export async function importBatch(
  properties: WPLProperty[],
  checkpoint: ImportCheckpoint
): Promise<ImportCheckpoint> {
  console.log(`\n📦 Importing batch of ${properties.length} properties...`)

  for (const property of properties) {
    const result = await importProperty(property)

    if (result.success) {
      checkpoint.totalProcessed++
      checkpoint.lastProcessedId = property.id
    } else {
      checkpoint.totalFailed++
      checkpoint.errors.push({
        id: property.id,
        error: result.error || 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }

    // Save checkpoint after each property
    saveCheckpoint(checkpoint)
  }

  return checkpoint
}

// Get next batch of properties
export function getNextBatch(
  allProperties: WPLProperty[],
  checkpoint: ImportCheckpoint
): WPLProperty[] {
  return allProperties
    .filter(p => p.id > checkpoint.lastProcessedId)
    .slice(0, BATCH_SIZE)
}

// Main import function
export async function runImport(sqlFilePath: string): Promise<void> {
  console.log('🚀 Starting WordPress WPL import...\n')

  // Parse SQL file
  console.log('📖 Parsing SQL file...')
  const allProperties = parsePropertiesFromSQL(sqlFilePath)
  console.log(`✅ Found ${allProperties.length} properties in SQL file\n`)

  // Load checkpoint
  const checkpoint = loadCheckpoint()
  console.log(`📍 Checkpoint: Last processed ID = ${checkpoint.lastProcessedId}`)
  console.log(`📊 Progress: ${checkpoint.totalProcessed} processed, ${checkpoint.totalFailed} failed\n`)

  // Get remaining properties
  const remainingProperties = allProperties.filter(p => p.id > checkpoint.lastProcessedId)
  
  if (remainingProperties.length === 0) {
    console.log('✅ All properties already imported!')
    return
  }

  console.log(`🔄 ${remainingProperties.length} properties remaining to import`)
  console.log(`📦 Processing in batches of ${BATCH_SIZE}\n`)

  // Process in batches
  let currentBatch = 1
  while (remainingProperties.length > 0) {
    const batch = getNextBatch(allProperties, checkpoint)
    
    if (batch.length === 0) break

    console.log(`\n${'='.repeat(60)}`)
    console.log(`📦 BATCH ${currentBatch} - IDs ${batch[0].id} to ${batch[batch.length - 1].id}`)
    console.log('='.repeat(60))

    await importBatch(batch, checkpoint)

    console.log(`\n✅ Batch ${currentBatch} complete`)
    console.log(`📊 Total progress: ${checkpoint.totalProcessed}/${allProperties.length} (${((checkpoint.totalProcessed / allProperties.length) * 100).toFixed(1)}%)`)

    currentBatch++

    // Remove processed properties from remaining
    const processedIds = batch.map(p => p.id)
    remainingProperties.splice(0, batch.length)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 IMPORT COMPLETE!')
  console.log('='.repeat(60))
  console.log(`✅ Successfully imported: ${checkpoint.totalProcessed}`)
  console.log(`❌ Failed: ${checkpoint.totalFailed}`)
  
  if (checkpoint.errors.length > 0) {
    console.log(`\n❌ Errors (${checkpoint.errors.length}):`)
    checkpoint.errors.slice(0, 10).forEach(err => {
      console.log(`   - Property ${err.id}: ${err.error}`)
    })
    if (checkpoint.errors.length > 10) {
      console.log(`   ... and ${checkpoint.errors.length - 10} more`)
    }
  }

  console.log('\n💾 Checkpoint saved to:', CHECKPOINT_FILE)
}
