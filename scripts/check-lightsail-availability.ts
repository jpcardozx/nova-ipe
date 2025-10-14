import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const LIGHTSAIL_BASE = 'http://13.223.237.99/wp-content/uploads/WPL'

async function checkLightsailAvailability() {
  console.log('🔍 VERIFICANDO DISPONIBILIDADE NO LIGHTSAIL')
  console.log('=' .repeat(60))
  
  try {
    // Buscar propriedades que ainda não têm fotos no R2
    console.log('\n📋 Buscando propriedades sem R2...')
    const { data: allProperties, error } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_count, photo_urls')
      .gt('photo_count', 0)
      .order('wp_id')
    
    if (error) {
      console.error('❌ Erro:', error.message)
      return
    }
    
    // Filtrar apenas as que não têm URLs do R2
    const withoutR2 = allProperties.filter(p => {
      const urls = Array.isArray(p.photo_urls) ? p.photo_urls : []
      return !urls.some((url: string) => url.includes('r2.cloudflarestorage.com'))
    })
    
    console.log(`✅ Encontradas ${withoutR2.length} propriedades sem R2`)
    
    // Testar uma amostra no Lightsail
    console.log('\n🌐 Testando disponibilidade no Lightsail...')
    console.log('   (Testando amostra de 20 propriedades)')
    
    const sample = withoutR2.slice(0, 20)
    let available = 0
    let unavailable = 0
    let errors = 0
    
    for (const prop of sample) {
      const wpId = prop.wp_id
      const testUrl = `${LIGHTSAIL_BASE}/${wpId}/img_foto01.jpg`
      
      try {
        const response = await fetch(testUrl, { method: 'HEAD' })
        
        if (response.ok) {
          process.stdout.write(`\r   ✅ wp_id ${wpId}: Disponível (${response.status})`)
          available++
        } else {
          process.stdout.write(`\r   ❌ wp_id ${wpId}: Indisponível (${response.status})`)
          unavailable++
        }
      } catch (err: any) {
        process.stdout.write(`\r   ⚠️  wp_id ${wpId}: Erro (${err.message})`)
        errors++
      }
      
      // Delay para não sobrecarregar o servidor
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('\n\n📊 RESULTADO DO TESTE')
    console.log('=' .repeat(60))
    console.log(`✅ Disponíveis: ${available}/${sample.length}`)
    console.log(`❌ Indisponíveis: ${unavailable}/${sample.length}`)
    console.log(`⚠️  Erros: ${errors}/${sample.length}`)
    
    const availabilityRate = (available / sample.length) * 100
    console.log(`\n📈 Taxa de disponibilidade: ${availabilityRate.toFixed(1)}%`)
    
    if (availabilityRate > 80) {
      console.log('\n💡 RECOMENDAÇÃO')
      console.log('=' .repeat(60))
      console.log('✅ A maioria das fotos está disponível no Lightsail!')
      console.log(`📤 Você pode migrar as ${withoutR2.length} propriedades restantes`)
      console.log('\nExecute:')
      console.log('   pnpm tsx scripts/migrate-all-photos-to-r2.ts')
    } else if (availabilityRate > 50) {
      console.log('\n⚠️  ATENÇÃO')
      console.log('=' .repeat(60))
      console.log('Algumas fotos não estão disponíveis no Lightsail.')
      console.log('Recomendamos verificar o servidor antes de migrar.')
    } else {
      console.log('\n❌ PROBLEMA')
      console.log('=' .repeat(60))
      console.log('A maioria das fotos não está disponível no Lightsail.')
      console.log('Pode ser necessário restaurar backup ou verificar servidor.')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    process.exit(1)
  }
}

checkLightsailAvailability()
