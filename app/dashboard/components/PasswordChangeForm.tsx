'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Lock,
    Eye,
    EyeOff,
    Shield,
    Check,
    AlertTriangle,
    Info,
    Save,
    RefreshCw
} from 'lucide-react'
import { PasswordAuthorizationManager, PasswordChangeRequest } from '@/lib/auth/password-authorization'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface PasswordChangeFormProps {
    targetUserId?: string
    isAdminChange?: boolean
    onSuccess?: () => void
    onCancel?: () => void
}

export default function PasswordChangeForm({
    targetUserId,
    isAdminChange = false,
    onSuccess,
    onCancel
}: PasswordChangeFormProps) {
    const { user: currentUser } = useCurrentUser()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        reason: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [validation, setValidation] = useState({
        errors: [] as string[],
        strength: 0
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{
        type: 'success' | 'error' | 'warning'
        message: string
    } | null>(null)

    const passwordManager = PasswordAuthorizationManager.getInstance()
    const isOwnPassword = !targetUserId || targetUserId === currentUser?.id

    // Validação em tempo real da senha
    const validatePassword = (password: string) => {
        const validation = passwordManager.validatePasswordSecurity(password)
        let strength = 0

        if (password.length >= 8) strength += 20
        if (/[A-Z]/.test(password)) strength += 20
        if (/[a-z]/.test(password)) strength += 20
        if (/\d/.test(password)) strength += 20
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20

        setValidation({
            errors: validation.errors,
            strength
        })
    }

    const handlePasswordChange = (value: string) => {
        setFormData(prev => ({ ...prev, newPassword: value }))
        validatePassword(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUser) return

        setLoading(true)
        setResult(null)

        try {
            const request: PasswordChangeRequest = {
                userId: targetUserId || currentUser.id,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
                requestedBy: currentUser.id,
                reason: formData.reason
            }

            const response = await passwordManager.processPasswordChange(request)

            if (response.success) {
                setResult({
                    type: response.requiresApproval ? 'warning' : 'success',
                    message: response.message
                })

                if (!response.requiresApproval) {
                    // Limpar formulário após sucesso
                    setFormData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        reason: ''
                    })

                    if (onSuccess) {
                        setTimeout(onSuccess, 2000)
                    }
                }
            } else {
                setResult({
                    type: 'error',
                    message: response.message
                })
            }
        } catch (error) {
            setResult({
                type: 'error',
                message: 'Erro interno do sistema'
            })
        } finally {
            setLoading(false)
        }
    }

    const getStrengthColor = (strength: number) => {
        if (strength < 40) return 'bg-red-500'
        if (strength < 80) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStrengthText = (strength: number) => {
        if (strength < 40) return 'Fraca'
        if (strength < 80) return 'Média'
        return 'Forte'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 max-w-md mx-auto"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isOwnPassword ? 'Alterar Minha Senha' : 'Alterar Senha do Usuário'}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {isOwnPassword ? 'Mantenha sua conta segura' : 'Alterar senha de outro usuário'}
                    </p>
                </div>
            </div>

            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${result.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : result.type === 'warning'
                                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                >
                    {result.type === 'success' && <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                    {result.type === 'warning' && <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                    {result.type === 'error' && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                    <span className="text-sm">{result.message}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Senha Atual - só aparece se for alteração própria */}
                {isOwnPassword && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha Atual *
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Digite sua senha atual"
                                required={isOwnPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Nova Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha *
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Digite a nova senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Indicador de força da senha */}
                    {formData.newPassword && (
                        <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(validation.strength)}`}
                                        style={{ width: `${validation.strength}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    {getStrengthText(validation.strength)}
                                </span>
                            </div>

                            {validation.errors.length > 0 && (
                                <div className="text-xs text-red-600 space-y-1">
                                    {validation.errors.map((error, index) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                                            {error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha *
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Confirme a nova senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
                    )}
                </div>

                {/* Motivo - só aparece para admin alterando senha de outro */}
                {isAdminChange && !isOwnPassword && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo da Alteração
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Descreva o motivo da alteração de senha"
                            rows={3}
                        />
                    </div>
                )}

                {/* Aviso de Segurança */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                            <p className="font-medium mb-1">Dicas de Segurança:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li>Use pelo menos 8 caracteres</li>
                                <li>Combine letras maiúsculas e minúsculas</li>
                                <li>Inclua números e símbolos</li>
                                <li>Evite informações pessoais</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading || validation.errors.length > 0 || !formData.newPassword}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {loading ? 'Processando...' : 'Alterar Senha'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    )
}
