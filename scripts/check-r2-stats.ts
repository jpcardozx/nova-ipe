#!/usr/bin/env tsx
/**
 * Check R2 Storage Stats
 * Útil para monitorar uso durante migração
 */

import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

async function checkStats() {
  try {
    console.log('📊 Cloudflare R2 Storage Stats\n')
    
    const stats = await CloudflareR2Service.getStorageStats()
    
    console.log('═'.repeat(50))
    console.log(`📁 Total de arquivos: ${stats.totalFiles.toLocaleString()}`)
    console.log(`💾 Tamanho total: ${stats.totalSizeGB} GB`)
    console.log(`💰 Custo mensal: $${stats.monthlyCost}`)
    console.log(`💰 Custo anual: $${(parseFloat(stats.monthlyCost) * 12).toFixed(2)}`)
    console.log('═'.repeat(50))
    
    // Estimativas
    const avgPhotosPerProperty = stats.totalFiles > 0 ? Math.round(stats.totalFiles / 761) : 0
    console.log('\n📊 Estimativas:')
    console.log(`   Fotos por property (média): ${avgPhotosPerProperty}`)
    
    if (stats.totalFiles > 0) {
      const progress = (stats.totalFiles / 6088) * 100 // ~761 × 8 fotos
      console.log(`   Progresso de migração: ${progress.toFixed(1)}%`)
    }
    
    // Free tier
    const freeGB = 10
    const sizeGB = typeof stats.totalSizeGB === 'string' ? parseFloat(stats.totalSizeGB) : stats.totalSizeGB
    const remaining = freeGB - sizeGB
    console.log(`\n🎁 Free Tier:`)
    console.log(`   Limite: ${freeGB} GB/mês`)
    console.log(`   Usado: ${stats.totalSizeGB} GB`)
    console.log(`   Restante: ${remaining.toFixed(2)} GB`)
    
    if (sizeGB < freeGB) {
      console.log(`   ✅ Dentro do free tier (sem custos!)`)
    } else {
      console.log(`   ⚠️  Acima do free tier (cobrado: ${(sizeGB - freeGB).toFixed(2)} GB)`)
    }
    
    console.log('')
    
  } catch (error) {
    console.error('❌ Erro ao obter stats:', error instanceof Error ? error.message : error)
    console.error('\n💡 Verifique se as credenciais R2 estão corretas no .env.local')
    process.exit(1)
  }
}

checkStats()
