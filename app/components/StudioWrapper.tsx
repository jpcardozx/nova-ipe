/**
 * 🚀 Studio Wrapper - Otimizado para Performance
 * Carrega Sanity Studio com code splitting agressivo
 */

'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PerformanceMonitor } from '@/lib/utils/performance-monitor'

// Preload do Sanity config (sem NextStudio ainda)
const preloadSanityConfig = () => {
  return import('../../sanity.config').then(mod => {
    console.log('✅ [Studio Wrapper] Sanity config preloaded')
    return mod.default
  })
}

export default function StudioWrapper() {
  const [Studio, setStudio] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingPhase, setLoadingPhase] = useState<'config' | 'studio' | 'ready'>('config')

  useEffect(() => {
    const timer = PerformanceMonitor.startTimer('Studio Complete Load', 'dynamic_import')

    const loadStudio = async () => {
      try {
        // PHASE 1: Carregar config (rápido)
        setLoadingPhase('config')
        const configTimer = PerformanceMonitor.startTimer('Studio Config Load', 'dynamic_import')
        const sanityConfig = await preloadSanityConfig()
        setConfig(sanityConfig)
        configTimer.end()

        // PHASE 2: Carregar NextStudio (lento - 9000+ módulos)
        setLoadingPhase('studio')
        const studioTimer = PerformanceMonitor.startTimer('NextStudio Load', 'critical')
        
        // @ts-ignore
        const { NextStudio } = await import('../lib/sanity/studio.js')
        
        const studioLoadResult = studioTimer.end()
        
        // Alertar se demorou muito
        if (studioLoadResult.isCritical) {
          console.error(
            `🚨 [Studio Wrapper] NextStudio levou ${studioLoadResult.duration.toFixed(0)}ms para carregar!`
          )
        }

        setStudio(() => NextStudio)
        setLoadingPhase('ready')
        
        const totalResult = timer.end()
        console.log(
          `📊 [Studio Wrapper] Load completo: ${totalResult.duration.toFixed(0)}ms total`
        )

      } catch (err) {
        console.error('❌ [Studio Wrapper] Erro ao carregar:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        timer.end({ error: true })
      }
    }

    loadStudio()
  }, [])

  // Loading state com progresso
  if (!Studio || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center space-y-6 max-w-md px-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-amber-600" />
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Carregando Sanity Studio
            </h2>
            
            {loadingPhase === 'config' && (
              <p className="text-sm text-gray-600">
                ⚡ Fase 1/2: Carregando configurações...
              </p>
            )}
            
            {loadingPhase === 'studio' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  ⏳ Fase 2/2: Carregando editor...
                </p>
                <p className="text-xs text-gray-500">
                  Isso pode levar 10-30s na primeira vez
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-amber-600 h-2 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Renderizar Studio
  return <Studio config={config} />
}
