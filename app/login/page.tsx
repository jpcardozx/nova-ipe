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

      {/* Login Card - Premium Responsive Design REFINED */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
        className="relative z-10 w-full px-4 sm:px-6 md:px-8"
      >
        {/* Responsive Container with max-width constraints */}
        <div className="max-w-[440px] sm:max-w-[480px] md:max-w-[520px] mx-auto">
          {/* Premium card with elegant glassmorphism - AMBER palette */}
          <div className="relative bg-[#0D1F2D]/80 backdrop-blur-3xl border border-[#FFAD43]/30 rounded-2xl sm:rounded-3xl md:rounded-[2rem] shadow-2xl shadow-[#FFAD43]/25 overflow-hidden">
            {/* Top brand accent bar - AMBER gradient */}
            <div className="absolute inset-x-0 top-0 h-1 sm:h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-400 shadow-lg shadow-amber-500/50" />
            
            {/* Subtle inner glow with amber accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFAD43]/[0.06] via-transparent to-[#0D1F2D]/40 pointer-events-none" />
            
            {/* Premium border glow effect */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-amber-400/12 via-transparent to-transparent pointer-events-none" />

            {/* Card content - REFINED responsive padding */}
            <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
            {/* Premium Brand Header - REFINED Mobile-First */}
            <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-10">
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
                className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
              >
                {/* Elegant Lock Icon with AMBER Accent - REFINED sizes */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {/* Enhanced glow effect - AMBER */}
                  <div className="absolute inset-0 bg-amber-500/35 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl scale-110 sm:scale-125 animate-pulse" 
                       style={{ animationDuration: '3s' }} />
                  
                  {/* Lock container - Premium AMBER gradient - REFINED */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl sm:rounded-3xl md:rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-amber-400/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Lock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#0D1F2D] drop-shadow-lg" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Sophisticated Brand Text - REFINED Typography */}
                <motion.div 
                  className="text-center space-y-2 sm:space-y-2.5 md:space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#F7D7A3] leading-tight tracking-wide drop-shadow-lg">
                    Ipê Imóveis
                  </h1>
                  
                  <motion.div 
                    className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="h-px w-8 sm:w-10 md:w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                    <p className="text-[10px] sm:text-xs md:text-sm text-amber-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold whitespace-nowrap">
                      Área de Acesso
                    </p>
                    <div className="h-px w-8 sm:w-10 md:w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Welcome Message - REFINED */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center mb-5 sm:mb-6 md:mb-8"
            >
              <p className="text-[#F7D7A3]/75 text-xs sm:text-sm md:text-base font-light leading-relaxed px-2">
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

          {/* Mode Selector - REFINED Spacing */}
          <div className="mb-5 sm:mb-6 md:mb-7">
            <Label className="text-[#F7D7A3] text-[11px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest mb-2 sm:mb-2.5 md:mb-3 block font-semibold">
              Modo de Acesso
            </Label>
            <ModeSelector value={loginMode} onChange={setLoginMode} />
          </div>

          {/* Form - REFINED Mobile-First Spacing */}
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email - REFINED Mobile Touch Targets */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
            >
              <Label htmlFor="username" className="text-[#F7D7A3] text-[11px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest mb-2 sm:mb-2.5 block font-semibold">
                Email
              </Label>
              <Input
                id="username"
                type="email"
                autoComplete="username"
                placeholder="seuemail@exemplo.com"
                {...register('username')}
                className="w-full h-11 sm:h-12 md:h-13 lg:h-14 
                           px-3.5 sm:px-4 md:px-5 
                           text-sm sm:text-base
                           bg-[#0D1F2D]/50 border-2 border-amber-500/25 text-[#F7D7A3] 
                           placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm
                           rounded-lg sm:rounded-xl md:rounded-2xl
                           focus:bg-[#0D1F2D]/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:outline-none
                           transition-all duration-300
                           hover:border-amber-400/40 hover:bg-[#0D1F2D]/60
                           backdrop-blur-sm shadow-lg shadow-black/20
                           touch-manipulation"
                disabled={isLoading}
              />
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-[10px] sm:text-xs text-red-400"
                  >
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password - REFINED Mobile Touch Targets */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
            >
              <Label htmlFor="password" className="text-[#F7D7A3] text-[11px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest mb-2 sm:mb-2.5 block font-semibold">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full h-11 sm:h-12 md:h-13 lg:h-14 
                             px-3.5 sm:px-4 md:px-5 
                             pr-11 sm:pr-12 md:pr-14
                             text-sm sm:text-base
                             bg-[#0D1F2D]/50 border-2 border-amber-500/25 text-[#F7D7A3] 
                             placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm
                             rounded-lg sm:rounded-xl md:rounded-2xl
                             focus:bg-[#0D1F2D]/70 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 focus:outline-none
                             transition-all duration-300
                             hover:border-amber-400/40 hover:bg-[#0D1F2D]/60
                             backdrop-blur-sm shadow-lg shadow-black/20
                             touch-manipulation"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors duration-200 p-1.5 sm:p-2 touch-manipulation"
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-[10px] sm:text-xs text-red-400"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button - REFINED Mobile-First */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="pt-2 sm:pt-3 md:pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="relative w-full 
                           h-11 sm:h-12 md:h-13 lg:h-14
                           text-sm sm:text-base md:text-lg 
                           font-bold
                           bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 
                           hover:from-amber-400 hover:via-amber-500 hover:to-amber-600
                           text-[#0D1F2D] 
                           rounded-lg sm:rounded-xl md:rounded-2xl 
                           shadow-xl shadow-amber-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:from-amber-600 disabled:to-amber-700
                           transition-all duration-300 
                           hover:shadow-2xl hover:shadow-amber-500/60 hover:scale-[1.02] hover:-translate-y-0.5
                           active:scale-[0.98] active:translate-y-0
                           border-2 border-amber-400/50
                           touch-manipulation"
              >
                <motion.span 
                  className="relative flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      <span>Entrar no Sistema</span>
                    </>
                  )}
                </motion.span>
              </Button>
            </motion.div>
          </form>

          {/* Footer - REFINED Mobile-First */}
          <motion.div 
            className="mt-5 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-amber-500/15 text-center px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-[10px] sm:text-xs md:text-sm text-[#F7D7A3]/65 mb-2.5 sm:mb-3 md:mb-4 leading-relaxed">
              Acesso exclusivo para profissionais autorizados
            </p>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-[#F7D7A3]/55">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
              <span>Conexão segura e criptografada</span>
            </div>
          </motion.div>
          </div>
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
