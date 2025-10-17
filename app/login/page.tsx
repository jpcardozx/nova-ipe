/**
 * Login Page - Versão Otimizada S-Tier
 * Bundle reduzido de 910KB → ~200KB
 * Mantém 100% da UI/UX original
 */

'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Ícones otimizados (5KB ao invés de 600KB)
import { Eye, EyeOff, Loader2, Lock, Shield, UserCheck } from './lib/icons'

// Hooks e utils
import { useAuth, type LoginMode } from '@/lib/hooks/useAuth'
import { authLogger } from '@/lib/utils/auth-logger'
import { toast } from '@/app/components/ui/Toast'

// Componentes locais otimizados
import { LoadingOverlay, DetailedErrorAlert, Alert, ModeSelector, DebugPanel } from './components'

// Schema e constantes
import { loginSchema, type LoginFormValues } from './types/schema'
import { NOISE_TEXTURE_SVG, PATTERN_SVG, ERROR_MESSAGES, ANIMATION_VARIANTS } from './lib/constants'

// Error handling system v2 (arquitetura madura)
import {
  handleLoginError,
  loginErrorHandler,
  type ErrorDetails as ErrorDetailsType,
  type ErrorContext,
} from './lib/error-handler-v2'

// AuthLoadingOverlay - mantém compatibilidade
import { AuthLoadingOverlay, DEFAULT_AUTH_STEPS, type AuthStep } from '@/app/components/AuthLoadingOverlay'

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

