// app/api/logout/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "admin-auth"

/**
 * Handler para logout: apaga o cookie de autenticação.
 */
export async function DELETE(_req: NextRequest) {
    const res = NextResponse.json({ ok: true })
    // Define o cookie com maxAge=0 para removê-lo
    res.cookies.set(COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    })
    return res
}
