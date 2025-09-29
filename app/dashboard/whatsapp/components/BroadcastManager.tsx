'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, Send, BarChart3, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

interface BroadcastCampaign {
  id: string
  name: string
  targetTags: string[]
  template: string
  scheduledAt: Date
  status: 'draft' | 'scheduled' | 'running' | 'completed'
  metrics: {
    sent: number
    delivered: number
    read: number
    replied: number
  }
}

export default function BroadcastManager() {
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([
    {
      id: '1',
      name: 'Promoção Apartamentos Centro',
      targetTags: ['comprador', 'apartamento'],
      template: 'Oportunidade única! Apartamentos no centro com desconto especial.',
      scheduledAt: new Date(),
      status: 'running',
      metrics: { sent: 150, delivered: 142, read: 89, replied: 23 }
    }
  ])

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    targetTags: [],
    template: '',
    scheduledAt: new Date()
  })

  const availableTags = ['comprador', 'locatário', 'proprietário', 'apartamento', 'casa', 'comercial']

  const createCampaign = () => {
    const campaign: BroadcastCampaign = {
      id: Date.now().toString(),
      ...newCampaign,
      status: 'draft',
      metrics: { sent: 0, delivered: 0, read: 0, replied: 0 }
    }
    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: '', targetTags: [], template: '', scheduledAt: new Date() })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'running': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campanhas Broadcast</h2>
          <p className="text-gray-600">Gerencie campanhas em massa para WhatsApp</p>
        </div>
        <Button
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <Send className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Send className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Entrega</p>
                  <p className="text-2xl font-bold text-gray-900">94.6%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Leitura</p>
                  <p className="text-2xl font-bold text-gray-900">67.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Resposta</p>
                  <p className="text-2xl font-bold text-gray-900">23.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Campaign Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Campanha</CardTitle>
          <CardDescription>
            Configure uma nova campanha de broadcast para seus contatos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome da Campanha</label>
              <Input
                placeholder="Ex: Promoção Apartamentos"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags de Destino</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione tags" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Template da Mensagem</label>
            <Textarea
              placeholder="Digite sua mensagem aqui..."
              className="min-h-[100px]"
              value={newCampaign.template}
              onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>
            <Button onClick={createCampaign}>
              <Send className="w-4 h-4 mr-2" />
              Criar Campanha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Campanhas Ativas</h3>
        <div className="grid gap-4">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Tags: {campaign.targetTags.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Relatório
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.template}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.metrics.sent}</p>
                      <p className="text-sm text-gray-500">Enviadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.metrics.delivered}</p>
                      <p className="text-sm text-gray-500">Entregues</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{campaign.metrics.read}</p>
                      <p className="text-sm text-gray-500">Lidas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{campaign.metrics.replied}</p>
                      <p className="text-sm text-gray-500">Respostas</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Conversão:</span>
                      <span className="font-semibold">
                        {campaign.metrics.sent > 0
                          ? ((campaign.metrics.replied / campaign.metrics.sent) * 100).toFixed(1)
                          : '0'
                        }%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}