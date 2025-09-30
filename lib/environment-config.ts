export class EnvironmentManager {
  static getSanityConfig() {
    // Debug das variáveis antes de processá-las
    console.log('🔍 Raw Environment Variables:', {
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN ? '[SET]' : '[NOT SET]',
      NODE_ENV: process.env.NODE_ENV
    })
    
    const config = {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      token: process.env.SANITY_API_TOKEN || '',
      // Para o Studio, consideramos configurado se temos projectId e dataset (mesmo que sejam os padrões)
      configured: !!(
        (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj') && 
        (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production')
      )
    }
    
    // Debug detalhado
    console.log('🔍 Environment Debug - Sanity Config:', {
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      hasToken: !!config.token,
      configured: config.configured,
      configuredReason: config.configured ? 
        'ProjectId e Dataset estão definidos' : 
        `Faltando: ${!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'ProjectId ' : ''}${!process.env.NEXT_PUBLIC_SANITY_DATASET ? 'Dataset' : ''}`
    })
    
    return config
  }

  static getSupabaseConfig() {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  }

  static getConfig() {
    return {
      sanity: this.getSanityConfig(),
      supabase: this.getSupabaseConfig()
    }
  }

  static getConfigErrorMessage(service: string) {
    if (service === 'Sanity') {
      const config = this.getSanityConfig()
      const missing = []
      
      if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
      if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET')
      
      if (missing.length > 0) {
        return `Sanity Studio: Variáveis faltando: ${missing.join(', ')}`
      }
      
      return 'Sanity Studio configurado corretamente'
    }
    
    if (service === 'Supabase') {
      const missing = []
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      if (missing.length > 0) {
        return `Supabase: Variáveis faltando: ${missing.join(', ')}`
      }
      
      return 'Supabase configurado corretamente'
    }
    
    return 'Serviço desconhecido'
  }

  static debugAllConfigs() {
    console.log('🔍 === DEBUG COMPLETO DE CONFIGURAÇÕES ===')
    console.log('🔍 Sanity:', this.getConfigErrorMessage('Sanity'))
    console.log('🔍 Supabase:', this.getConfigErrorMessage('Supabase'))
    console.log('🔍 Config completo:', this.getConfig())
    console.log('🔍 === FIM DEBUG ===')
  }
}