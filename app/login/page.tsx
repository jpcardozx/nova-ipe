/**
 * Login Page - Modern & Secure
 * UI/UX S-Tier com autenticação server-side
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Building2, 
  LayoutDashboard,
  Lock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { useAuth, type LoginMode } from '@/lib/hooks/useAuth'
import { authLogger } from '@/lib/utils/auth-logger'
import { AuthLoadingOverlay, DEFAULT_AUTH_STEPS, type AuthStep } from '@/app/components/AuthLoadingOverlay'
import { Shield, Database, UserCheck } from 'lucide-react'
import { useToast } from '@/app/components/ui/Toast'

// ============================================================================
// CONSTANTES & ASSETS
// ============================================================================

// SVG patterns extraídos para evitar re-parsing (otimização de bundle)
const NOISE_TEXTURE_SVG = "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"

const PATTERN_SVG = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

const loginSchema = z.object({
  username: z.string()
    .min(1, 'Digite seu usuário')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ============================================================================
// COMPONENTES
// ============================================================================

/**
 * Componente de Loading com Steps Visual
 */
function LoadingOverlay({ 
  message, 
  currentStep = 0 
}: { 
  message?: string
  currentStep?: number 
}) {
  const steps = [
    { label: 'Verificando', icon: '🔐' },
    { label: 'Autenticando', icon: '✓' },
    { label: 'Estabelecendo Sessão', icon: '🔒' },
    { label: 'Carregando', icon: '🚀' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/[0.09] backdrop-blur-2xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-3 border-white/10"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-3 border-amber-400 border-t-transparent border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </motion.div>
          </div>
          
          <div className="text-center space-y-3 w-full">
            <p className="text-base sm:text-lg font-semibold text-white">
              {message || 'Autenticando...'}
            </p>
            
            {/* Steps Progress */}
            <div className="space-y-2 pt-2">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${isCurrent ? 'bg-amber-500/20 border border-amber-400/30' : ''}
                      ${isCompleted ? 'opacity-70' : ''}
                      ${isPending ? 'opacity-30' : ''}
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                      transition-all duration-300
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-amber-500 text-white animate-pulse' : ''}
                      ${isPending ? 'bg-white/10 text-white/40' : ''}
                    `}>
                      {isCompleted ? '✓' : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (index + 1)}
                    </div>
                    
                    <span className={`
                      text-xs sm:text-sm font-medium
                      ${isCurrent || isCompleted ? 'text-white' : 'text-white/40'}
                    `}>
                      {step.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
            
            <p className="text-xs text-white/60 mt-3">
              Aguarde enquanto processamos sua solicitação
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Componente de Alert Detalhado para Erros
 */
function DetailedErrorAlert({ 
  error 
}: { 
  error: {
    title: string
    message: string
    technical?: string
  }
}) {
  const [showTechnical, setShowTechnical] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className="bg-red-500/15 border-2 border-red-400/40 backdrop-blur-xl rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-300" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-sm font-bold text-red-200">
              {error.title}
            </h3>
            <p className="text-sm text-red-100/90 mt-1">
              {error.message}
            </p>
          </div>
          
          {error.technical && (
            <div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-xs text-red-300/70 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                {showTechnical ? '▼' : '▶'} Detalhes técnicos
              </button>
              
              <AnimatePresence>
                {showTechnical && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-2 bg-black/30 rounded border border-red-400/20"
                  >
                    <code className="text-xs text-red-200/80 font-mono break-all">
                      {error.technical}
                    </code>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Componente de Alert Simples
 */
function Alert({ 
  type, 
  message 
}: { 
  type: 'error' | 'success' | 'info'
  message: string 
}) {
  const config = {
    error: {
      bg: 'bg-red-500/15 border-red-400/40 backdrop-blur-xl',
      text: 'text-red-200',
      icon: <AlertCircle className="w-4 h-4 text-red-300" />
    },
    success: {
      bg: 'bg-green-500/15 border-green-400/40 backdrop-blur-xl',
      text: 'text-green-200',
      icon: <CheckCircle2 className="w-4 h-4 text-green-300" />
    },
    info: {
      bg: 'bg-blue-500/15 border-blue-400/40 backdrop-blur-xl',
      text: 'text-blue-200',
      icon: <AlertCircle className="w-4 h-4 text-blue-300" />
    }
  }[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${config.bg} border rounded-xl p-3 flex items-center gap-2.5 shadow-lg`}
    >
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <p className={`${config.text} text-xs sm:text-sm font-medium flex-1`}>
        {message}
      </p>
    </motion.div>
  )
}

