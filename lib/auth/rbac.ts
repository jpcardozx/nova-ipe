/**
 * 🛡️ RBAC Manager - Role-Based Access Control
 * Gerenciamento de usuários e controle de acesso baseado em roles
 */

import { createSupabaseServerClient } from './supabase-auth'
import { UserProfile, UserRole, Permission } from './types'

export class RBACManager {
  private static instance: RBACManager

  private constructor() {}

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager()
    }
    return RBACManager.instance
  }

  /**
   * Lista todos os usuários do sistema
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          department,
          phone,
          status,
          created_at,
          updated_at,
          last_login,
          avatar_url
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Adicionar permissions vazias se não existirem
      return (data || []).map(user => ({
        ...user,
        permissions: []
      })) as UserProfile[]
    } catch (error) {
      console.error('[RBACManager] Error fetching users:', error)
      return []
    }
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('[RBACManager] Error fetching user:', error)
      return null
    }
  }

  /**
   * Atualiza role de um usuário
   */
  async updateUserRole(
    userId: string,
    newRole: UserRole,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createSupabaseServerClient()

      // Verificar se admin tem permissão
      const { data: admin } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', adminId)
        .single()

      if (!admin) {
        return { success: false, error: 'Admin não encontrado' }
      }

      const adminRole = typeof admin.role === 'string' ? admin.role : admin.role?.name
      if (adminRole !== 'admin') {
        return { success: false, error: 'Apenas administradores podem alterar roles' }
      }

      // Atualizar role
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Log da mudança
      await supabase.from('audit_logs').insert({
        user_id: adminId,
        action: 'role_change',
        target_user_id: userId,
        new_role: newRole,
        timestamp: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error('[RBACManager] Error updating role:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Desativa um usuário
   */
  async deactivateUser(
    userId: string,
    adminId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createSupabaseServerClient()

      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Log da ação
      await supabase.from('audit_logs').insert({
        user_id: adminId,
        action: 'user_deactivated',
        target_user_id: userId,
        reason,
        timestamp: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error('[RBACManager] Error deactivating user:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Ativa um usuário
   */
  async activateUser(
    userId: string,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createSupabaseServerClient()

      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Log da ação
      await supabase.from('audit_logs').insert({
        user_id: adminId,
        action: 'user_activated',
        target_user_id: userId,
        timestamp: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error('[RBACManager] Error activating user:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Lista todas as roles disponíveis
   */
  async getAllRoles(): Promise<UserRole[]> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('hierarchy_level', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('[RBACManager] Error fetching roles:', error)
      return []
    }
  }

  /**
   * Verifica se usuário tem uma permissão específica
   */
  async hasPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user || !user.permissions) return false

      return user.permissions.some(
        (p: Permission) => p.resource === resource && p.action === action
      )
    } catch (error) {
      console.error('[RBACManager] Error checking permission:', error)
      return false
    }
  }

  /**
   * Deleta um usuário (soft delete)
   */
  async deleteUser(
    userId: string,
    adminId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createSupabaseServerClient()

      // Não deleta, apenas marca como suspenso
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Log da ação
      await supabase.from('audit_logs').insert({
        user_id: adminId,
        action: 'user_deleted',
        target_user_id: userId,
        reason,
        timestamp: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error('[RBACManager] Error deleting user:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
