'use client'

import { useState, useEffect } from 'react'
import { Database, Upload, CheckCircle, AlertCircle, RefreshCw, Download, Folder, FileText } from 'lucide-react'

interface ImportProgress {
  lastProcessedId: number
  totalProcessed: number
  totalFailed: number
  errors: Array<{
    id: number
    error: string
    timestamp: string
  }>
  completedBatches: number[]
  startedAt: string
  lastUpdatedAt: string
}

interface ImportStats {
  totalProperties: number
  processed: number
  failed: number
  remaining: number
  progress: number
  isRunning: boolean
  errors: ImportProgress['errors']
}

export default function WordPressCatalogPage() {
  const [stats, setStats] = useState<ImportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    loadStats()
    // Poll for updates while importing
    const interval = setInterval(() => {
      if (importing) {
        loadStats()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [importing])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/wordpress-import/status')
      const data = await res.json()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load stats:', error)
      setLoading(false)
    }
  }

  const startImport = async () => {
    setImporting(true)
    try {
      await fetch('/api/wordpress-import/start', { method: 'POST' })
      await loadStats()
    } catch (error) {
      console.error('Failed to start import:', error)
    } finally {
      setImporting(false)
    }
  }

  const resetImport = async () => {
    if (!confirm('Tem certeza que deseja resetar o checkpoint? Isso fará com que a importação comece do zero.')) {
      return
    }
    try {
      await fetch('/api/wordpress-import/reset', { method: 'POST' })
      await loadStats()
    } catch (error) {
      console.error('Failed to reset import:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900">Catálogo WordPress</h1>
        </div>
        <p className="text-gray-600">
          Importação segura de fichas de imóveis do WordPress WPL para o Sanity CMS
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">
              {stats?.totalProperties || 761}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total de Imóveis</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-900">
              {stats?.processed || 0}
            </span>
          </div>
          <p className="text-sm text-green-700">Importados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-bold text-red-900">
              {stats?.failed || 0}
            </span>
          </div>
          <p className="text-sm text-red-700">Erros</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200 bg-amber-50">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">
              {stats?.remaining || 761}
            </span>
          </div>
          <p className="text-sm text-amber-700">Restantes</p>
        </div>
      </div>

      {/* Progress Bar */}
      {stats && stats.totalProperties > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Progresso da Importação</span>
            <span className="text-sm font-bold text-gray-900">
              {stats.progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.processed} de {stats.totalProperties} imóveis processados • 
            Batches de 30 imóveis por vez
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={startImport}
            disabled={importing || (stats?.remaining === 0)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {importing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {stats?.processed === 0 ? 'Iniciar Importação' : 'Continuar Importação'}
              </>
            )}
          </button>

          <button
            onClick={loadStats}
            disabled={importing}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${importing ? 'animate-spin' : ''}`} />
            Atualizar Status
          </button>

          <button
            onClick={resetImport}
            disabled={importing}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
            Resetar Checkpoint
          </button>

          <a
            href="/exports/imoveis/imoveis-export-20251008"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Ver Dados Exportados
          </a>
        </div>
      </div>

      {/* Architecture Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Organização dos Dados</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
              <div>
                <p className="font-medium text-gray-900">Database SQL</p>
                <p className="text-gray-600">exports/imoveis/database/imoveis-completo.sql (6.7MB)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
              <div>
                <p className="font-medium text-gray-900">Fotos dos Imóveis</p>
                <p className="text-gray-600">Servidor Lightsail: /wp-content/uploads/WPL/ (4.2GB)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
              <div>
                <p className="font-medium text-gray-900">Relatórios</p>
                <p className="text-gray-600">Lista formatada + índice de pastas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Mapeamento de Schema</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">wp_wpl_properties</span>
              <span className="text-gray-900 font-medium">→ imovel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">listing (0-10)</span>
              <span className="text-gray-900 font-medium">→ finalidade</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">property_type (3-18)</span>
              <span className="text-gray-900 font-medium">→ tipoImovel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">mls_id</span>
              <span className="text-gray-900 font-medium">→ codigoInterno</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {stats && stats.errors.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Erros de Importação</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.errors.slice(0, 10).map((error, idx) => (
              <div key={idx} className="p-3 bg-red-50 rounded border border-red-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">Imóvel ID: {error.id}</p>
                    <p className="text-xs text-red-700 mt-1">{error.error}</p>
                  </div>
                  <span className="text-xs text-red-600">{new Date(error.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {stats.errors.length > 10 && (
              <p className="text-sm text-gray-600 text-center pt-2">
                ... e mais {stats.errors.length - 10} erros
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">ℹ️ Informações Importantes:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>A importação é feita em batches de 30 imóveis por vez para evitar sobrecarga</li>
              <li>O checkpoint é salvo após cada imóvel processado para garantir segurança</li>
              <li>Fichas duplicadas são automaticamente detectadas e ignoradas</li>
              <li>As fotos dos imóveis permanecem no servidor Lightsail (download separado se necessário)</li>
              <li>Após importação, as fotos podem ser associadas manualmente ou via script separado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
