// lib/auth/rbac.ts - Role-Based Access Control
import { supabase } from '@/lib/supabase'
import { UserProfile, UserRole, Permission } from './types'

export class RBACManager {
  private static instance: RBACManager
  private rolesCache: Map<string, UserRole> = new Map()
  private userCache: Map<string, UserProfile> = new Map()

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager()
    }
    return RBACManager.instance
  }

  // Definição de roles padrão para imobiliárias
  private defaultRoles: UserRole[] = [
    {
      id: 'super_admin',
      name: 'Super Administrador',
      hierarchy_level: 100,
      permissions: [
        { id: 'all', resource: '*', action: '*' }
      ]
    },
    {
      id: 'admin',
      name: 'Administrador',
      hierarchy_level: 90,
      permissions: [
        { id: 'users_manage', resource: 'users', action: '*' },
        { id: 'properties_manage', resource: 'properties', action: '*' },
        { id: 'leads_manage', resource: 'leads', action: '*' },
        { id: 'reports_view', resource: 'reports', action: 'read' },
        { id: 'system_config', resource: 'system', action: 'configure' }
      ]
    },
    {
      id: 'manager',
      name: 'Gerente',
      hierarchy_level: 80,
      permissions: [
        { id: 'properties_manage', resource: 'properties', action: '*' },
        { id: 'leads_manage', resource: 'leads', action: '*' },
        { id: 'agents_manage', resource: 'users', action: 'read,update', conditions: { role: 'agent' } },
        { id: 'reports_view', resource: 'reports', action: 'read' }
      ]
    },
    {
      id: 'agent',
      name: 'Corretor',
      hierarchy_level: 50,
      permissions: [
        { id: 'properties_own', resource: 'properties', action: 'read,update', conditions: { owner: 'self' } },
        { id: 'leads_own', resource: 'leads', action: '*', conditions: { assigned_to: 'self' } },
        { id: 'clients_manage', resource: 'clients', action: '*', conditions: { assigned_to: 'self' } }
      ]
    },
    {
      id: 'assistant',
      name: 'Assistente',
      hierarchy_level: 30,
      permissions: [
        { id: 'properties_read', resource: 'properties', action: 'read' },
        { id: 'leads_support', resource: 'leads', action: 'read,update', conditions: { support_access: true } },
        { id: 'clients_support', resource: 'clients', action: 'read,update', conditions: { support_access: true } }
      ]
    },
    {
      id: 'viewer',
      name: 'Visualizador',
      hierarchy_level: 10,
      permissions: [
        { id: 'properties_read', resource: 'properties', action: 'read' },
        { id: 'reports_basic', resource: 'reports', action: 'read', conditions: { type: 'basic' } }
      ]
    }
  ]

  async initializeRoles(): Promise<void> {
    try {
      for (const role of this.defaultRoles) {
        const { error } = await (supabase as any)
          .from('user_roles')
          .upsert(role, { onConflict: 'id' })

        if (error) {
          console.error(`Erro ao criar role ${role.id}:`, error)
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar roles:', error)
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (this.userCache.has(userId)) {
      return this.userCache.get(userId)!
    }

    try {
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select(`
          *,
          role:user_roles(*)
        `)
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      const profile: UserProfile = {
        ...data,
        permissions: data.role?.permissions || []
      }

      this.userCache.set(userId, profile)
      return profile
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error)
      return null
    }
  }

  async hasPermission(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return false

    // Super admin tem acesso total
    if (profile.role.id === 'super_admin') return true

    // Verifica permissões específicas
    for (const permission of profile.permissions) {
      if (this.matchesPermission(permission, resource, action, context, profile)) {
        return true
      }
    }

    return false
  }

  private matchesPermission(
    permission: Permission,
    resource: string,
    action: string,
    context?: Record<string, any>,
    userProfile?: UserProfile
  ): boolean {
    // Wildcard para recurso
    if (permission.resource === '*') return true
    if (permission.resource !== resource) return false

    // Wildcard para ação
    if (permission.action === '*') return true

    // Múltiplas ações separadas por vírgula
    const allowedActions = permission.action.split(',').map(a => a.trim())
    if (!allowedActions.includes(action)) return false

    // Verifica condições específicas
    if (permission.conditions && context && userProfile) {
      return this.evaluateConditions(permission.conditions, context, userProfile)
    }

    return true
  }

  private evaluateConditions(
    conditions: Record<string, any>,
    context: Record<string, any>,
    userProfile: UserProfile
  ): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      switch (key) {
        case 'owner':
          if (value === 'self' && context.owner_id !== userProfile.id) {
            return false
          }
          break
        case 'assigned_to':
          if (value === 'self' && context.assigned_to !== userProfile.id) {
            return false
          }
          break
        case 'role':
          if (Array.isArray(value)) {
            if (!value.includes(context.user_role)) return false
          } else {
            if (context.user_role !== value) return false
          }
          break
        case 'department':
          if (userProfile.department !== value) return false
          break
        default:
          if (context[key] !== value) return false
      }
    }
    return true
  }

  async canManageUser(managerId: string, targetUserId: string): Promise<boolean> {
    const manager = await this.getUserProfile(managerId)
    const target = await this.getUserProfile(targetUserId)

    if (!manager || !target) return false

    // Super admin pode gerenciar qualquer um
    if (manager.role.id === 'super_admin') return true

    // Não pode gerenciar usuários de nível hierárquico igual ou superior
    return manager.role.hierarchy_level > target.role.hierarchy_level
  }

  clearCache(): void {
    this.userCache.clear()
    this.rolesCache.clear()
  }
}