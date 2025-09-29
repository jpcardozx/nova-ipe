import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Settings,
  Zap,
  MessageSquare,
  Clock,
  Users,
  BarChart3,
  Shield,
  Key,
  Eye,
  EyeOff,
  Save,
  TestTube,
  Play,
  Pause
} from 'lucide-react'
import { WhatsAppBusinessAPI } from '@/lib/services/whatsapp-business-api'

interface BotConfigurationProps {
  className?: string
}

export default function BotConfiguration({ className = '' }: BotConfigurationProps) {
  const [botEnabled, setBotEnabled] = useState(true)
  const [autoResponseDelay, setAutoResponseDelay] = useState(30)
  const [businessHours, setBusinessHours] = useState({
    enabled: true,
    start: '08:00',
    end: '18:00',
    weekends: false
  })
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState({
    phoneNumberId: '',
    accessToken: '',
    webhookToken: ''
  })

  const handleTestConnection = async () => {
    const health = await WhatsAppBusinessAPI.healthCheck()
    alert(`Status: ${health.status}\\nAPI: ${health.api ? 'OK' : 'Erro'}\\nCredenciais: ${health.credentials ? 'OK' : 'Erro'}`)
  }

  const handleSaveConfig = () => {
    // TODO: Save configuration to backend
    alert('Configurações salvas com sucesso!')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Bot Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${botEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Bot className={`h-5 w-5 ${botEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bot WhatsApp</h3>
              <p className="text-sm text-gray-500">
                {botEnabled ? 'Ativo e processando mensagens' : 'Inativo'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setBotEnabled(!botEnabled)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${botEnabled ? 'bg-green-600' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${botEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">API Status</p>
              <p className="text-lg font-bold text-blue-600">{WhatsAppBusinessAPI.isConfigured() ? 'Conectada' : 'Desconectada'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Zap className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Templates</p>
              <p className="text-lg font-bold text-green-600">{Object.keys(WhatsAppBusinessAPI.Templates).length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Shield className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-900">Credenciais</p>
              <p className="text-lg font-bold text-purple-600">{WhatsAppBusinessAPI.isConfigured() ? 'OK' : 'Pendente'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configuration Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Bot
        </h3>

        <div className="space-y-4">
          {/* Auto Response Delay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay para Resposta Automática (segundos)
            </label>
            <input
              type="range"
              min="0"
              max="300"
              value={autoResponseDelay}
              onChange={(e) => setAutoResponseDelay(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Instantâneo</span>
              <span className="font-medium">{autoResponseDelay}s</span>
              <span>5 min</span>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Horário Comercial
              </label>
              <button
                onClick={() => setBusinessHours(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`
                  relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                  ${businessHours.enabled ? 'bg-green-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                    ${businessHours.enabled ? 'translate-x-5' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
            {businessHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Início</label>
                  <input
                    type="time"
                    value={businessHours.start}
                    onChange={(e) => setBusinessHours(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fim</label>
                  <input
                    type="time"
                    value={businessHours.end}
                    onChange={(e) => setBusinessHours(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* API Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Credenciais da API
          </h3>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number ID
            </label>
            <input
              type={showCredentials ? 'text' : 'password'}
              value={showCredentials ? process.env.META_WHATSAPP_PHONE_NUMBER_ID || 'Não configurado' : '••••••••••••'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token
            </label>
            <input
              type={showCredentials ? 'text' : 'password'}
              value={showCredentials ? process.env.META_WHATSAPP_ACCESS_TOKEN || 'Não configurado' : '••••••••••••••••••••••••••••••••'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleTestConnection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <TestTube className="h-4 w-4" />
            Testar Conexão
          </button>
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Salvar Configurações
          </button>
        </div>
      </motion.div>

      {/* Templates Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Templates de Mensagens
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(WhatsAppBusinessAPI.Templates).map(([key, template]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{key.toLowerCase().replace('_', ' ')}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Ativo
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Template: {template.name}
              </p>
              <button className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Testar Template
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Mensagens Rápidas
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Boas-vindas</h4>
              <p className="text-sm text-gray-600">Mensagem automática para novos contatos</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Configurar
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Info de Imóvel</h4>
              <p className="text-sm text-gray-600">Template para envio de informações de propriedades</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Configurar
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Alíquotas</h4>
              <p className="text-sm text-gray-600">Notificação de reajustes de aluguel</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Configurar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}