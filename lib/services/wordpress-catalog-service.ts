/**
 * WordPress Catalog Service
 * Gerencia fichas do WordPress armazenadas no Supabase
 * Fotos ficam no Cloudflare R2 (30% mais barato + zero egress) até migração seletiva para Sanity
 */

import { WPLProperty, SanityProperty } from '@/scripts/wordpress-importer/types'
import { CloudflareR2Service } from './cloudflare-r2-service'
import { convertHtmlToPortableText } from '@/lib/utils/html-to-portable-text'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/utils/logger'

// 🔐 SEGURANÇA: Usa APENAS variáveis server-side (sem NEXT_PUBLIC_)
// Este service DEVE ser usado apenas em API routes (server-side)
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

// Lazy initialization: only create client when needed, not at module load time
let db: ReturnType<typeof getSupabaseAdmin> | null = null
const getDb = () => {
  if (!db) {
    db = getSupabaseAdmin()
  }
  return db
}

export interface WordPressPropertyRecord {
  id: string
  wp_id: number
  data: WPLProperty // JSON completo do WordPress
  status: 'pending' | 'reviewing' | 'approved' | 'migrated' | 'rejected' | 'archived'
  thumbnail_url?: string
  photo_count: number
  photo_urls?: string[] // URLs das fotos no Supabase Storage
  created_at: string
  updated_at: string
  reviewed_by?: string
  migrated_at?: string
  sanity_id?: string // ID no Sanity após migração
  notes?: string
}

export interface MigrationTask {
  id: string
  property_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  error_message?: string
  created_at: string
  completed_at?: string
}

