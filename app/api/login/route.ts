import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE_NAME = "admin-auth"
const AUTH_COOKIE_VALUE = process.env.ADMIN_PASS || "suasenha123"

export async function POST(req: NextRequest) {
    const { senha } = await req.json()

    if (senha === AUTH_COOKIE_VALUE) {
        const res = NextResponse.json({ ok: true })
        res.cookies.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
            path: "/",
            maxAge: 60 * 60 * 12, // 12h
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        })
        return res
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
