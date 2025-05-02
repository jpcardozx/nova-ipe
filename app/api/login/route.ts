// app/api/login/route.ts
import { NextResponse } from "next/server"
import { getAdminSecret, signToken } from "@lib/auth"

export async function POST(req: Request) {
    const { senha } = await req.json()
    const secret = getAdminSecret()

    if (senha !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = await signToken(secret)
    const res = NextResponse.json({ ok: true })

    res.cookies.set("admin-auth", token, {
        path: "/",
        maxAge: 60 * 60 * 12,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // só secure em prod
        sameSite: "lax",
    })

    return res
}