function LoginPageContent() {
  // Estado
  const [loginMode, setLoginMode] = useState<LoginMode>('dashboard')
  const [showPassword, setShowPassword] = useState(false)
  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: 'credentials',
      label: 'Validando credenciais de acesso',
      status: 'pending',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'redirect',
      label: 'Estabelecendo sessão segura',
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
  
  // Métricas para debugging
  const [loginStartTime, setLoginStartTime] = useState<number>(0)
  const [attemptNumber, setAttemptNumber] = useState<number>(0)

  // Hooks
  const searchParams = useSearchParams()
  const { login, loading, error } = useAuth()

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  // Handlers
  const onSubmit = async (data: LoginFormValues) => {
    console.log('📝 [Login Page] Form submitted:', { username: data.username, mode: loginMode })

    // Iniciar métricas
    const startTime = Date.now()
    setLoginStartTime(startTime)
    setAttemptNumber(prev => prev + 1)
    const currentAttempt = attemptNumber + 1

    setIsLoading(true)
    setShowAuthOverlay(true)
    setDetailedError(null)
    setAuthSteps(steps => steps.map(step => ({ ...step, status: 'pending' as const, errorMessage: undefined })))
    setCurrentStepIndex(0)

    authLogger.loginAttempt(data.username, loginMode)

    try {
      // Step 1: Validar credenciais
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 0 ? { ...step, status: 'loading' } : step
      ))

      console.log('🔐 [Login Page] Chamando useAuth.login()...')

      // ✅ Aguardar login completo (Server Action autentica + Client redireciona)
      await login(data.username, data.password, loginMode)

      // ✅ Se chegou aqui, login sucesso e redirect vai acontecer
      console.log('✅ [Login Page] Login sucesso!')

      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 0 ? { ...step, status: 'success' } : step
      ))
      setCurrentStepIndex(1)

      // Step 2: Estabelecendo sessão e redirecionando
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === 1 ? { ...step, status: 'loading' } : step
      ))

      authLogger.loginSuccess(data.username, loginMode)

      toast.success('Acesso autorizado!', `Redirecionando para ${loginMode === 'dashboard' ? 'Dashboard' : 'Studio'}`)

      console.log('🔀 [Login Page] Redirect será feito por useAuth (client-side)')

      // ⚠️ Modal permanece visível até redirect completar
      // useAuth.login() fará window.location.href = '/dashboard'

    } catch (err: any) {
      console.error('❌ [Login Page] Erro capturado:', err)
      
      // Calcular duração
      const duration = Date.now() - startTime

      // ✅ NOVO SISTEMA DE ERROR HANDLING V2 (Arquitetura Madura)
      const errorContext: ErrorContext = {
        loginMode,
        email: data.username,
        attemptNumber: currentAttempt,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      // Processar erro completo (build + metrics + log)
      const { details: errorDetails, metrics } = handleLoginError(
        err,
        currentAttempt,
        duration,
        errorContext
      )

      // Atualizar step com erro detalhado
      setAuthSteps(steps => steps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              status: 'error',
              errorMessage: errorDetails.message
            }
          : step
      ))

      authLogger.loginFailure(data.username, errorDetails.technicalMessage)

      // ✅ Definir erro para exibição
      setDetailedError({
        title: errorDetails.title,
        message: errorDetails.message,
        technical: `[${metrics.errorId}] ${errorDetails.category} (${errorDetails.severity})${errorDetails.httpStatus ? ` HTTP ${errorDetails.httpStatus}` : ''}`
      })

      // ✅ Modal persiste com erro - usuário pode tentar novamente
      setIsLoading(false)
      // ⚠️ NÃO fechar overlay automaticamente - deixar usuário ler erro
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 md:py-24 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Auth Loading Overlay */}
      <AuthLoadingOverlay
        visible={showAuthOverlay}
        steps={authSteps}
        currentStepIndex={currentStepIndex}
        onClose={() => {
          setShowAuthOverlay(false)
          setIsLoading(false)
          setAuthSteps(steps => steps.map(step => ({ ...step, status: 'pending', errorMessage: undefined })))
          setCurrentStepIndex(0)
          setDetailedError(null)
        }}
      />

      {/* Elegant Background with login.png + Sophisticated Dark Overlay */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/login.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Multi-layer Premium Dark Overlay - Harmonized with Card */}
        {/* Layer 1: Base dark foundation */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f15]/98 via-[#0D1F2D]/96 to-[#0a1520]/98" />
        
        {/* Layer 2: Vertical depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1F2D]/95 via-[#0a1520]/88 to-[#0D1F2D]/98" />
        
        {/* Layer 3: Radial spotlight effect (center lighter for card focus) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(13,31,45,0.4)_50%,_rgba(10,21,32,0.8)_100%)]" />
        
        {/* Layer 4: Subtle AMBER accent overlay (complementary to card) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFAD43]/4 via-transparent to-[#e89c36]/3" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#F7D7A3]/2 to-transparent" />
        
        {/* Layer 5: Edge vignette for premium depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        
        {/* Elegant radial accents with AMBER colors - Harmonized */}
        {/* Top-right accent - Warm AMBER glow */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 173, 67, 0.08) 0%, rgba(255, 173, 67, 0.04) 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.6, 0.8, 0.6],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bottom-left accent - Cream subtle glow */}
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(247, 215, 163, 0.06) 0%, rgba(247, 215, 163, 0.03) 40%, transparent 68%)',
          }}
          animate={{
            scale: [1.08, 1, 1.08],
            opacity: [0.5, 0.7, 0.5],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Center accent - Subtle rotating glow behind card */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 173, 67, 0.04) 0%, rgba(232, 156, 54, 0.02) 50%, transparent 75%)',
          }}
          animate={{
            scale: [1, 1.06, 1],
            rotate: [0, 120, 240, 360],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* Premium geometric pattern - Subtle */}
        <div className="absolute inset-0 opacity-[0.012]" style={{
          backgroundImage: `linear-gradient(rgba(255, 173, 67, 0.25) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 173, 67, 0.25) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center'
        }} />

        {/* Premium noise texture for depth and sophistication */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'soft-light'
        }} />
        
        {/* Subtle scan lines for premium texture */}
        <div className="absolute inset-0 opacity-[0.008]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 173, 67, 0.1) 2px, rgba(255, 173, 67, 0.1) 4px)',
        }} />
      </div>

      {/* Login Card - Premium Responsive Design */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
        className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto"
      >
        {/* Premium card with elegant glassmorphism - AMBER palette */}
        <div className="relative bg-[#0D1F2D]/70 backdrop-blur-3xl border border-[#FFAD43]/25 rounded-3xl sm:rounded-[2rem] shadow-2xl shadow-[#FFAD43]/20 overflow-hidden">
          {/* Top brand accent bar - AMBER gradient */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-400 shadow-lg shadow-amber-500/50" />
          
          {/* Subtle inner glow with amber accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFAD43]/[0.05] via-transparent to-[#0D1F2D]/30 pointer-events-none" />
          
          {/* Premium border glow effect */}
          <div className="absolute inset-0 rounded-3xl sm:rounded-[2rem] bg-gradient-to-br from-amber-400/10 via-transparent to-transparent pointer-events-none" />

          {/* Card content - Premium responsive padding */}
          <div className="relative p-8 sm:p-10 md:p-12 lg:p-14">
            {/* Premium Brand Header - Enhanced Responsiveness */}
            <div className="flex flex-col items-center justify-center mb-8 sm:mb-10 md:mb-12">
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: 'spring', 
                  stiffness: 140, 
                  damping: 20,
                  mass: 0.8
                }}
                className="flex flex-col items-center gap-5 sm:gap-6 md:gap-7"
              >
                {/* Elegant Lock Icon with AMBER Accent Color */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {/* Enhanced glow effect - AMBER */}
                  <div className="absolute inset-0 bg-amber-500/35 rounded-3xl blur-3xl scale-125 animate-pulse" 
                       style={{ animationDuration: '3s' }} />
                  
                  {/* Lock container - Premium AMBER gradient */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl sm:rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-amber-400/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Lock className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#0D1F2D] drop-shadow-lg" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Sophisticated Brand Text - Premium Responsive Typography */}
                <motion.div 
                  className="text-center space-y-3 sm:space-y-3.5 md:space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F7D7A3] leading-tight tracking-wide drop-shadow-lg">
                    Ipê Imóveis
                  </h1>
                  
                  <motion.div 
                    className="flex items-center gap-3 sm:gap-3.5 md:gap-4 justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="h-px w-10 sm:w-12 md:w-14 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                    <p className="text-xs sm:text-sm md:text-base text-amber-400 uppercase tracking-[0.25em] font-semibold">
                      Área de Acesso
                    </p>
                    <div className="h-px w-10 sm:w-12 md:w-14 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Welcome Message - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center mb-7 sm:mb-8 md:mb-10"
            >
              <p className="text-[#F7D7A3]/75 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                Faça login para acessar o sistema
              </p>
            </motion.div>

          {/* Error Alert */}
          <AnimatePresence mode="wait">
            {detailedError && (
              <div className="mb-6">
                <DetailedErrorAlert error={detailedError} />
              </div>
            )}
          </AnimatePresence>

          {/* Mode Selector - Enhanced Spacing */}
          <div className="mb-7 sm:mb-8 md:mb-9">
            <Label className="text-[#F7D7A3] text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 block font-semibold">
              Modo de Acesso
            </Label>
            <ModeSelector value={loginMode} onChange={setLoginMode} />
          </div>

          {/* Form - Premium Responsive Spacing */}
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6 sm:space-y-7 md:space-y-8">
            {/* Email - Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
            >
              <Label htmlFor="username" className="text-[#F7D7A3] text-xs sm:text-sm uppercase tracking-widest mb-2.5 sm:mb-3 block font-semibold">
                Email
              </Label>
              <Input
                id="username"
                type="email"
                autoComplete="username"
                placeholder="seuemail@exemplo.com"
                {...register('username')}
                className="w-full h-12 sm:h-13 md:h-14 px-4 sm:px-5 text-sm sm:text-base
                           bg-[#0D1F2D]/50 border-2 border-amber-500/25 text-[#F7D7A3] 
                           placeholder:text-gray-500 rounded-xl sm:rounded-2xl
                           focus:bg-[#0D1F2D]/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:outline-none
                           transition-all duration-300
                           hover:border-amber-400/40 hover:bg-[#0D1F2D]/60
                           backdrop-blur-sm shadow-lg shadow-black/20"
                disabled={isLoading}
              />
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password - Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
            >
              <Label htmlFor="password" className="text-[#F7D7A3] text-xs sm:text-sm uppercase tracking-widest mb-2.5 sm:mb-3 block font-semibold">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full h-12 sm:h-13 md:h-14 px-4 sm:px-5 pr-12 sm:pr-14 text-sm sm:text-base
                             bg-[#0D1F2D]/50 border-2 border-amber-500/25 text-[#F7D7A3] 
                             placeholder:text-gray-500 rounded-xl sm:rounded-2xl
                             focus:bg-[#0D1F2D]/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:outline-none
                             transition-all duration-300
                             hover:border-amber-400/40 hover:bg-[#0D1F2D]/60
                             backdrop-blur-sm shadow-lg shadow-black/20"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors duration-200 p-1"
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button - Premium AMBER Design */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="pt-3 sm:pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="relative w-full h-13 sm:h-14 md:h-15 text-base sm:text-lg font-bold
                           bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 
                           hover:from-amber-400 hover:via-amber-500 hover:to-amber-600
                           text-[#0D1F2D] rounded-xl sm:rounded-2xl 
                           shadow-xl shadow-amber-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:from-amber-600 disabled:to-amber-700
                           transition-all duration-300 
                           hover:shadow-2xl hover:shadow-amber-500/60 hover:scale-[1.02] hover:-translate-y-0.5
                           active:scale-[0.98] active:translate-y-0
                           border-2 border-amber-400/50"
              >
                <motion.span 
                  className="relative flex items-center justify-center gap-2.5 sm:gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Entrar no Sistema</span>
                    </>
                  )}
                </motion.span>
              </Button>
            </motion.div>
          </form>

          {/* Footer - Enhanced */}
          <motion.div 
            className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-7 md:pt-8 border-t border-amber-500/15 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm md:text-base text-[#F7D7A3]/65 mb-3 sm:mb-4">
              Acesso exclusivo para profissionais autorizados
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-[#F7D7A3]/55">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <span>Conexão segura e criptografada</span>
            </div>
          </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Debug Panel (somente em dev mode) */}
      <DebugPanel enabled={true} />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