/**
 * Seletor de Modo (Dashboard/Studio)
 */
function ModeSelector({ 
  value, 
  onChange 
}: { 
  value: LoginMode
  onChange: (mode: LoginMode) => void 
}) {
  const modes = [
    {
      value: 'dashboard' as const,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: 'Gestão completa'
    },
    {
      value: 'studio' as const,
      label: 'Studio',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Editor de conteúdo'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {modes.map((mode) => (
        <motion.button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            relative p-3 rounded-xl border-2 transition-all duration-200
            ${value === mode.value 
              ? 'border-amber-400/70 bg-gradient-to-br from-amber-500/25 to-orange-500/15 shadow-lg shadow-amber-500/30 backdrop-blur-xl' 
              : 'border-white/20 bg-white/[0.06] hover:border-white/35 hover:bg-white/[0.10] backdrop-blur-xl'
            }
          `}
        >
          <div className="flex items-center gap-2.5 text-center">
            <div className={`
              p-2 rounded-lg transition-all duration-200 flex-shrink-0
              ${value === mode.value 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg' 
                : 'bg-white/10 text-white/50'
              }
            `}>
              {mode.icon}
            </div>
            <div className="flex-1 text-left">
              <p className={`
                font-semibold text-sm
                ${value === mode.value ? 'text-white' : 'text-white/70'}
              `}>
                {mode.label}
              </p>
              <p className={`text-xs mt-0.5 ${
                value === mode.value ? 'text-white/80' : 'text-white/40'
              }`}>
                {mode.description}
              </p>
            </div>
          </div>
          
          {value === mode.value && (
            <motion.div
              layoutId="mode-indicator"
              className="absolute inset-0 rounded-xl border-2 border-amber-400/70"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

function LoginPageContent() {
  const [loginMode, setLoginMode] = useState<LoginMode>('dashboard')
  const [showPassword, setShowPassword] = useState(false)
  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: 'credentials',
      label: 'Autenticando credenciais',
      status: 'pending',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'redirect',
      label: 'Redirecionando para sua área',
      status: 'pending',
      icon: <UserCheck className="w-5 h-5" />,
    },
  ])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showAuthOverlay, setShowAuthOverlay] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [detailedError, setDetailedError] = useState<{
    title: string
    message: string
    technical?: string
  } | null>(null)
  const searchParams = useSearchParams()
  const { login, loading, error } = useAuth()

  // Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  // Handle URL parameters
  useEffect(() => {
    const mode = searchParams?.get('mode') as LoginMode
    const error = searchParams?.get('error')

    if (mode && (mode === 'dashboard' || mode === 'studio')) {
      setLoginMode(mode)
    }

    if (error) {
      authLogger.error('Login', 'URL Error', { error })
    }
  }, [searchParams])

  // Handle form submission (com feedback real em tempo real)
  const onSubmit = async (data: LoginFormValues) => {
    const startTime = performance.now()
    setDetailedError(null)
    setShowAuthOverlay(true)
    setIsLoading(true)
    setCurrentStepIndex(0)

    authLogger.loginAttempt(data.username, loginMode)

    try {
      // ============================================================
      // STEP 1: Autenticando credenciais
      // ============================================================
      console.log('🔐 [Login UI] Step 1: Autenticando credenciais...')
      const step1Start = performance.now()
      
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 0 ? { ...step, status: 'loading' } : step
      ))

      // Chamar Server Action (pode demorar - Supabase auth + redirect SSR)
      const loginPromise = login(data.username, data.password, loginMode)

      // Aguardar pelo menos 400ms para feedback visual
      await Promise.race([
        loginPromise,
        new Promise(resolve => setTimeout(resolve, 400))
      ])

      const step1Duration = performance.now() - step1Start
      console.log(`✅ [Login UI] Step 1: Credenciais verificadas (${step1Duration.toFixed(0)}ms)`)
      
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 0 ? { ...step, status: 'success' } : step
      ))
      setCurrentStepIndex(1)

      // ============================================================
      // STEP 2: Redirecionando (aguardando redirect SSR)
      // ============================================================
      console.log('🔐 [Login UI] Step 2: Iniciando redirecionamento...')
      const step2Start = performance.now()
      
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 1 ? { ...step, status: 'loading' } : step
      ))

      // Aguardar loginPromise terminar (redirect SSR deve acontecer)
      await loginPromise

      const step2Duration = performance.now() - step2Start
      const totalDuration = performance.now() - startTime
      
      // Se chegou aqui sem redirect, algo deu errado (anômalo)
      console.warn(`⚠️ [Login UI] Redirect SSR não aconteceu! Step 2: ${step2Duration.toFixed(0)}ms | Total: ${totalDuration.toFixed(0)}ms`)
      
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 1 ? { ...step, status: 'success' } : step
      ))

      // Redirect deve acontecer automaticamente via Server Action
      // Se não aconteceu, algo deu errado

    } catch (err) {
      console.error('❌ [Login UI] Erro no login:', err)
      authLogger.error('Login', 'Exception', { error: err })

      // Extrair mensagem de erro
      const urlParams = new URLSearchParams(window.location.search)
      const errorFromUrl = urlParams.get('error')
      const errorMessage = errorFromUrl || (err instanceof Error ? err.message : 'Erro desconhecido')

      // Marcar step atual como erro
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              status: 'error',
              errorMessage: errorMessage.includes('Invalid login credentials')
                ? 'Email ou senha incorretos'
                : errorMessage.includes('quota') || errorMessage.includes('rate limit')
                ? 'Muitas tentativas. Aguarde alguns minutos'
                : errorMessage
            }
          : step
      ))

      authLogger.loginFailure(data.username, errorMessage)

      // Parse error para UX melhor
      if (errorMessage.includes('Invalid login credentials')) {
        setDetailedError({
          title: 'Credenciais Inválidas',
          message: 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
          technical: 'AUTH_INVALID_CREDENTIALS'
        })
      } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        setDetailedError({
          title: 'Limite Temporário Atingido',
          message: 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.',
          technical: 'RATE_LIMIT_EXCEEDED'
        })
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setDetailedError({
          title: 'Erro de Conexão',
          message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          technical: 'NETWORK_ERROR'
        })
      } else {
        setDetailedError({
          title: 'Erro na Autenticação',
          message: errorMessage,
          technical: `AUTH_ERROR: ${errorMessage}`
        })
      }

      setIsLoading(false)
      setCurrentStepIndex(0)
    }
  }

  return (
    <div 
      className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/images/login.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* New Auth Loading Overlay com Step Progression */}
      <AuthLoadingOverlay
        visible={showAuthOverlay}
        steps={authSteps}
        currentStepIndex={currentStepIndex}
        onClose={() => {
          setShowAuthOverlay(false)
          setIsLoading(false)
          // Reset steps to pending
          setAuthSteps(steps => steps.map(step => ({ ...step, status: 'pending', errorMessage: undefined })))
          setCurrentStepIndex(0)
          setDetailedError(null)
        }}
      />

      {/* Multi-layer overlay sutil para profundidade */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-blue-950/50 to-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      
      {/* Animated gradient accent - muito sutil */}
      <motion.div
        className="absolute inset-0 opacity-8"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle noise texture para profundidade */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE_SVG}")`,
        }}
      />
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md lg:max-w-4xl z-10 mt-8 sm:mt-12"
      >
        {/* Glow effect sutil atrás do card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-amber-500/10 rounded-[2rem] blur-3xl" />
        
        <div className="relative bg-white/[0.09] backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/[0.18] overflow-hidden">
          {/* Header com brand - compacto e elegante */}
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
            {/* Subtle pattern overlay no header */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("${PATTERN_SVG}")`,
              }}
            />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.4, duration: 0.8 }}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl flex-shrink-0"
                >
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
                </motion.div>
                
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg leading-tight">
                    Portal de Acesso
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">
                    Sistema Ipê Imobiliária
                  </p>
                </div>
              </div>
              
              {/* Security badge compacto */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3" />
                <span className="hidden lg:inline">Criptografado</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
            {/* Detailed Error Alert */}
            <AnimatePresence mode="wait">
              {detailedError && (
                <DetailedErrorAlert error={detailedError} />
              )}
              {error && !detailedError && (
                <Alert type="error" message={error} />
              )}
            </AnimatePresence>

            {/* Mode Selector */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white/90 block">
                Modo de Acesso
              </Label>
              <ModeSelector value={loginMode} onChange={setLoginMode} />
            </div>

            {/* Credentials Grid - layout otimizado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Email Input */}
              <div className="space-y-2.5 lg:col-span-2">
                <Label htmlFor="username" className="text-sm font-semibold text-white/90 block">
                  Email Corporativo
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="email"
                    placeholder="seu.email@imobiliariaipe.com.br"
                    className={`
                      h-12 sm:h-13 lg:h-14 px-4 lg:px-5 text-sm sm:text-base
                      bg-white/[0.12] backdrop-blur-xl
                      border-2 rounded-xl
                      text-white placeholder:text-white/40
                      font-medium
                      transition-all duration-300
                      shadow-lg shadow-black/10
                      ${errors.username 
                        ? 'border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-400/20' 
                        : 'border-white/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 hover:border-white/40'
                      }
                    `}
                    {...register('username')}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-300 font-medium flex items-center gap-1.5 bg-red-500/10 px-3 py-2 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            {/* Password Input */}
            <div className="space-y-2.5 lg:col-span-2">
              <Label htmlFor="password" className="text-sm font-semibold text-white/90 block">
                Senha de Acesso
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  className={`
                    h-12 sm:h-13 lg:h-14 pl-4 lg:pl-5 pr-14 text-sm sm:text-base
                    bg-white/[0.12] backdrop-blur-xl
                    border-2 rounded-xl
                    text-white placeholder:text-white/40
                    font-medium
                    transition-all duration-300
                    shadow-lg shadow-black/10
                    ${errors.password 
                      ? 'border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-400/20' 
                      : 'border-white/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 hover:border-white/40'
                    }
                  `}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/10"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-300 font-medium flex items-center gap-1.5 bg-red-500/10 px-3 py-2 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full h-12 sm:h-13 lg:h-14 text-base sm:text-lg
                  bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 
                  hover:from-amber-600 hover:via-orange-600 hover:to-orange-700
                  text-white font-bold rounded-xl
                  shadow-[0_10px_40px_-10px_rgba(251,191,36,0.4)]
                  hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.6)]
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  border-2 border-white/20
                  transform hover:scale-[1.01] active:scale-[0.99]
                "
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">Autenticando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2.5">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Acessar Plataforma</span>
                  </span>
                )}
              </Button>
            </div>

            {/* Security Badge - apenas mobile */}
            <div className="pt-5 border-t border-white/10 sm:hidden">
              <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                <Lock className="w-3.5 h-3.5" />
                <span>Conexão protegida por criptografia de ponta a ponta</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-white/50"
        >
          <p>
            © {new Date().getFullYear()} Imobiliária IPE - Todos os direitos reservados
          </p>
          <p className="mt-2">
            Problemas com acesso? Entre em contato com o setor responsável.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ============================================================================
// EXPORT COM SUSPENSE
// ============================================================================

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
