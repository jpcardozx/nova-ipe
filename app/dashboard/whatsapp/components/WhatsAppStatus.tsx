'use client'

import { useWhatsApp } from '@/lib/hooks/useWhatsApp'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Settings,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function WhatsAppStatus() {
  const { status = { status: 'healthy', api: false, credentials: false, lastCheck: new Date().toISOString() }, isCheckingStatus, checkStatus } = useWhatsApp()

  const getStatusColor = () => {
    if (!('credentials' in status) || !status.credentials) return 'text-yellow-600 bg-yellow-100'
    if (status.status === 'healthy') return 'text-green-600 bg-green-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = () => {
    if (!('credentials' in status) || !status.credentials) {
      return <Settings className="w-4 h-4" />
    }
    if (status.status === 'healthy') {
      return <CheckCircle className="w-4 h-4" />
    }
    return <XCircle className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (!('credentials' in status) || !status.credentials) return 'Configuração Pendente'
    if (status.status === 'healthy') return 'WhatsApp API Online'
    return 'WhatsApp API Offline'
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">Status da API</CardTitle>
              <CardDescription>
                WhatsApp Business API - Meta Developer
              </CardDescription>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => checkStatus()}
            disabled={isCheckingStatus}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          {'lastCheck' in status && status.lastCheck && (
            <span className="text-sm text-gray-500">
              Última verificação: {new Date(status.lastCheck!).toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>

        {/* Detailed Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* API Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-3 border rounded-lg"
          >
            {'api' in status && status.api ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-sm">Conexão API</p>
              <p className="text-xs text-gray-600">
                {'api' in status && status.api ? 'Conectado' : 'Desconectado'}
              </p>
            </div>
          </motion.div>

          {/* Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-3 p-3 border rounded-lg"
          >
            {'credentials' in status && status.credentials ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <div>
              <p className="font-medium text-sm">Credenciais</p>
              <p className="text-xs text-gray-600">
                {'credentials' in status && status.credentials ? 'Configuradas' : 'Pendentes'}
              </p>
            </div>
          </motion.div>

          {/* Phone Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3 p-3 border rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">Número Oficial</p>
              <p className="text-xs text-gray-600">
                ID: 1115181027254547
              </p>
            </div>
          </motion.div>
        </div>

        {/* Configuration Details */}
        {'credentials' in status && status.credentials && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">WhatsApp Business API Configurado</h4>
                <p className="text-sm text-green-700 mt-1">
                  Sistema integrado com Meta Developer Platform usando credenciais oficiais.
                  Envios de mensagem funcionando via API oficial do WhatsApp.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-600">
                    ✓ Phone Number ID: 1115181027254547
                  </p>
                  <p className="text-xs text-green-600">
                    ✓ Access Token configurado
                  </p>
                  <p className="text-xs text-green-600">
                    ✓ Fallback para WhatsApp Web disponível
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {'error' in status && status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Erro na API</h4>
                <p className="text-sm text-red-700 mt-1">
                  {'error' in status ? String(status.error) : 'Erro desconhecido'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Warning */}
        {(!('credentials' in status) || !status.credentials) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Configuração Necessária</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Configure as credenciais do WhatsApp Business API para utilizar todas as funcionalidades.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}