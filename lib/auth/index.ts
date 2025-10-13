/**
 * 🔐 Auth Module - Barrel Exports
 * Exporta todas as funcionalidades de autenticação
 */

import { verify, sign } from 'jsonwebtoken'

// Re-export tipos
export type { AuthUser, AuthResult, LoginMode } from './supabase-auth'
export type { UserProfile, UserRole, Permission, AccessRequest } from './types'
export type { PasswordChangeRequest, PasswordValidationResult } from './password-authorization'

// Re-export funções principais
export { 
  createSupabaseServerClient,
  login, 
  logout, 
  checkAuth 
} from './supabase-auth'

export { isAdmin, isStudio, hasAnyRole, canManageUsers, canAccessDashboard, canAccessStudio } from './role-utils'
export { requireAuth, requireAdmin } from './api-auth-middleware'
export { PasswordAuthorizationManager } from './password-authorization'
export { RBACManager } from './rbac'
export { authDebugger, AuthDebugger } from './auth-debugger'

// ============================================================================
// STUDIO AUTHENTICATION UTILITIES
// ============================================================================

/**
 * Verifica token JWT para Sanity Studio
 * @param token - JWT token
 * @param secret - Secret para verificação
 */
export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    verify(token, secret)
    return true
  } catch (error) {
    console.error('[verifyToken] Invalid token:', error)
    return false
  }
}

/**
 * Gera token JWT para Sanity Studio
 * @param payload - Dados do usuário
 * @param secret - Secret para assinatura
 * @param expiresIn - Tempo de expiração (default: 24h)
 */
export function generateToken(
  payload: { userId: string; email: string; role: string },
  secret: string,
  expiresIn: string = '24h'
): string {
  return sign(payload, secret, { expiresIn })
}

/**
 * Retorna o secret do admin configurado nas variáveis de ambiente
 * @throws Error se ADMIN_SECRET não estiver configurado
 */
export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET
  
  if (!secret) {
    throw new Error('ADMIN_SECRET not configured in environment variables')
  }
  
  return secret
}

/**
 * Verifica se usuário tem acesso ao Studio baseado no token
 * @param token - Token de autenticação
 * @returns Promise<boolean>
 */
export async function verifyStudioAccess(token: string): Promise<boolean> {
  try {
    const secret = getAdminSecret()
    return await verifyToken(token, secret)
  } catch (error) {
    console.error('[verifyStudioAccess] Error:', error)
    return false
  }
}
