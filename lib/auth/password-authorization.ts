/**
 * 🔐 Password Authorization Manager
 * Gerencia autorização e validação de mudanças de senha
 */

import { createSupabaseServerClient } from './supabase-auth'

export interface PasswordChangeRequest {
  userId: string
  currentPassword?: string
  newPassword: string
  reason?: string
  isAdminChange: boolean
  adminId?: string
}

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
  strength: number
}

export interface PasswordChangeResult {
  success: boolean
  message: string
  error?: string
}

export class PasswordAuthorizationManager {
  /**
   * Valida requisitos de senha
   * Mínimo 8 caracteres, com letra maiúscula, minúscula e número
   */
  static validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = []
    let strength = 0

    if (password.length < 8) {
      errors.push('Senha deve ter no mínimo 8 caracteres')
    } else {
      strength += 20
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula')
    } else {
      strength += 20
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula')
    } else {
      strength += 20
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos um número')
    } else {
      strength += 20
    }

    // Caracteres especiais aumentam força
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 20
    }

    return {
      valid: errors.length === 0,
      errors,
      strength
    }
  }

  /**
   * Verifica se usuário pode mudar senha de outro usuário
   */
  static async canChangeUserPassword(
    adminId: string,
    targetUserId: string
  ): Promise<{ authorized: boolean; reason?: string }> {
    try {
      const supabase = await createSupabaseServerClient()
      
      // Buscar dados do admin
      const { data: admin } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', adminId)
        .single()

      if (!admin) {
        return { authorized: false, reason: 'Admin não encontrado' }
      }

      // Verificar se é admin ou studio
      const adminRole = typeof admin.role === 'string' ? admin.role : admin.role?.name
      if (adminRole !== 'admin' && adminRole !== 'studio') {
        return { authorized: false, reason: 'Apenas administradores podem alterar senhas de outros usuários' }
      }

      // Buscar dados do usuário alvo
      const { data: targetUser } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', targetUserId)
        .single()

      if (!targetUser) {
        return { authorized: false, reason: 'Usuário não encontrado' }
      }

      // Admin não pode mudar senha de outro admin sem ser super admin
      const targetRole = typeof targetUser.role === 'string' ? targetUser.role : targetUser.role?.name
      if (targetRole === 'admin' && adminId !== targetUserId) {
        return { authorized: false, reason: 'Não é possível alterar senha de outro administrador' }
      }

      return { authorized: true }

    } catch (error) {
      console.error('[PasswordAuthorizationManager] Error:', error)
      return { authorized: false, reason: 'Erro ao verificar permissões' }
    }
  }

  /**
   * Processa mudança de senha
   */
  static async changePassword(
    request: PasswordChangeRequest
  ): Promise<PasswordChangeResult> {
    try {
      // Validar nova senha
      const validation = this.validatePassword(request.newPassword)
      if (!validation.valid) {
        return {
          success: false,
          message: 'Senha não atende aos requisitos',
          error: validation.errors.join(', ')
        }
      }

      const supabase = await createSupabaseServerClient()

      // Se é mudança de admin para outro usuário
      if (request.isAdminChange && request.adminId) {
        const authCheck = await this.canChangeUserPassword(
          request.adminId,
          request.userId
        )

        if (!authCheck.authorized) {
          return {
            success: false,
            message: 'Não autorizado',
            error: authCheck.reason
          }
        }

        // Admin mudando senha de outro usuário (via Admin API)
        const { error } = await supabase.auth.admin.updateUserById(
          request.userId,
          { password: request.newPassword }
        )

        if (error) {
          return {
            success: false,
            message: 'Erro ao alterar senha',
            error: error.message
          }
        }

        // Log da mudança
        await supabase.from('audit_logs').insert({
          user_id: request.adminId,
          action: 'password_change_by_admin',
          target_user_id: request.userId,
          reason: request.reason,
          timestamp: new Date().toISOString()
        })

        return {
          success: true,
          message: 'Senha alterada com sucesso'
        }
      }

      // Usuário mudando própria senha
      if (!request.currentPassword) {
        return {
          success: false,
          message: 'Senha atual é obrigatória',
          error: 'current_password_required'
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: request.newPassword
      })

      if (error) {
        return {
          success: false,
          message: 'Erro ao alterar senha',
          error: error.message
        }
      }

      return {
        success: true,
        message: 'Senha alterada com sucesso'
      }

    } catch (error) {
      console.error('[PasswordAuthorizationManager] Error:', error)
      return {
        success: false,
        message: 'Erro ao processar mudança de senha',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
