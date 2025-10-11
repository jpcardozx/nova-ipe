// app/studio/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { EnvironmentManager } from '@/lib/environment-config'
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import '../sanity-react-compat' // Import React compatibility layer

// Prevent Sentry from loading in studio page to avoid conflicts
if (typeof window !== 'undefined') {
    // Disable Sentry for studio page
    (window as any).__SENTRY__ = undefined;
}

// Carrega o NextStudio apenas no client com isolamento de Sentry
const NextStudio = dynamic(
    // @ts-ignore - Sanity studio module doesn't have TypeScript declarations
    () => import('../lib/sanity/studio.js').then((mod: any) => mod.NextStudio),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
                    <p className="text-gray-600">Carregando Sanity Studio...</p>
                </div>
            </div>
        )
    }
)

// Import config dynamically to avoid Sentry conflicts during build
const StudioConfig = dynamic(
    () => import('../../sanity.config').then(mod => ({ default: () => <NextStudio config={mod.default} /> })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
                    <p className="text-gray-600">Carregando configuração do Studio...</p>
                </div>
            </div>
        )
    }
)

type StudioState = 'loading' | 'checking-auth' | 'authenticated' | 'error' | 'config-error'

function StudioPageContent() {
    const [state, setState] = useState<StudioState>('loading')
    const [error, setError] = useState<string | null>(null)
    const [isRetrying, setIsRetrying] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Teste das variáveis de ambiente no lado do cliente
        console.log('🔍 === TESTE DE VARIÁVEIS DE AMBIENTE ===')
        console.log('🔍 window.location.href:', window.location.href)
        console.log('🔍 process.env.NODE_ENV:', process.env.NODE_ENV)
        console.log('🔍 Todas as variáveis NEXT_PUBLIC:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')))
        console.log('🔍 === FIM TESTE ===')

        checkAuthenticationAndConfig()
    }, [])

    const checkAuthenticationAndConfig = async () => {
        try {
            setState('loading')
            setError(null)

            console.log('🔍 Studio: Verificando autenticação...')

            // Check authentication status first
            setState('checking-auth')
            
            // Verificar sessão do Studio via API
            console.log('🔍 Studio: Verificando sessão via API...')
            const sessionResponse = await fetch('/api/studio/session', {
                method: 'GET',
                credentials: 'include'
            })
            
            const sessionData = await sessionResponse.json()
            console.log('🔍 Studio: Status da sessão:', sessionData)

            if (!sessionData.authenticated) {
                console.log('❌ Studio: Usuário não autenticado, redirecionando para login')

                // Check for error from URL params
                const errorParam = searchParams?.get('error')
                if (errorParam) {
                    setError(getErrorMessage(errorParam))
                }

                // Redirect to login with studio mode
                router.push('/login?mode=studio')
                return
            }

            console.log('✅ Studio: Usuário autenticado, carregando studio...')

            // Debug completo das configurações
            EnvironmentManager.debugAllConfigs()

            // Check environment configuration
            const config = EnvironmentManager.getConfig()
            console.log('🔍 Studio: Configuração Sanity:', config.sanity)

            if (!config.sanity.configured) {
                const errorMessage = EnvironmentManager.getConfigErrorMessage('Sanity')
                console.error('❌ Studio: Erro de configuração:', errorMessage)
                setState('config-error')
                setError(`Configuração do Sanity Studio incompleta:\n\n${errorMessage}\n\nVerifique o arquivo .env.local`)
                return
            }

            // Authentication successful
            console.log('✅ Studio: Tudo configurado, carregando interface...')
            setState('authenticated')

        } catch (error) {
            console.error('❌ Studio: Erro na verificação de autenticação:', error)
            setState('error')
            setError('Erro ao verificar autenticação. Tente novamente.')
        }
    }

    const getErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'NO_AUTH_TOKEN':
                return 'Sessão expirada. Faça login novamente.'
            case 'INVALID_TOKEN':
                return 'Token de autenticação inválido. Faça login novamente.'
            case 'CONFIG_ERROR':
                return 'Configuração do Studio não encontrada.'
            case 'VERIFICATION_ERROR':
                return 'Erro na verificação de autenticação.'
            default:
                return 'Erro de autenticação. Faça login novamente.'
        }
    }

    const handleRetry = async () => {
        setIsRetrying(true)
        await checkAuthenticationAndConfig()
        setIsRetrying(false)
    }

    const handleBackToLogin = () => {
        router.push('/login?mode=studio')
    }

    const handleBackToHome = () => {
        router.push('/')
    }

    // Loading state
    if (state === 'loading' || state === 'checking-auth') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {state === 'loading' ? 'Inicializando Studio...' : 'Verificando autenticação...'}
                    </h2>
                    <p className="text-gray-600">
                        {state === 'loading'
                            ? 'Preparando o ambiente do Sanity Studio'
                            : 'Validando suas credenciais de acesso'
                        }
                    </p>
                </div>
            </div>
        )
    }

    // Error states
    if (state === 'error' || state === 'config-error') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-red-900">
                            {state === 'config-error' ? 'Erro de Configuração' : 'Erro de Autenticação'}
                        </CardTitle>
                        <CardDescription className="text-red-700 whitespace-pre-line">
                            {error}
                        </CardDescription>

                        {state === 'config-error' && (
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                                <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Informações de Debug:</h4>
                                <div className="text-sm text-yellow-700 space-y-1">
                                    <p>• Verifique se o arquivo .env.local existe na raiz do projeto</p>
                                    <p>• Variáveis necessárias: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET</p>
                                    <p>• Abra o Console do Browser (F12) para ver logs detalhados</p>
                                    <p>• Reinicie o servidor após alterar variáveis de ambiente</p>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {state === 'error' && (
                            <div className="space-y-2">
                                <Button
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="w-full"
                                >
                                    {isRetrying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Tentando novamente...
                                        </>
                                    ) : (
                                        'Tentar Novamente'
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleBackToLogin}
                                    className="w-full"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Voltar ao Login
                                </Button>
                            </div>
                        )}

                        {state === 'config-error' && (
                            <Button
                                variant="outline"
                                onClick={handleBackToHome}
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar ao Início
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Authenticated - show studio
    if (state === 'authenticated') {
        return (
            <div className="min-h-screen">
                <StudioConfig />
            </div>
        )
    }

    // Fallback
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
                <p className="text-gray-600">Carregando...</p>
            </div>
        </div>
    )
}

export default function StudioPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
                    <p className="text-gray-600">Carregando Studio...</p>
                </div>
            </div>
        }>
            <StudioPageContent />
        </Suspense>
    )
}
