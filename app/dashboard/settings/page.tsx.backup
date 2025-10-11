'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { Settings, Bell, Save, RefreshCw, Check, AlertCircle, Lock, User, Shield } from 'lucide-react'
import PasswordChangeForm from '../components/PasswordChangeForm'

export default function SettingsPage() {
    const { user } = useCurrentUser()
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
    const [showPasswordForm, setShowPasswordForm] = useState(false)

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

    const tabs = [
        { id: 'profile' as const, label: 'Perfil', icon: User },
        { id: 'security' as const, label: 'Segurança', icon: Shield },
        { id: 'notifications' as const, label: 'Notificações', icon: Bell }
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                    <p className="text-gray-600">Gerencie suas preferências e segurança</p>
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

            {/* Tabs */}
            <div className="bg-white rounded-lg border">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Tab: Perfil */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Informações do Perfil</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.full_name || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Telefone</label>
                                    <input
                                        type="tel"
                                        defaultValue={user?.phone || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Departamento</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.department || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Segurança */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Configurações de Segurança</h3>

                            {/* Alteração de Senha */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Lock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Senha da Conta</h4>
                                            <p className="text-sm text-gray-500">
                                                Altere sua senha para manter sua conta segura
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Alterar Senha
                                    </button>
                                </div>
                            </div>

                            {/* Informações de Segurança */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">Informações de Segurança</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Último login:</span>
                                        <span>{user?.last_login ? new Date(user.last_login).toLocaleString('pt-BR') : 'Nunca'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Conta criada:</span>
                                        <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status da conta:</span>
                                        <span className="capitalize">{user?.status || 'Ativo'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Nível de acesso:</span>
                                        <span>{user?.role?.name || 'Usuário'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Notificações */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Preferências de Notificação</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Notificações por Email</h4>
                                        <p className="text-sm text-gray-500">Receber atualizações importantes por email</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Notificações Push</h4>
                                        <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Relatórios Semanais</h4>
                                        <p className="text-sm text-gray-500">Resumo semanal de atividades</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Alteração de Senha */}
            {showPasswordForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <PasswordChangeForm
                            onSuccess={() => {
                                setShowPasswordForm(false)
                                setSaveMessage({ type: 'success', message: 'Senha alterada com sucesso!' })
                            }}
                            onCancel={() => setShowPasswordForm(false)}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    )
}