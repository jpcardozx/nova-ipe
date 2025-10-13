/**
 * 🛡️ Role Utilities
 * Utilitários para verificação de roles de usuário
 */

import { UserProfile } from './types'

/**
 * Verifica se o usuário tem role de admin
 * 
 * @param user - UserProfile object ou null
 * @returns true se for admin, false caso contrário
 * 
 * @example
 * ```typescript
 * const { user } = useCurrentUser()
 * if (isAdmin(user)) {
 *   // Mostrar funcionalidades de admin
 * }
 * ```
 */
export function isAdmin(user: UserProfile | null | undefined): boolean {
  if (!user || !user.role) return false
  
  const roleName = typeof user.role === 'string' ? user.role : user.role.name
  return roleName === 'admin' || roleName === 'studio'
}

/**
 * Verifica se o usuário tem role de studio
 */
export function isStudio(user: UserProfile | null | undefined): boolean {
  if (!user || !user.role) return false
  const roleName = typeof user.role === 'string' ? user.role : user.role.name
  return roleName === 'studio'
}

/**
 * Verifica se o usuário tem qualquer uma das roles especificadas
 * 
 * @param user - UserProfile object
 * @param roles - Array de roles permitidas
 * @returns true se o usuário tiver uma das roles
 * 
 * @example
 * ```typescript
 * if (hasAnyRole(user, ['admin', 'studio'])) {
 *   // Acesso permitido
 * }
 * ```
 */
export function hasAnyRole(
  user: UserProfile | null | undefined,
  roles: string[]
): boolean {
  if (!user || !user.role) return false
  const roleName = typeof user.role === 'string' ? user.role : user.role.name
  return roles.includes(roleName)
}

/**
 * Verifica se o usuário tem permissão para gerenciar outros usuários
 */
export function canManageUsers(user: UserProfile | null | undefined): boolean {
  return isAdmin(user)
}

/**
 * Verifica se o usuário pode acessar o dashboard
 */
export function canAccessDashboard(user: UserProfile | null | undefined): boolean {
  if (!user || !user.role) return false
  const roleName = typeof user.role === 'string' ? user.role : user.role.name
  return ['admin', 'studio', 'user'].includes(roleName)
}

/**
 * Verifica se o usuário pode acessar o Sanity Studio
 */
export function canAccessStudio(user: UserProfile | null | undefined): boolean {
  return isAdmin(user) || isStudio(user)
}