export class WordPressCatalogService {
  /**
   * Importa properties do SQL para o Supabase (não Sanity!)
   * Checkpoint salvo no Supabase também
   */
  static async importToSupabase(
    properties: WPLProperty[],
    onProgress?: (current: number, total: number) => void
  ) {
    const total = properties.length
    let processed = 0
    let errors = 0
    let skipped = 0

    for (const prop of properties) {
      try {
        // Verifica se já existe
        const { data: existing, error: checkError } = await getDb()
          .from('wordpress_properties')
          .select('id')
          .eq('wp_id', prop.id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 = no rows returned (esperado quando não existe)
          throw checkError
        }

        if (existing) {
          skipped++
          processed++
          onProgress?.(processed, total)
          continue
        }

        // Insere no Supabase
        const { error: insertError } = await getDb().from('wordpress_properties').insert({
          wp_id: prop.id,
          data: prop,
          status: 'pending',
          photo_count: parseInt(String(prop.pic_numb || 0)),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

        if (insertError) {
          throw insertError
        }

        processed++
        onProgress?.(processed, total)
      } catch (error: any) {
        errors++
        logger.error(`\n❌ Failed to import property ${prop.id}:`, error.message || error)
      }
    }

    return { processed, total, errors, skipped }
  }

  /**
   * Conta total de properties no Supabase
   */
  static async countProperties() {
    const { count, error } = await getDb()
      .from('wordpress_properties')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      logger.error('Error counting properties:', error)
      return { count: 0, error }
    }
    
    return { count: count || 0 }
  }

  /**
   * Lista properties com filtros e paginação
   */
  static async getProperties({
    status,
    search,
    page = 1,
    limit = 30
  }: {
    status?: WordPressPropertyRecord['status']
    search?: string
    page?: number
    limit?: number
  }) {
    logger.service('WordPressCatalogService', 'getProperties', { status, search, page, limit })

    let query = db
      .from('wordpress_properties')
      .select('*', { count: 'exact' })

    if (status) {
      logger.service('WordPressCatalogService', 'Filtering by status', status)
      query = query.eq('status', status)
    }

    if (search) {
      logger.service('WordPressCatalogService', 'Searching for', search)
      query = query.or(`data->field_312.ilike.%${search}%,data->field_313.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    logger.service('WordPressCatalogService', 'Range', { from, to })

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      logger.error('[WordPressCatalogService] Query error:', error)
      throw error
    }

    logger.service('WordPressCatalogService', 'Query result', {
      dataLength: data?.length || 0,
      count,
      totalPages: Math.ceil((count || 0) / limit)
    })

    return {
      properties: data as WordPressPropertyRecord[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  /**
   * Obtém property única com detalhes
   */
  static async getProperty(id: string) {
    const { data, error } = await getDb()
      .from('wordpress_properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as WordPressPropertyRecord
  }

  /**
   * Obtém property por wp_id
   */
  static async getPropertyByWpId(wpId: number) {
    const { data, error } = await getDb()
      .from('wordpress_properties')
      .select('*')
      .eq('wp_id', wpId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data as WordPressPropertyRecord | null
  }

  /**
   * Atualiza photo_urls de uma property
   * Usado após upload local → R2
   */
  static async updatePhotoUrls(wpId: number, photoUrls: string[]) {
    const { error } = await getDb()
      .from('wordpress_properties')
      .update({
        photo_urls: photoUrls,
        thumbnail_url: photoUrls[0], // Primeira foto = thumbnail
        updated_at: new Date().toISOString()
      })
      .eq('wp_id', wpId)

    if (error) throw error
  }

  /**
   * Atualiza status da property
   */
  static async updatePropertyStatus(
    id: string,
    status: WordPressPropertyRecord['status'],
    notes?: string
  ) {
    const { error } = await getDb()
      .from('wordpress_properties')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }

  /**
   * Upload de fotos da property para Cloudflare R2
   * Fotos ficam em: wordpress-photos/{wp_id}/img_foto01.jpg
   * Custo: $0.015/GB + Zero egress (bandwidth grátis!)
   */
  static async uploadPropertyPhotos(
    wpId: number,
    photos: File[],
    onProgress?: (current: number, total: number) => void
  ) {
    // Upload para R2
    const uploadedUrls = await CloudflareR2Service.uploadPropertyPhotos(
      wpId,
      photos,
      onProgress
    )

    // Atualiza record no Supabase com URLs do R2
    const { data: property } = await getDb()
      .from('wordpress_properties')
      .select('id')
      .eq('wp_id', wpId)
      .single()

    if (property) {
      await db
        .from('wordpress_properties')
        .update({
          photo_urls: uploadedUrls,
          thumbnail_url: uploadedUrls[0], // Primeira foto = thumbnail
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id)
    }

    return uploadedUrls
  }

  /**
   * Migra fotos do Lightsail diretamente para R2
   * Baixa via URL e faz upload para R2
   */
  static async migratePhotosFromLightsail(
    wpId: number,
    photoCount: number,
    onProgress?: (current: number, total: number) => void
  ) {
    // Gera URLs do Lightsail
    const lightsailUrls: string[] = []
    for (let i = 1; i <= photoCount; i++) {
      const num = String(i).padStart(2, '0')
      lightsailUrls.push(`http://13.223.237.99/wp-content/uploads/WPL/${wpId}/img_foto${num}.jpg`)
    }

    // Migra para R2
    const uploadedUrls = await CloudflareR2Service.migrateFromLightsail(
      wpId,
      lightsailUrls,
      onProgress
    )

    // Atualiza record no Supabase
    const { data: property } = await getDb()
      .from('wordpress_properties')
      .select('id')
      .eq('wp_id', wpId)
      .single()

    if (property) {
      await db
        .from('wordpress_properties')
        .update({
          photo_urls: uploadedUrls,
          thumbnail_url: uploadedUrls[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id)
    }

    return uploadedUrls
  }

  /**
   * Migra property selecionada para o Sanity
   * Apenas quando aprovada e revisada
   */
  static async migrateToSanity(
    propertyId: string,
    sanityClient: any // @sanity/client instance
  ) {
    // Busca property
    const property = await this.getProperty(propertyId)
    if (!property || property.status !== 'approved') {
      throw new Error('Property must be approved before migration')
    }

    // Cria task de migração
    const { data: task } = await getDb()
      .from('wordpress_migration_tasks')
      .insert({
        property_id: propertyId,
        status: 'queued',
        progress: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    try {
      // Atualiza status
      await db
        .from('wordpress_migration_tasks')
        .update({ status: 'processing', progress: 10 })
        .eq('id', task.id)

      // 1. Upload de fotos do R2 para Sanity Assets (se houver)
      const imageAssets = []
      if (property.photo_urls && property.photo_urls.length > 0) {
        for (let i = 0; i < property.photo_urls.length; i++) {
          const photoUrl = property.photo_urls[i]
          
          // Download da foto do R2 (zero egress cost!)
          const response = await fetch(photoUrl)
          const blob = await response.blob()
          const file = new File([blob], `photo-${i}.jpg`, { type: 'image/jpeg' })

          // Upload para Sanity
          const asset = await sanityClient.assets.upload('image', file)
          imageAssets.push({
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            }
          })

          // Progresso: 10% a 60% = upload de fotos
          const progress = 10 + ((i + 1) / property.photo_urls.length) * 50
          await db
            .from('wordpress_migration_tasks')
            .update({ progress: Math.round(progress) })
            .eq('id', task.id)
        }
      }

      // 2. Cria document no Sanity
      await db
        .from('wordpress_migration_tasks')
        .update({ progress: 70 })
        .eq('id', task.id)

      // Converte HTML para Portable Text
      const descricaoPortableText = convertHtmlToPortableText(property.data.field_308)

      const sanityDoc = {
        _type: 'imovel',
        titulo: property.data.field_313 || property.data.field_312 || 'Sem título',
        slug: {
          _type: 'slug',
          current: this.generateSlug(property.data.field_313 || property.data.field_312 || `imovel-${property.wp_id}`)
        },
        finalidade: property.data.listing === 10 ? 'Aluguel' : 'Venda',
        tipoImovel: this.mapPropertyType(property.data.property_type),
        descricao: descricaoPortableText, // 🔥 Portable Text
        dormitorios: parseInt(String(property.data.bedrooms || 0)),
        banheiros: parseInt(String(property.data.bathrooms || 0)),
        suites: 0, // WordPress não tem esse campo
        vagas: 0, // WordPress não tem esse campo específico
        areaUtil: parseFloat(String(property.data.living_area || 0)),
        areaTotal: parseFloat(String(property.data.lot_area || property.data.living_area || 0)),
        preco: parseFloat(String(property.data.price || 0)),
        precoCondominio: 0, // WordPress não tem esse campo
        precoIPTU: 0, // WordPress não tem esse campo
        localizacao: {
          _type: 'localizacao',
          pais: 'Brasil',
          estado: property.data.location1_name || '',
          cidade: property.data.location2_name || '',
          bairro: property.data.location3_name || '',
          rua: property.data.field_42 || '',
          cep: '', // WordPress não tem campo zip estruturado
          numero: '',
          complemento: '',
          latitude: null,
          longitude: null,
        },
        caracteristicas: [], // WordPress não tem array estruturado
        status: 'disponivel',
        destaque: false,
        codigoInterno: property.data.mls_id,
        _wpId: property.wp_id,
        imagem: imageAssets[0], // Primeira foto
        galeria: imageAssets, // Todas as fotos
      }

      const result = await sanityClient.create(sanityDoc)

      // 3. Finaliza migração
      await db
        .from('wordpress_migration_tasks')
        .update({
          status: 'completed',
          progress: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', task.id)

      await db
        .from('wordpress_properties')
        .update({
          status: 'migrated',
          sanity_id: result._id,
          migrated_at: new Date().toISOString()
        })
        .eq('id', propertyId)

      return { success: true, sanityId: result._id }
    } catch (error) {
      logger.error('Migration failed:', error)
      
      await db
        .from('wordpress_migration_tasks')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', task.id)

      throw error
    }
  }

  /**
   * Obtém estatísticas do catálogo
   */
  static async getStats() {
    logger.service('WordPressCatalogService', 'getStats called')

    const { data: all, error } = await getDb()
      .from('wordpress_properties')
      .select('status, photo_count')

    if (error) {
      logger.error('[WordPressCatalogService] getStats error:', error)
      throw error
    }

    if (!all) {
      logger.service('WordPressCatalogService', 'No data returned')
      return null
    }

    logger.service('WordPressCatalogService', 'Data length', all.length)

    const stats = {
      total: all.length,
      by_status: {
        pending: all.filter(p => p.status === 'pending').length,
        reviewing: all.filter(p => p.status === 'reviewing').length,
        approved: all.filter(p => p.status === 'approved').length,
        migrated: all.filter(p => p.status === 'migrated').length,
        rejected: all.filter(p => p.status === 'rejected').length,
        archived: all.filter(p => p.status === 'archived').length,
      },
      with_photos: all.filter(p => p.photo_count > 0).length,
      without_photos: all.filter(p => p.photo_count === 0).length,
      ready_to_migrate: all.filter(p => p.status === 'approved').length
    }

    logger.service('WordPressCatalogService', 'Stats computed', stats)
    return stats
  }

  // Helpers
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private static mapPropertyType(wpType: number): SanityProperty['tipoImovel'] {
    const map: Record<number, SanityProperty['tipoImovel']> = {
      3: 'Apartamento',
      6: 'Apartamento',
      7: 'Casa',
      10: 'Comercial',
      13: 'Comercial',
      15: 'Outro',
      16: 'Outro',
      18: 'Comercial'
    }
    return map[wpType] || 'Outro'
  }
}
