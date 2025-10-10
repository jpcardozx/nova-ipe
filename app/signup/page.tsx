
'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, UserPlus, CheckCircle, AlertTriangle, Sparkles, Building, Briefcase, MessageSquare } from 'lucide-react'
import { SimpleAuthManager } from '@/lib/auth-simple'
import { SignupFormManager } from '@/lib/signup-form-manager'

const signupSchema = z.object({
  full_name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'Telefone inválido.' }),
  department: z.string().min(1, { message: 'Por favor, selecione um setor.' }),
  justification: z.string().min(15, { message: 'Justificativa deve ter no mínimo 15 caracteres.' }),
})

type SignupFormValues = z.infer<typeof signupSchema>

const departments = [
  { value: 'vendas', label: 'Vendas', icon: Building },
  { value: 'locacao', label: 'Locação', icon: Briefcase },
  { value: 'marketing', label: 'Marketing', icon: Sparkles },
  { value: 'admin', label: 'Administrativo', icon: UserPlus },
]

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  
  const authManager = new SimpleAuthManager()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched'
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const requestData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        requested_role: 'agent',
        justification: data.justification,
      }

      const result = await authManager.submitAccessRequest(requestData)

      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage('Solicitação enviada com sucesso! Entraremos em contato em breve.')
        reset()
        setSelectedDepartment('')
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Ocorreu um erro. Por favor, tente novamente.')
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error)
      setSubmitStatus('error')
      setSubmitMessage('Erro inesperado no servidor. Tente mais tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(dept)
    setValue('department', dept, { shouldValidate: true })
  }

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = SignupFormManager.formatPhone(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }, [setValue])

  if (submitStatus === 'success') {
    return (
      <div className="relative min-h-screen w-full bg-cover bg-center bg-[url('/images/login.png')]">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-8 text-center backdrop-blur-xl"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-400" />
            <h1 className="font-playfair-display mt-6 text-4xl font-bold text-white">
              Solicitação Enviada!
            </h1>
            <p className="mt-3 text-lg text-slate-300">
              {submitMessage}
            </p>
            <div className="my-8 h-px bg-white/10" />
            <p className="text-slate-400">
              Nossa equipe analisará sua solicitação e você receberá um email com os próximos passos.
            </p>
            <Link href="/login">
              <Button
                variant="outline"
                className="mt-8 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center bg-[url('/images/login.png')]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="relative z-10 flex min-h-screen flex-col items-start justify-center p-4 pt-32 pb-12 md:p-12 lg:p-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-xl"
        >
          <div className="mb-8">
            <h1 className="font-playfair-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Solicite seu Acesso
            </h1>
            <p className="mt-2 text-slate-300">
              Torne-se um parceiro e tenha acesso a ferramentas exclusivas.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nome Completo */}
              <div className="space-y-1">
                <Label htmlFor="full_name" className="text-slate-400">Nome Completo</Label>
                <Input id="full_name" {...register('full_name')} placeholder="Seu nome" variant="dark" />
                {errors.full_name && <p className="text-red-400 text-xs">{errors.full_name.message}</p>}
              </div>
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-400">Email</Label>
                <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" variant="dark" />
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>
            </div>
            
            {/* Telefone */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-slate-400">WhatsApp</Label>
              <Input id="phone" {...register('phone')} onChange={handlePhoneChange} placeholder="(11) 99999-9999" variant="dark" />
              {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Setor */}
            <div className="space-y-2">
              <Label className="text-slate-400">Setor de Interesse</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {departments.map((dept) => {
                  const Icon = dept.icon
                  return (
                    <button
                      key={dept.value}
                      type="button"
                      onClick={() => handleDepartmentSelect(dept.value)}
                      className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
                        selectedDepartment === dept.value
                          ? 'border-amber-400 bg-amber-900/50'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-1 ${selectedDepartment === dept.value ? 'text-amber-400' : 'text-slate-300'}`} />
                      <span className={`text-xs font-medium ${selectedDepartment === dept.value ? 'text-white' : 'text-slate-300'}`}>
                        {dept.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.department && <p className="text-red-400 text-xs">{errors.department.message}</p>}
            </div>

            {/* Justificativa */}
            <div className="space-y-1">
              <Label htmlFor="justification" className="text-slate-400">Por que você quer se juntar a nós?</Label>
              <textarea
                id="justification"
                {...register('justification')}
                placeholder="Descreva sua experiência e seus objetivos..."
                rows={3}
                className="w-full rounded-md border-2 border-white/20 bg-white/5 p-2 text-white transition-colors focus:border-amber-400 focus:outline-none focus:ring-0"
              />
              {errors.justification && <p className="text-red-400 text-xs">{errors.justification.message}</p>}
            </div>

            {submitStatus === 'error' && (
              <div className="rounded-md bg-red-900/50 border border-red-400/50 p-3 text-center text-sm text-red-300">
                {submitMessage}
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-gray-600 disabled:from-gray-600 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Acesso'}
              </Button>
              <Link href="/login" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-white/20 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  Já tem uma conta? Faça login
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
