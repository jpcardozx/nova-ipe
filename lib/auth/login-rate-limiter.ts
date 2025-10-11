/**
 * Client-side Rate Limiter para Login
 * Previne excesso de tentativas e fornece feedback ao usuário
 */

export interface RateLimitStatus {
  canAttempt: boolean
  attemptsLeft: number
  resetTime: number | null
  waitTimeMs: number
  message: string
}

export interface LoginAttempt {
  timestamp: number
  email: string
  success: boolean
}

const STORAGE_KEY = 'login_attempts'
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60000 // 1 minuto
const LOCKOUT_MS = 300000 // 5 minutos após exceder limite

export class LoginRateLimiter {
  /**
   * Verificar se usuário pode tentar login
   */
  static checkRateLimit(email: string): RateLimitStatus {
    const attempts = this.getAttempts(email)
    const now = Date.now()

    // Limpar tentativas antigas (fora da janela)
    const recentAttempts = attempts.filter(
      (attempt) => now - attempt.timestamp < WINDOW_MS
    )

    // Se há menos que MAX_ATTEMPTS, permitir
    if (recentAttempts.length < MAX_ATTEMPTS) {
      return {
        canAttempt: true,
        attemptsLeft: MAX_ATTEMPTS - recentAttempts.length,
        resetTime: null,
        waitTimeMs: 0,
        message: ''
      }
    }

    // Verificar se está em lockout
    const oldestRecentAttempt = recentAttempts[0]
    const timeSinceOldest = now - oldestRecentAttempt.timestamp
    const waitTime = LOCKOUT_MS - timeSinceOldest

    if (waitTime > 0) {
      const minutesLeft = Math.ceil(waitTime / 60000)
      return {
        canAttempt: false,
        attemptsLeft: 0,
        resetTime: now + waitTime,
        waitTimeMs: waitTime,
        message: `Muitas tentativas. Aguarde ${minutesLeft} minuto(s) antes de tentar novamente.`
      }
    }

    // Lockout expirou, permitir nova tentativa
    this.clearOldAttempts(email)
    return {
      canAttempt: true,
      attemptsLeft: MAX_ATTEMPTS,
      resetTime: null,
      waitTimeMs: 0,
      message: ''
    }
  }

  /**
   * Registrar tentativa de login
   */
  static recordAttempt(email: string, success: boolean): void {
    const attempts = this.getAttempts(email)

    attempts.push({
      timestamp: Date.now(),
      email,
      success
    })

    // Se sucesso, limpar todas as tentativas
    if (success) {
      this.clearAttempts(email)
      return
    }

    // Limitar a 20 tentativas no storage (economia de espaço)
    const recentAttempts = attempts.slice(-20)

    try {
      localStorage.setItem(
        `${STORAGE_KEY}_${this.hashEmail(email)}`,
        JSON.stringify(recentAttempts)
      )
    } catch (error) {
      console.warn('Falha ao salvar tentativas de login:', error)
    }
  }

  /**
   * Obter tentativas para um email
   */
  private static getAttempts(email: string): LoginAttempt[] {
    try {
      const key = `${STORAGE_KEY}_${this.hashEmail(email)}`
      const stored = localStorage.getItem(key)

      if (!stored) return []

      return JSON.parse(stored) as LoginAttempt[]
    } catch (error) {
      console.warn('Falha ao ler tentativas de login:', error)
      return []
    }
  }

  /**
   * Limpar tentativas antigas
   */
  private static clearOldAttempts(email: string): void {
    const attempts = this.getAttempts(email)
    const now = Date.now()

    const recentAttempts = attempts.filter(
      (attempt) => now - attempt.timestamp < LOCKOUT_MS
    )

    try {
      const key = `${STORAGE_KEY}_${this.hashEmail(email)}`
      if (recentAttempts.length === 0) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(recentAttempts))
      }
    } catch (error) {
      console.warn('Falha ao limpar tentativas:', error)
    }
  }

  /**
   * Limpar todas as tentativas de um email (após sucesso)
   */
  private static clearAttempts(email: string): void {
    try {
      const key = `${STORAGE_KEY}_${this.hashEmail(email)}`
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Falha ao limpar tentativas:', error)
    }
  }

  /**
   * Hash simples do email para key do localStorage
   */
  private static hashEmail(email: string): string {
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Limpar todos os rate limits (admin/debug)
   */
  static clearAll(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Falha ao limpar rate limits:', error)
    }
  }

  /**
   * Obter estatísticas de tentativas
   */
  static getStats(email: string): {
    totalAttempts: number
    failedAttempts: number
    successfulAttempts: number
    lastAttempt: number | null
  } {
    const attempts = this.getAttempts(email)

    return {
      totalAttempts: attempts.length,
      failedAttempts: attempts.filter((a) => !a.success).length,
      successfulAttempts: attempts.filter((a) => a.success).length,
      lastAttempt: attempts.length > 0 ? attempts[attempts.length - 1].timestamp : null
    }
  }
}
