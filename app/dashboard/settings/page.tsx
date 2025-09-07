'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { Settings, Bell, Save, RefreshCw, Check, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
    const { user } = useCurrentUser()
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleSave = async () => {
        setSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSaveMessage({ type: 'success', message: 'Configurações salvas!' })
            setTimeout(() => setSaveMessage(null), 3000)
        } catch (error) {
            setSaveMessage({ type: 'error', message: 'Erro ao salvar.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                    <p className="text-gray-600">Gerencie suas preferências</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>

            {saveMessage && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {saveMessage.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span>{saveMessage.message}</span>
                </div>
            )}

            <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Perfil</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input type="text" defaultValue={user?.email?.split('@')[0] || ''} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                </h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Novos leads</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Agendamentos</span>
                    </label>
                </div>
            </div>
        </motion.div>
    )
}