/**
 * Schemas de Validação do Login
 */

import * as z from 'zod'

export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Digite seu usuário')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
