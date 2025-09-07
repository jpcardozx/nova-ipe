// lib/auth/access-control.ts - Sistema completo de controle de acesso
import { supabase } from '@/lib/supabase'
import { AccessRequest, AccessRequestDocument, LoginAttempt, AuditLog } from './types'
import { RBACManager } from './rbac'

export class AccessControlManager {
  private rbac = RBACManager.getInstance()
  private maxLoginAttempts = 5
  private lockoutDuration = 15 * 60 * 1000 // 15 minutos

  async submitAccessRequest(data: {
    full_name: string
    email: string
    phone: string
    department: string
    requested_role: string
    justification: string
    documents?: File[]
  }): Promise<{ success: boolean; error?: string; requestId?: string }> {
    try {
      // Verifica se já existe solicitação pendente
      const { data: existing } = await (supabase as any)
        .from('access_requests')
        .select('id, status')
        .eq('email', data.email)
        .in('status', ['pending', 'under_review'])
        .single()

      if (existing) {
        return {
          success: false,
          error: 'Já existe uma solicitação pendente para este email.'
        }
      }

      // Cria a solicitação
      const { data: request, error } = await (supabase as any)
        .from('access_requests')
        .insert([{
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          requested_role: data.requested_role,
          justification: data.justification,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar solicitação:', error)
        return { success: false, error: 'Erro interno. Tente novamente.' }
      }

      // Upload de documentos se fornecidos
      if (data.documents && data.documents.length > 0) {
        await this.uploadRequestDocuments(request.id, data.documents)
      }

      // Notifica administradores
      await this.notifyAdministrators(request)

      return { success: true, requestId: request.id }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      return { success: false, error: 'Erro interno. Tente novamente.' }
    }
  }

  private async uploadRequestDocuments(requestId: string, files: File[]): Promise<void> {
    for (const file of files) {
      try {
        const fileName = `${requestId}/${Date.now()}-${file.name}`

        const { data: uploadData, error: uploadError } = await (supabase as any).storage
          .from('access-request-documents')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Erro no upload:', uploadError)
          continue
        }

        // Salva referência no banco
        await (supabase as any)
          .from('access_request_documents')
          .insert([{
            request_id: requestId,
            file_name: file.name,
            file_type: file.type,
            file_url: uploadData.path
          }])
      } catch (error) {
        console.error('Erro ao processar documento:', error)
      }
    }
  }

  async getPendingRequests(reviewerId: string): Promise<AccessRequest[]> {
    try {
      // Verifica se o usuário pode revisar solicitações
      const canReview = await this.rbac.hasPermission(reviewerId, 'access_requests', 'review')
      if (!canReview) {
        throw new Error('Sem permissão para revisar solicitações')
      }

      const { data, error } = await (supabase as any)
        .from('access_requests')
        .select(`
          *,
          documents:access_request_documents(*)
        `)
        .in('status', ['pending', 'under_review'])
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar solicitações:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error)
      return []
    }
  }

  async reviewAccessRequest(
    requestId: string,
    reviewerId: string,
    action: 'approve' | 'reject' | 'request_more_info',
    notes?: string,
    temporaryPassword?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verifica permissões
      const canReview = await this.rbac.hasPermission(reviewerId, 'access_requests', 'review')
      if (!canReview) {
        return { success: false, error: 'Sem permissão para revisar solicitações' }
      }

      // Busca a solicitação
      const { data: request, error: fetchError } = await (supabase as any)
        .from('access_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError || !request) {
        return { success: false, error: 'Solicitação não encontrada' }
      }

      let newStatus: string
      let userCreated = false

      switch (action) {
        case 'approve':
          newStatus = 'approved'
          // Cria o usuário no sistema
          const createResult = await this.createApprovedUser(request, temporaryPassword)
          if (!createResult.success) {
            return createResult
          }
          userCreated = true
          break
        case 'reject':
          newStatus = 'rejected'
          break
        case 'request_more_info':
          newStatus = 'under_review'
          break
        default:
          return { success: false, error: 'Ação inválida' }
      }

      // Atualiza a solicitação
      const { error: updateError } = await (supabase as any)
        .from('access_requests')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerId,
          reviewer_notes: notes
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Erro ao atualizar solicitação:', updateError)
        return { success: false, error: 'Erro ao atualizar solicitação' }
      }

