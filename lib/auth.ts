// lib/auth.ts

/**
 * Recupera o segredo de administração a partir da variável de ambiente.
 * Em dev: avisa via console se não estiver definida.
 * Em produção: lança erro imediatamente.
 */
export function getAdminSecret(): string {
    const secret = process.env.ADMIN_PASS
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('ADMIN_PASS exists:', !!secret)
    console.log('ADMIN_PASS value:', secret)

    if (typeof secret !== 'string' || secret.trim() === '') {
        const msg = '⚠️ ADMIN_PASS não definida ou vazia.'

        if (process.env.NODE_ENV === 'development') {
            console.warn(msg)
            return '' // Em dev, permite fallback
        }

        throw new Error(`❌ ENV ERROR: ${msg}`)
    }

    return secret
}

/**
 * Converte um ArrayBuffer em string hexadecimal.
 */
function buf2hex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

const encoder = new TextEncoder()

/**
 * Gera um token de acesso assinado com o segredo (HMAC-SHA256).
 * Compatível com Edge Runtime.
 */
export async function signToken(secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode('studio-access')
    )

    return buf2hex(signature)
}

/**
 * Verifica se o token recebido é válido, comparando com HMAC esperado.
 * Usa comparação de tempo constante para evitar ataques de timing.
 */
export async function verifyToken(token: string, secret: string): Promise<boolean> {
    const expected = await signToken(secret)
    if (token.length !== expected.length) return false

    let diff = 0
    for (let i = 0; i < token.length; i++) {
        diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
    }

    return diff === 0
}
