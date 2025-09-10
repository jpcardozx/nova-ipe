// lib/auth/password-authorization.ts
import { UserProfile, UserRole } from './types'
import { RBACManager } from './rbac'
import bcrypt from 'bcryptjs'

export interface PasswordChangeRequest {
  userId: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  requestedBy: string
  reason?: string
}

export interface PasswordAuthResult {
  authorized: boolean
  reason?: string
  requiredAction?: 'require_admin_approval' | 'require_current_password' | 'require_2fa'
}

export class PasswordAuthorizationManager {
  private static instance: PasswordAuthorizationManager
  private rbac: RBACManager

  constructor() {
    this.rbac = RBACManager.getInstance()
  }

  static getInstance(): PasswordAuthorizationManager {
    if (!PasswordAuthorizationManager.instance) {
      PasswordAuthorizationManager.instance = new PasswordAuthorizationManager()
    }
    return PasswordAuthorizationManager.instance
  }

  /**
   * Verifica se um usuário pode alterar a senha de outro usuário
   */
  async canChangePassword(
    requestingUser: UserProfile,
    targetUserId: string,
    isOwnPassword: boolean = false
  ): Promise<PasswordAuthResult> {
    try {
      // Caso 1: Usuário alterando própria senha
      if (isOwnPassword && requestingUser.id === targetUserId) {
        return {
          authorized: true,
          requiredAction: 'require_current_password'
        }
      }

      // Caso 2: Admin alterando senha de outro usuário
      if (!isOwnPassword) {
        const hasPermission = await this.rbac.hasPermission(
          requestingUser.id,
          'users',
          'update_password'
        )

        if (!hasPermission) {
          return {
            authorized: false,
            reason: 'Usuário não tem permissão para alterar senhas de outros usuários'
          }
        }

        // Verificar hierarquia - não pode alterar senha de usuário com nível igual ou superior
        const targetUser = await this.rbac.getUserProfile(targetUserId)
        if (!targetUser) {
          return {
            authorized: false,
            reason: 'Usuário alvo não encontrado'
          }
        }

        if (targetUser.role.hierarchy_level >= requestingUser.role.hierarchy_level) {
          return {
            authorized: false,
            reason: 'Não é possível alterar senha de usuário com nível hierárquico igual ou superior'
          }
        }

        // Admin pode alterar sem senha atual, mas precisa de justificativa
        return {
          authorized: true,
          requiredAction: 'require_admin_approval'
        }
      }

      return {
        authorized: false,
        reason: 'Operação não autorizada'
      }
    } catch (error) {
      console.error('Erro ao verificar autorização:', error)
      return {
        authorized: false,
        reason: 'Erro interno do sistema'
      }
    }
  }

  /**
   * Valida os critérios de segurança da nova senha
   */
  validatePasswordSecurity(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Mínimo 8 caracteres
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres')
    }

    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula')
    }

    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula')
    }

    // Pelo menos um número
    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número')
    }

    // Pelo menos um caractere especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial')
    }

    // Verificar senhas comuns
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ]
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Esta senha é muito comum e não é segura')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Verifica se a senha atual está correta
   */
  async verifyCurrentPassword(userId: string, currentPassword: string): Promise<boolean> {
    try {
      // Aqui você buscaria a senha hash do banco de dados
      // Por simplicidade, vou usar uma implementação mock
      const user = await this.rbac.getUserProfile(userId)
      if (!user) return false

      // Em produção, você compararia com o hash armazenado
      // const storedHash = await this.getStoredPasswordHash(userId)
      // return await bcrypt.compare(currentPassword, storedHash)
      
      // Mock implementation
      return currentPassword.length > 0
    } catch (error) {
      console.error('Erro ao verificar senha atual:', error)
      return false
    }
  }

  /**
   * Processa a alteração de senha com todas as validações
   */
  async processPasswordChange(request: PasswordChangeRequest): Promise<{
    success: boolean
    message: string
    requiresApproval?: boolean
  }> {
    try {
      // Validar se as senhas coincidem
      if (request.newPassword !== request.confirmPassword) {
        return {
          success: false,
          message: 'As senhas não coincidem'
        }
      }

      // Validar critérios de segurança
      const securityValidation = this.validatePasswordSecurity(request.newPassword)
      if (!securityValidation.valid) {
        return {
          success: false,
          message: securityValidation.errors.join('. ')
        }
      }

      // Verificar autorização
      const requestingUser = await this.rbac.getUserProfile(request.requestedBy)
      if (!requestingUser) {
        return {
          success: false,
          message: 'Usuário solicitante não encontrado'
        }
      }

      const isOwnPassword = request.userId === request.requestedBy
      const authResult = await this.canChangePassword(requestingUser, request.userId, isOwnPassword)

      if (!authResult.authorized) {
        return {
          success: false,
          message: authResult.reason || 'Operação não autorizada'
        }
      }

      // Se requer senha atual, verificar
      if (authResult.requiredAction === 'require_current_password') {
        const currentPasswordValid = await this.verifyCurrentPassword(
          request.userId,
          request.currentPassword
        )
        
        if (!currentPasswordValid) {
          return {
            success: false,
            message: 'Senha atual incorreta'
          }
        }
      }

      // Se requer aprovação de admin, marcar para aprovação
      if (authResult.requiredAction === 'require_admin_approval') {
        await this.createPasswordChangeApproval(request)
        return {
          success: true,
          message: 'Solicitação de alteração de senha enviada para aprovação',
          requiresApproval: true
        }
      }

      // Executar alteração de senha
      await this.updatePassword(request.userId, request.newPassword)
      
      // Log da alteração
      await this.logPasswordChange(request)

      return {
        success: true,
        message: 'Senha alterada com sucesso'
      }
    } catch (error) {
      console.error('Erro ao processar alteração de senha:', error)
      return {
        success: false,
        message: 'Erro interno do sistema'
      }
    }
  }

  /**
   * Atualiza a senha no banco de dados
   */
  private async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
      
      // Aqui você atualizaria no Supabase ou banco de dados
      // await supabase
      //   .from('users')
      //   .update({ 
      //     password_hash: hashedPassword,
      //     password_updated_at: new Date().toISOString()
      //   })
      //   .eq('id', userId)
      
      console.log(`Senha atualizada para usuário ${userId}`)
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      throw error
    }
  }

  /**
   * Cria um registro de aprovação para alteração de senha
   */
  private async createPasswordChangeApproval(request: PasswordChangeRequest): Promise<void> {
    try {
      // Aqui você criaria um registro na tabela de aprovações
      const approvalRecord = {
        user_id: request.userId,
        requested_by: request.requestedBy,
        request_type: 'password_change',
        reason: request.reason,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      console.log('Aprovação criada:', approvalRecord)
    } catch (error) {
      console.error('Erro ao criar aprovação:', error)
      throw error
    }
  }

  /**
   * Registra a alteração de senha no log de auditoria
   */
  private async logPasswordChange(request: PasswordChangeRequest): Promise<void> {
    try {
      const logEntry = {
        user_id: request.userId,
        action: 'password_change',
        performed_by: request.requestedBy,
        timestamp: new Date().toISOString(),
        details: {
          reason: request.reason,
          self_change: request.userId === request.requestedBy
        }
      }
      
      console.log('Log de auditoria:', logEntry)
    } catch (error) {
      console.error('Erro ao registrar log:', error)
    }
  }
}
