'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PillSelector } from '@/components/ui/pill-selector'
import { ArrowRight, Building2, User, AlertTriangle, Eye, EyeOff, UserPlus, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react'
import { SimpleAuthManager } from '@/lib/auth-simple'
import { EnhancedAuthManager, type LoginMode } from '@/lib/auth/enhanced-auth-manager'

// WordPress Icon Component
const WordPressIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.078.884 0 0 .541.075 1.116.105l1.659 4.553-2.425 7.270-4.095-11.823c.646-.03 1.231-.105 1.231-.105.584-.075.515-.93-.068-.899 0 0-1.755.135-2.88.135-.202 0-.44-.005-.692-.015C2.566 4.753 6.056 2.5 10.21 2.5c3.096 0 5.913 1.18 8.015 3.11-.052-.003-.101-.009-.156-.009-1.064 0-1.818.93-1.818 1.93 0 .898.52 1.659.075 2.588-.434.93-.899 2.128-.899 3.858 0 1.197.46 2.588 1.049 4.523l1.37 4.58c.005-.004.01-.007.016-.011m-8.709-1.695l3.59 9.837c-1.042.299-2.162.462-3.33.462-1.302 0-2.537-.206-3.7-.584l3.44-9.715m7.081-5.573C11.7 1.674 6.73 6.644 6.73 12.814s4.97 11.14 11.14 11.14S29.01 19.184 29.01 13.014 24.04 1.874 17.87 1.874z"/>
  </svg>
)

// Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }),
})

