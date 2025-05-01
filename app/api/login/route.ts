// app/api/login/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSecret, signToken } from "@/lib/auth"

const COOKIE_NAME = "admin-auth"

export async function POST(req: NextRequest) {
    let body: any
    try {
        body = await req.json()
    } catch {
        return NextResponse.json(
            { error: "Payload inválido, JSON esperado." },
            { status: 400 }
        )
    }

    const { senha } = body
    const secret = getAdminSecret()

    if (senha !== secret) {
        return NextResponse.json(
            { error: "Senha incorreta." },
            { status: 401 }
        )
    }

    // Gera e seta o cookie assinado
    const token = signToken(secret)
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, token, {
        path: "/",
        maxAge: 60 * 60 * 12,            // 12 horas
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    })
    return res
}