      // Log da auditoria
      await this.logAuditEvent(reviewerId, 'access_request_reviewed', 'access_requests', requestId, {
        action,
        notes,
        user_created: userCreated
      })

      // Notifica o solicitante
      await this.notifyRequestResult(request, action, notes)

      return { success: true }
    } catch (error) {
      console.error('Erro ao revisar solicitação:', error)
      return { success: false, error: 'Erro interno' }
    }
  }

  private async createApprovedUser(
    request: AccessRequest,
    temporaryPassword?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const password = temporaryPassword || this.generateTemporaryPassword()

      // Cria usuário no Supabase Auth
      const { data: authData, error: authError } = await (supabase as any).auth.admin.createUser({
        email: request.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: request.full_name,
          phone: request.phone,
          department: request.department
        }
      })

      if (authError) {
        console.error('Erro ao criar usuário:', authError)
        return { success: false, error: 'Erro ao criar usuário no sistema de autenticação' }
      }

      // Cria perfil do usuário
      const { error: profileError } = await (supabase as any)
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          email: request.email,
          full_name: request.full_name,
          phone: request.phone,
          department: request.department,
          role_id: request.requested_role,
          status: 'active'
        }])

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Tenta remover o usuário criado
        await (supabase as any).auth.admin.deleteUser(authData.user.id)
        return { success: false, error: 'Erro ao criar perfil do usuário' }
      }

      // Envia credenciais por email
      await this.sendCredentials(request.email, request.full_name, password)

      return { success: true }
    } catch (error) {
      console.error('Erro ao criar usuário aprovado:', error)
      return { success: false, error: 'Erro interno ao criar usuário' }
    }
  }

  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  async recordLoginAttempt(
    email: string,
    success: boolean,
    ipAddress: string,
    userAgent: string,
    failureReason?: string
  ): Promise<void> {
    try {
      await (supabase as any)
        .from('login_attempts')
        .insert([{
          email,
          success,
          ip_address: ipAddress,
          user_agent: userAgent,
          failure_reason: failureReason
        }])
    } catch (error) {
      console.error('Erro ao registrar tentativa de login:', error)
    }
  }

  async isAccountLocked(email: string): Promise<boolean> {
    try {
      const cutoffTime = new Date(Date.now() - this.lockoutDuration).toISOString()

      const { data, error } = await (supabase as any)
        .from('login_attempts')
        .select('id')
        .eq('email', email)
        .eq('success', false)
        .gte('attempted_at', cutoffTime)

      if (error) {
        console.error('Erro ao verificar bloqueio:', error)
        return false
      }

      return (data?.length || 0) >= this.maxLoginAttempts
    } catch (error) {
      console.error('Erro ao verificar bloqueio:', error)
      return false
    }
  }

  async logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      await (supabase as any)
        .from('audit_logs')
        .insert([{
          user_id: userId,
          action,
          resource,
          resource_id: resourceId,
          details: details || {},
          ip_address: '', // TODO: Capturar IP real
          user_agent: '' // TODO: Capturar User-Agent real
        }])
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error)
    }
  }

  private async notifyAdministrators(request: AccessRequest): Promise<void> {
    // TODO: Implementar notificação por email/Slack/Discord
    console.log('Nova solicitação de acesso:', request)
  }

  private async notifyRequestResult(
    request: AccessRequest,
    action: string,
    notes?: string
  ): Promise<void> {
    // TODO: Implementar notificação por email
    console.log(`Solicitação ${action}:`, request, notes)
  }

  private async sendCredentials(
    email: string,
    fullName: string,
    password: string
  ): Promise<void> {
    // TODO: Implementar envio de credenciais por email seguro
    console.log(`Credenciais para ${fullName} (${email}): ${password}`)
  }
}