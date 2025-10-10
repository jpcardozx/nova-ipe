'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PillSelector } from '@/components/ui/pill-selector'
import { ArrowRight, Building2, User, AlertTriangle, Eye, EyeOff, UserPlus, ArrowLeft, Sparkles, ExternalLink, Stethoscope, HelpCircle } from 'lucide-react'
import { LegacyPortalAccess } from '@/components/ui/legacy-portal-access'
import { SimpleAuthManager } from '@/lib/auth-simple'
import { EnhancedAuthManager, type LoginMode } from '@/lib/auth/enhanced-auth-manager'
import { zohoMail360 } from '@/lib/zoho-mail360'
import { usePortalDiagnostic } from '@/lib/services/portal-diagnostic'



// Schemas
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Digite seu usuário.' }),
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
  const [selectedDomain, setSelectedDomain] = useState('@imobiliariaipe.com.br')
  const router = useRouter()
  const searchParams = useSearchParams()
  const authManager = new SimpleAuthManager()
  const { isRunning: isDiagnosticRunning, result: diagnosticResult, runDiagnostic } = usePortalDiagnostic()

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
    const fullEmail = `${data.username}${selectedDomain}`
    setIsLoading(true)
    setErrorMessage('')

    try {
      console.log('🔄 === INÍCIO DO PROCESSO DE LOGIN ===')
      console.log('🔄 Modo de login:', loginMode)
      console.log('📧 Email completo:', fullEmail)
      console.log('🔒 Senha fornecida:', data.password ? `${data.password.length} caracteres` : 'não fornecida')
      console.log('🌐 URL atual:', window.location.href)
      
      const zohoUser = await zohoMail360.verifyUser(fullEmail, data.password)
      
      if (zohoUser) {
        console.log('✅ Usuário Zoho autenticado:', zohoUser.emailAddress)
        
        // Salvar dados do usuário para ambos os modos
        const userData = {
          email: zohoUser.emailAddress,
          name: zohoUser.displayName,
          organization: zohoUser.organizationName,
          provider: 'zoho_mail360' as const,
          mode: loginMode,
          timestamp: new Date().toISOString()
        }
        
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        // Sincronizar com perfil estendido (async, não bloquear login)
        import('@/lib/services/user-profile-service').then(({ UserProfileService }) => {
          UserProfileService.syncUser(userData).catch(error => {
            console.warn('⚠️ Sincronização Supabase falhou, mas login continua:', error)
          })
        })
        
        // Para Studio, também criar um cookie de sessão simples
        if (loginMode === 'studio') {
          try {
            console.log('🎬 Criando sessão do Studio...')
            const sessionResponse = await fetch('/api/studio/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: userData })
            })
            
            const sessionResult = await sessionResponse.json()
            console.log('🎬 Resultado da criação de sessão:', sessionResult)
            
            if (!sessionResponse.ok) {
              throw new Error(`Erro ao criar sessão: ${sessionResult.error}`)
            }
            
            console.log('🎬 Sessão criada com sucesso, redirecionando para Studio...')
            router.push('/studio')
          } catch (error) {
            console.error('❌ Erro ao criar sessão do Studio:', error)
            setErrorMessage('Erro ao criar sessão do Studio. Tente novamente.')
            return
          }
        } else {
          console.log('📊 Redirecionando para Dashboard...')
          router.push('/dashboard')
        }
        
        return
      } else {
        setErrorMessage('❌ Usuário ou senha inválidos no sistema Zoho.')
        return
      }

    } catch (error) {
      console.error('❌ Erro no processo de login:', error)
      setErrorMessage('❌ Erro na autenticação. Verifique suas credenciais.')
    } finally {
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
            (!loginForm.getValues('username') && !loginForm.getValues('password'))

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
    <div 
      className="relative min-h-screen w-full font-lexend bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      style={{
        backgroundImage: "url('/images/login.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro */}
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
              className="w-full max-w-md space-y-6 sm:space-y-8 rounded-3xl bg-gradient-to-br from-white/25 via-white/20 to-white/15 p-8 sm:p-10 shadow-2xl backdrop-blur-3xl border border-white/20 ring-1 ring-white/10"
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
                    (!loginForm.formState.isValid || (!loginForm.watch('username') && !loginForm.watch('password')))
                      ? `cursor-pointer ${portfolioClicks > 0 ? 'brightness-125 scale-105' : 'hover:brightness-110'}`
                      : 'cursor-default'
                    }`}
                  title={
                    (!loginForm.formState.isValid || (!loginForm.watch('username') && !loginForm.watch('password'))) && portfolioClicks > 0
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
                    <Label htmlFor="username" className="text-gray-200">Email</Label>
                    <div className="mt-1 relative">
                      <div className="flex items-center bg-white/10 rounded-lg border border-white/20 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 overflow-hidden">
                        <Input
                          id="username"
                          type="text"
                          placeholder="usuario"
                          {...loginForm.register('username')}
                          className={`flex-1 bg-transparent border-0 text-white placeholder-white/50 focus:ring-0 focus:border-0 ${loginForm.formState.errors.username ? 'text-red-400' : ''
                            }`}
                        />
                        <div className="flex items-center border-l border-white/20">
                          <span className="px-3 py-2 text-sm text-white/80">
                            {selectedDomain}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDomain(selectedDomain === '@imobiliariaipe.com.br' ? '@ipeimoveis.com' : '@imobiliariaipe.com.br')}
                            className="px-2 py-2 text-white/60 hover:text-white/90 transition-colors"
                            title="Alternar domínio"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Help Icon */}
                      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 group">
                        <button
                          type="button"
                          className="w-4 h-4 text-white/50 hover:text-white/80 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        
                        {/* Simple Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="font-medium text-amber-300 mb-1">Recomendação</div>
                          <div className="mb-2">Use <span className="text-amber-200">@imobiliariaipe.com.br</span> como padrão.</div>
                          <div className="text-green-400 text-xs">✅ Zoho API validada</div>
                          
                          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    {loginForm.formState.errors.username && (
                      <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
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

                <div className="space-y-4 mt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Acessar Plataforma
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Portal Access & Diagnostic */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                {/* Portal Link */}
                <LegacyPortalAccess />

                {/* Diagnostic Results */}
                {diagnosticResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mx-auto w-full sm:w-3/4 mt-4"
                  >
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-xs font-mono">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400 font-semibold">🔍 DIAGNÓSTICO</span>
                        <span className="text-gray-400">
                          {new Date(diagnosticResult.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-gray-300">
                        <div className="flex items-center gap-2">
                          <span className={diagnosticResult.dns.resolved ? 'text-green-400' : 'text-red-400'}>
                            {diagnosticResult.dns.resolved ? '✅' : '❌'}
                          </span>
                          <span>DNS: {diagnosticResult.dns.resolved ? `${diagnosticResult.dns.ip}` : 'FALHOU'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={diagnosticResult.http.accessible ? 'text-green-400' : 'text-red-400'}>
                            {diagnosticResult.http.accessible ? '✅' : '❌'}
                          </span>
                          <span>
                            HTTP: {diagnosticResult.http.accessible 
                              ? `${diagnosticResult.http.status} (${diagnosticResult.http.responseTime}ms)` 
                              : 'FALHOU'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={diagnosticResult.ssl.valid ? 'text-green-400' : 'text-red-400'}>
                            {diagnosticResult.ssl.valid ? '✅' : '❌'}
                          </span>
                          <span>SSL: {diagnosticResult.ssl.valid ? 'OK' : 'INVÁLIDO'}</span>
                        </div>

                        {diagnosticResult.http.status === 500 && (
                          <div className="mt-3 p-2 bg-red-900/50 border border-red-700 rounded">
                            <div className="text-red-400 font-semibold">🚨 ERRO 500 DETECTADO</div>
                            <div className="text-red-300 text-xs mt-1">
                              Provável problema suPHP (UID menor que min_uid)
                            </div>
                            <div className="text-yellow-300 text-xs mt-2">
                              <strong>Solução:</strong> Verificar proprietário dos arquivos PHP no servidor
                            </div>
                          </div>
                        )}

                        {diagnosticResult.http.error && (
                          <div className="mt-2 p-2 bg-red-900/30 border border-red-800 rounded">
                            <div className="text-red-400 text-xs">
                              Erro: {diagnosticResult.http.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Solicitar Acesso Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={switchToSignup}
                  className="text-amber-300 hover:text-amber-200 text-sm transition-colors duration-200 group"
                >
                  Não tem acesso? <span className="font-semibold underline group-hover:text-white">Solicite aqui</span>
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

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setViewMode('login')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Login
                  </Button>
                </div>
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