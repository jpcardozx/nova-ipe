// lib/auth.ts
import { createHmac, timingSafeEqual } from "crypto"

/**
 * Retorna a senha mestra, lançando erro se não estiver definida.
 */
export function getAdminSecret(): string {
    const secret = process.env.ADMIN_PASS
    if (!secret) {
        throw new Error("❌ ENV ADMIN_PASS não definida.")
    }
    return secret
}

/**
 * Gera um token HMAC-SHA256 a partir da senha.
 */
export function signToken(secret: string): string {
    return createHmac("sha256", secret).update(secret).digest("hex")
}

/**
 * Verifica se o token fornecido bate com o token esperado.
 * Usa comparação em tempo constante para evitar timing attacks.
 */
export function verifyToken(token: string, secret: string): boolean {
    const expected = signToken(secret)
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
