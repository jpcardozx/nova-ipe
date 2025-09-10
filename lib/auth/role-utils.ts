// lib/auth/role-utils.ts
import { UserRole, UserProfile } from './types'

export const isAdmin = (user: UserProfile | null): boolean => {
  if (!user || !user.role) return false
  return user.role.name.toLowerCase() === 'admin' || user.role.hierarchy_level === 1
}

export const isGerente = (user: UserProfile | null): boolean => {
  if (!user || !user.role) return false
  return user.role.name.toLowerCase() === 'gerente' || user.role.hierarchy_level === 2
}

export const isCorretor = (user: UserProfile | null): boolean => {
  if (!user || !user.role) return false
  return user.role.name.toLowerCase() === 'corretor' || user.role.hierarchy_level === 3
}

export const hasPermission = (user: UserProfile | null, resource: string, action: string): boolean => {
  if (!user || !user.permissions) return false
  
  return user.permissions.some(permission => 
    permission.resource === resource && permission.action === action
  )
}

export const getUserRoleName = (user: UserProfile | null): string => {
  if (!user || !user.role) return 'usuário'
  return user.role.name.toLowerCase()
}

export const canAccessAdminArea = (user: UserProfile | null): boolean => {
  return isAdmin(user) || isGerente(user)
}