const signupSchema = z.object({
  full_name: z.string().min(2, { message: 'Nome muito curto' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  department: z.string().min(1, { message: 'Selecione um setor' }),
  justification: z.string().min(10, { message: 'Conte-nos mais sobre você' }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

type ViewMode = 'login' | 'signup' | 'success'

const departments = [
  { value: 'vendas', label: '💼 Vendas', desc: 'Vendas de imóveis' },
  { value: 'locacao', label: '🏠 Locação', desc: 'Aluguel de imóveis' },
  { value: 'marketing', label: '📱 Marketing', desc: 'Marketing e divulgação' },
  { value: 'admin', label: '📊 Administrativo', desc: 'Gestão e administração' },
]

function LoginPageContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('login')
  const [loginMode, setLoginMode] = useState<LoginMode>('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [portfolioClicks, setPortfolioClicks] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const authManager = new SimpleAuthManager()

  // Handle URL parameters
  useEffect(() => {
    const mode = searchParams?.get('mode') as LoginMode
    const error = searchParams?.get('error')

    if (mode && (mode === 'dashboard' || mode === 'studio')) {
      setLoginMode(mode)
    }

    if (error) {
      setErrorMessage(getErrorMessageFromCode(error))
    }
  }, [searchParams])

  const getErrorMessageFromCode = (errorCode: string): string => {
    switch (errorCode) {
      case 'AUTH_REQUIRED':
        return 'Autenticação necessária para acessar o Studio.'
      case 'NO_AUTH_TOKEN':
        return 'Sessão expirada. Faça login novamente.'
      case 'INVALID_TOKEN':
        return 'Token de autenticação inválido.'
      case 'CONFIG_ERROR':
        return 'Erro de configuração do sistema.'
      case 'VERIFICATION_ERROR':
        return 'Erro na verificação de autenticação.'
      default:
        return 'Erro de autenticação. Tente novamente.'
    }
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    console.log('🔄 Iniciando login para:', data.email)
    setIsLoading(true)
    setErrorMessage('')

    try {
      console.log('📡 Tentando autenticação no Supabase...')

      // Função de retry para problemas de rede
      const authenticateWithRetry = async (retries = 3): Promise<any> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(`🔄 Tentativa ${attempt}/${retries}...`)

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: data.email,
              password: data.password,
            })

            return { data: authData, error: authError }
          } catch (networkError: any) {
            console.warn(`⚠️ Erro de rede na tentativa ${attempt}:`, networkError.message)

            if (attempt === retries) {
              throw networkError
            }

            // Aguarda antes da próxima tentativa (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          }
        }
      }      // Authenticate with Supabase (with retry)
      const { data: authData, error: authError } = await authenticateWithRetry()

      if (authError) {
        console.error('❌ Erro de login:', authError)
        console.error('❌ Código do erro:', authError.status)
        console.error('❌ Mensagem completa:', authError.message, '=> localmente não dá esse erro, mas na vercel dá, após deploy')

        // Handle different error types
        if (authError.message.includes('Failed to fetch') || authError.message.includes('fetch')) {
          setErrorMessage('🌐 Erro de conexão. Verifique sua internet e tente novamente.')
        } else if (authError.message.includes('Invalid login credentials')) {
          setErrorMessage('❌ Credenciais inválidas. Verifique seu email e senha.')
        } else if (authError.message.includes('Email not confirmed')) {
          setErrorMessage('📧 Email não confirmado. Verifique sua caixa de entrada.')
        } else if (authError.message.includes('Too many requests')) {
          setErrorMessage('⏰ Muitas tentativas. Tente novamente em alguns minutos.')
        } else if (authError.message.includes('signup')) {
          setErrorMessage('🚫 Usuário não encontrado. Use "Solicitar acesso" para se cadastrar.')
        } else {
          setErrorMessage(`❌ Erro: ${authError.message}`)
        }
        return
      }

      if (!authData.user) {
        console.error('❌ Usuário não retornado após autenticação')
        setErrorMessage('❌ Erro na autenticação. Tente novamente.')
        return
      }

      console.log('✅ Autenticação bem-sucedida para:', authData.user.email)

      // Check if user has a profile, create one if needed
      let profile = null

      try {
        console.log('🔍 Verificando profile do usuário...')

        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('⚠️ Erro ao buscar profile:', profileError.message)
        }

        if (existingProfile) {
          console.log('✅ Profile encontrado:', existingProfile.email)
          profile = existingProfile
        } else {
          console.log('🔧 Criando profile para usuário...')

          // Create a basic profile for the user
          const userEmail = authData.user.email || ''
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: authData.user.id,
              email: userEmail,
              full_name: authData.user.user_metadata?.full_name || userEmail.split('@')[0],
              role: 'user',
              is_active: true,
              is_approved: true
            }])
            .select()
            .single()

          if (createError) {
            console.warn('⚠️ Não foi possível criar profile, continuando com dados básicos:', createError.message)
            // Proceed with basic user data
            profile = {
              id: authData.user.id,
              email: userEmail,
              full_name: userEmail.split('@')[0],
              role: 'user'
            }
          } else {
            console.log('✅ Profile criado com sucesso')
            profile = newProfile
          }
        }
      } catch (error) {
        console.warn('⚠️ Erro na verificação de profile, continuando com autenticação básica:', error)
        const userEmail = authData.user.email || ''
        profile = {
          id: authData.user.id,
          email: userEmail,
          full_name: userEmail.split('@')[0],
          role: 'user'
        }
      }

      console.log('✅ Login bem-sucedido para usuário:', profile.email)

      // Log successful login (optional - continue even if this fails)
      try {
        const { error: logError } = await supabase
          .from('login_attempts')
          .insert([{
            email: data.email,
            success: true,
            attempted_at: new Date().toISOString()
          }])

        if (logError) {
          console.warn('⚠️ Não foi possível registrar tentativa de login:', logError.message)
        }
      } catch (logError) {
        console.warn('⚠️ Não foi possível registrar tentativa de login:', logError instanceof Error ? logError.message : String(logError))
      }

      // Redirect based on mode
      console.log('🚀 Redirecionando para:', loginMode === 'studio' ? '/structure' : '/dashboard')

      if (loginMode === 'studio') {
        router.push('/structure')
      } else {
        router.push('/dashboard')
      }

    } catch (error) {
      console.error('❌ Erro crítico no login:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)

      // Tratamento específico para erros de rede
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch') || errorMessage.includes('ERR_NAME_NOT_RESOLVED')) {
        setErrorMessage('🌐 Erro de conexão com o servidor. Verifique sua internet e tente novamente.')
      } else {
        setErrorMessage(`❌ Erro interno: ${errorMessage}`)
      }
    } finally {
      console.log('🏁 Finalizando processo de login')
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      // Check if email already exists in access requests
      const { data: existingRequest } = await supabase
        .from('access_requests')
        .select('id, status')
        .eq('email', data.email)
        .single()

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          setErrorMessage('Já existe uma solicitação pendente para este email.')
        } else if (existingRequest.status === 'approved') {
          setErrorMessage('Este email já foi aprovado. Tente fazer login.')
        } else if (existingRequest.status === 'rejected') {
          setErrorMessage('Sua solicitação anterior foi rejeitada. Entre em contato com o administrador.')
        }
        return
      }

      // Create access request
      const { data: newRequest, error: requestError } = await supabase
        .from('access_requests')
        .insert([{
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          department: data.department,
          justification: data.justification,
          status: 'pending'
        }])
        .select()
        .single()

      if (requestError) {
        console.error('Error creating access request:', requestError)
        setErrorMessage('Erro ao criar solicitação. Tente novamente.')
        return
      }

      // Log activity
      await supabase.rpc('log_activity', {
        p_action: 'access_request_created',
        p_entity_type: 'access_request',
        p_entity_id: newRequest.id,
        p_details: {
          email: data.email,
          department: data.department,
          full_name: data.full_name
        }
      })

      // Success
      setViewMode('success')
      signupForm.reset()
      setSelectedDepartment('')
    } catch (error) {
      console.error('Erro:', error)
      setErrorMessage('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(dept)
    signupForm.setValue('department', dept, { shouldValidate: true })
  }

  // Handle hidden portfolio access - only when form is empty/invalid
  const handlePortfolioAccess = useCallback((e: React.MouseEvent) => {
    e.preventDefault()

    // Only allow portfolio access if login form is not filled/valid
    const isFormEmptyOrInvalid = !loginForm.formState.isValid ||
      (!loginForm.getValues('email') && !loginForm.getValues('password'))

    if (!isFormEmptyOrInvalid) {
      return // Don't allow portfolio access when form is valid/filled
    }

    const newClickCount = portfolioClicks + 1
    setPortfolioClicks(newClickCount)

    if (newClickCount >= 5) {
      router.push('/jpcardozx')
      setPortfolioClicks(0)
    } else {
      // Reset click count after 3 seconds of inactivity
      setTimeout(() => {
        setPortfolioClicks(0)
      }, 3000)
    }
  }, [portfolioClicks, router, loginForm])

  const switchToSignup = () => {
    setErrorMessage('')
    setViewMode('signup')
  }

  const switchToLogin = () => {
    setErrorMessage('')
    setViewMode('login')
  }

  const watchedSignupFields = signupForm.watch()

  return (
    <div className="relative min-h-screen w-full font-lexend">
      {/* Background com overlay - sempre presente */}
      <Image
        src="/images/login.png"
        alt="Ipê Imóveis"
        fill
        style={{ objectFit: 'cover' }}
        className="z-0"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 bg-gradient-to-t from-black via-transparent to-black" />

      {/* Container principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 lg:p-12">
        <AnimatePresence mode="wait">
          {/* LOGIN VIEW */}
          {viewMode === 'login' && (
            <motion.div
              key="login"
              layoutId="auth-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-md space-y-6 sm:space-y-8 rounded-2xl bg-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl border border-white/30"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2
                  onClick={handlePortfolioAccess}
                  className={`mt-6 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-center text-3xl sm:text-4xl font-bold tracking-tight text-transparent font-serif transition-all duration-200 select-none ${
                    // Only show as clickable when form is empty/invalid
                    (!loginForm.formState.isValid || (!loginForm.watch('email') && !loginForm.watch('password')))
                      ? `cursor-pointer ${portfolioClicks > 0 ? 'brightness-125 scale-105' : 'hover:brightness-110'}`
                      : 'cursor-default'
                    }`}
                  title={
                    (!loginForm.formState.isValid || (!loginForm.watch('email') && !loginForm.watch('password'))) && portfolioClicks > 0
                      ? `${portfolioClicks}/5`
                      : undefined
                  }
                >
                  Acesse sua Conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-300">
                  Bem-vindo de volta à Ipê Imóveis.
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <PillSelector
                  options={[
                    { label: 'Dashboard', value: 'dashboard' },
                    { label: 'Estúdio', value: 'studio' },
                  ]}
                  value={loginMode}
                  onChange={(value) => setLoginMode(value as LoginMode)}
                />
              </motion.div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <motion.div
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div>
                    <Label htmlFor="email" className="text-gray-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...loginForm.register('email')}
                      className={`mt-1 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-amber-400 focus:ring-amber-400 ${loginForm.formState.errors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-200">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        {...loginForm.register('password')}
                        className={`mt-1 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-amber-400 focus:ring-amber-400 pr-10 ${loginForm.formState.errors.password ? 'border-red-500' : ''
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors mt-0.5"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                </motion.div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-300 text-sm">{errorMessage}</span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !loginForm.formState.isValid}
                    className={`group relative mx-auto flex w-full sm:w-3/4 justify-center shadow-lg transform transition-all duration-300 ${isLoading
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 cursor-wait'
                      : !loginForm.formState.isValid
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/40'
                      }`}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : loginMode === 'dashboard' ? (
                        <User className="h-5 w-5 text-amber-300 transition-all group-hover:text-white" />
                      ) : (
                        <Building2 className="h-5 w-5 text-amber-300 transition-all group-hover:text-white" />
                      )}
                    </span>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span>Autenticando</span>
                        <span className="animate-pulse">...</span>
                      </span>
                    ) : (
                      loginMode === 'dashboard' ? 'Entrar no Dashboard' : 'Acessar Studio'
                    )}
                    {!isLoading && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ArrowRight className="h-5 w-5 text-amber-300 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* WordPress Access Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <motion.a
                  href="https://imobiliariaipe.com.br/wp-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative mx-auto flex w-full sm:w-3/4 justify-center items-center gap-2 sm:gap-3 py-3 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-amber-500/20 hover:shadow-xl"
                >
                  {/* WordPress Icon */}
                  <WordPressIcon className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors" />

                  {/* Button Content */}
                  <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-base font-medium">Site WordPress</span>
                    <span className="text-xs text-gray-300 group-hover:text-gray-200 hidden sm:block">Sistema Legado</span>
                  </div>

                  {/* External Link Icon */}
                  <ExternalLink className="h-4 w-4 text-amber-400 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              </motion.div>

              {/* Solicitar Acesso Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-center"
              >
                <button
                  onClick={switchToSignup}
                  className="text-amber-300 hover:text-amber-200 text-sm underline transition-colors duration-200"
                >
                  Não tem acesso? Solicitar aqui
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* SIGNUP VIEW */}
          {viewMode === 'signup' && (
            <motion.div
              key="signup"
              layoutId="auth-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-2xl space-y-8 rounded-2xl bg-white/20 p-8 shadow-2xl backdrop-blur-2xl border border-white/30"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h2 className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-4xl font-bold text-transparent font-serif mb-2">
                  Junte-se à Equipe
                </h2>
                <p className="text-gray-300">
                  Preencha seus dados para solicitar acesso
                </p>
              </motion.div>

              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div>
                    <Label htmlFor="full_name" className="text-gray-200">Nome completo</Label>
                    <Input
                      id="full_name"
                      {...signupForm.register('full_name')}
                      placeholder="João Silva"
                      className={`mt-1 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-amber-400 transition-all duration-200 ${signupForm.formState.errors.full_name
                        ? 'border-red-500'
                        : watchedSignupFields.full_name
                          ? 'border-green-400'
                          : 'border-white/20'
                        }`}
                    />
                    {signupForm.formState.errors.full_name && (
                      <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...signupForm.register('email')}
                      placeholder="joao@email.com"
                      className={`mt-1 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-amber-400 transition-all duration-200 ${signupForm.formState.errors.email
                        ? 'border-red-500'
                        : watchedSignupFields.email
                          ? 'border-green-400'
                          : 'border-white/20'
                        }`}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone" className="text-gray-200">WhatsApp</Label>
                  <Input
                    id="phone"
                    {...signupForm.register('phone')}
                    placeholder="(11) 99999-9999"
                    className={`mt-1 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-amber-400 transition-all duration-200 ${signupForm.formState.errors.phone
                      ? 'border-red-500'
                      : watchedSignupFields.phone
                        ? 'border-green-400'
                        : 'border-white/20'
                      }`}
                  />
                  {signupForm.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.phone.message}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="text-gray-200">Em qual setor você vai trabalhar?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {departments.map((dept, index) => (
                      <motion.button
                        key={dept.value}
                        type="button"
                        onClick={() => handleDepartmentSelect(dept.value)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedDepartment === dept.value
                          ? 'border-amber-400 bg-amber-500/20 shadow-lg'
                          : 'border-white/20 hover:border-amber-300 hover:bg-white/10'
                          }`}
                      >
                        <div className="font-medium text-white">{dept.label}</div>
                        <div className="text-xs text-gray-300 mt-1">{dept.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                  {signupForm.formState.errors.department && (
                    <p className="text-red-400 text-sm">{signupForm.formState.errors.department.message}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="justification" className="text-gray-200">Conte um pouco sobre você</Label>
                  <textarea
                    id="justification"
                    {...signupForm.register('justification')}
                    placeholder="Ex: Sou corretor há 3 anos, especializado em imóveis residenciais..."
                    rows={3}
                    className={`mt-1 w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border-2 focus:outline-none transition-all duration-200 resize-none ${signupForm.formState.errors.justification
                      ? 'border-red-500'
                      : watchedSignupFields.justification
                        ? 'border-green-400'
                        : 'border-white/20 focus:border-amber-400'
                      }`}
                  />
                  {signupForm.formState.errors.justification && (
                    <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.justification.message}</p>
                  )}
                </motion.div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-300 text-sm">{errorMessage}</span>
                  </motion.div>
                )}

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    type="button"
                    onClick={switchToLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 rounded-xl border-2 border-white/20 text-white hover:border-amber-300 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !signupForm.formState.isValid}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className={`flex-1 h-12 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isLoading || !signupForm.formState.isValid
                      ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Solicitar Acesso
                        <Sparkles className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* SUCCESS VIEW */}
          {viewMode === 'success' && (
            <motion.div
              key="success"
              layoutId="auth-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-md space-y-8 rounded-2xl bg-white/20 p-8 shadow-2xl backdrop-blur-2xl border border-white/30 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="h-4 w-4 text-yellow-800" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent font-serif mb-3">
                  Tudo Certo!
                </h2>
                <p className="text-gray-300 text-lg">
                  Sua solicitação foi enviada com sucesso
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 text-left border border-emerald-400/30"
              >
                <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  O que acontece agora?
                </h3>
                <div className="space-y-2 text-sm text-emerald-200">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-emerald-400">1.</span>
                    <span>Nossa equipe analisa sua solicitação</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-emerald-400">2.</span>
                    <span>Você recebe um email em até 24h</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-emerald-400">3.</span>
                    <span>Se aprovado, suas credenciais chegam por WhatsApp</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.button
                onClick={switchToLogin}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando página de login...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}