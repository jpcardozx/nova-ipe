/**
 * 🔐 SUPABASE AUTH - Server Actions SSR-First
 * Sistema de autenticação maduro e definitivo
 * Next.js 15 + Supabase SSR + Server Actions
 */

'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ============================================================================
// TYPES
// ============================================================================

export type AuthUser = {
  id: string
  email: string
  role: 'user' | 'admin' | 'studio'
}

export type AuthResult = {
  success: boolean
  user?: AuthUser
  error?: string
}

export type LoginMode = 'dashboard' | 'studio'

// ============================================================================
// SUPABASE SSR CLIENT
// ============================================================================

/**
 * Cria cliente Supabase Server-Side com cookies automáticos
 * Compatível com Server Components e Server Actions
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component: cookies().set() pode falhar (esperado)
          }
        },
      },
    }
  )
}

// ============================================================================
// AUTHENTICATION ACTIONS
// ============================================================================

/**
 * 🔐 LOGIN - Server Action (apenas autentica, sem redirect)
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param mode - Modo de acesso (dashboard/studio) - usado para logs
 * @returns Promise<void> - Sucesso ou lança erro
 */
export async function login(
  email: string,
  password: string,
  mode: LoginMode = 'dashboard'
): Promise<void> {
  const startTime = Date.now()

  try {
    console.log('🔐 [Auth Server] Iniciando login...', { mode })
    const clientStart = Date.now()
    const supabase = await createSupabaseServerClient()
    console.log(`⏱️ [Auth Server] Cliente criado em ${Date.now() - clientStart}ms`)

    // Autenticar com Supabase
    const authStart = Date.now()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    const authDuration = Date.now() - authStart
    console.log(`⏱️ [Auth Server] Supabase auth em ${authDuration}ms`)

    if (error || !data.session) {
      console.error(`❌ [Auth] Login failed após ${Date.now() - startTime}ms:`, error?.message)

      // ✅ Lançar erro ao invés de redirect (client fará tratamento)
      throw new Error(error?.message || 'Login failed')
    }

    // Extrair role (app_metadata tem prioridade - mais seguro)
    const userRole = (data.session.user.app_metadata?.role ||
                      data.session.user.user_metadata?.role ||
                      'user') as AuthUser['role']

    console.log(`✅ [Auth] Login success em ${Date.now() - startTime}ms:`, {
      email: data.session.user.email,
      role: userRole,
      mode,
      authTime: `${authDuration}ms`
    })

    // Revalidar cache para garantir que próxima navegação vê sessão atualizada
    const revalidateStart = Date.now()
    revalidatePath('/', 'layout')
    console.log(`⏱️ [Auth Server] Revalidation em ${Date.now() - revalidateStart}ms`)

    console.log(`✅ [Auth Server] Login completo em ${Date.now() - startTime}ms - cookies setados`)

    // ✅ Retorna sucesso (client fará redirect)
    return

  } catch (error) {
    console.error('❌ [Auth] Login exception:', error)

    // Re-throw para client tratar
    throw error
  }
}

/**
 * 🚪 LOGOUT - Server Action com redirect
 */
export async function logout(): Promise<never> {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()

    console.log('✅ [Auth] Logout success')
  } catch (error) {
    console.error('❌ [Auth] Logout error:', error)
  }

  // Revalidar e redirecionar
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * 👤 GET SESSION - Server Action
 * Retorna usuário autenticado ou null
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const supabase = await createSupabaseServerClient()

    // getUser() valida JWT com Supabase Auth server (seguro)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // SECURITY: app_metadata só pode ser modificado por admins
    const userRole = (user.app_metadata?.role ||
                      user.user_metadata?.role ||
                      'user') as AuthUser['role']

    return {
      id: user.id,
      email: user.email!,
      role: userRole,
    }
  } catch (error) {
    console.error('❌ [Auth] Get session error:', error)
    return null
  }
}

/**
 * ✅ CHECK AUTH - Server Action
 * Verifica se usuário está autenticado
 */
export async function checkAuth(): Promise<{
  authenticated: boolean
  user?: AuthUser
}> {
  const user = await getSession()

  if (!user) {
    return { authenticated: false }
  }

  return {
    authenticated: true,
    user,
  }
}

/**
 * 🔒 REQUIRE AUTH - Server Action com redirect
 * Garante autenticação ou redireciona para /login
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * 🛡️ CHECK PERMISSION - Server Action
 * Verifica se usuário tem role necessária
 */
export async function checkPermission(
  requiredRole: AuthUser['role']
): Promise<boolean> {
  const user = await getSession()

  if (!user) {
    return false
  }

  const roleHierarchy = {
    user: 1,
    admin: 2,
    studio: 3,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
