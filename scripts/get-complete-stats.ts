import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function getCompleteStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Total
  const { count: total } = await supabase
    .from('wordpress_properties')
    .select('*', { count: 'exact', head: true })

  // Por status
  const { data: allProps } = await supabase
    .from('wordpress_properties')
    .select('status')

  const byStatus: Record<string, number> = {}
  allProps?.forEach((p) => {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1
  })

  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║         📊 STATUS COMPLETO DA IMPORTAÇÃO                     ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log()
  console.log('TOTAL NO SUPABASE:', total)
  console.log()
  console.log('POR STATUS:')
  Object.entries(byStatus)
    .sort((a, b) => b[1] - a[1])
    .forEach(([status, count]) => {
      const badges: Record<string, string> = {
        pending: '🟢',
        archived: '📦',
        approved: '✅',
        rejected: '❌',
        reviewing: '🔵',
        migrated: '🎉',
      }
      const badge = badges[status] || '⚪'
      console.log(`   ${badge} ${status.padEnd(12)} ${count}`)
    })
  console.log()
  console.log('ANÁLISE SQL ORIGINAL:')
  console.log('   Total:     761')
  console.log('   Ativas:    141')
  console.log('   Deletadas: 620')
  console.log()
  console.log(
    total === 761
      ? '✅ PERFEITO: Todas as 761 properties importadas!'
      : `⚠️  Faltam ${761 - (total || 0)} properties`
  )
  console.log()
  console.log('═'.repeat(64))
}

getCompleteStats()
