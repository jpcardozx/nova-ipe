// app/api/login/route.ts
import { NextResponse } from "next/server"
import { getAdminSecret, signToken } from "../../../lib/auth"
import { EnvironmentManager } from "../../../lib/environment-config"

export async function POST(req: Request) {
    try {
        const { senha, email } = await req.json()

        // Validate environment configuration
        const config = EnvironmentManager.getConfig()
        if (!config.sanity.configured) {
            console.error('Sanity configuration not found')
            return NextResponse.json({
                error: "Studio configuration not found",
                errorCode: "CONFIG_ERROR"
            }, { status: 500 })
        }

        // Get admin secret
        let secret: string
        try {
            secret = getAdminSecret()
        } catch (error) {
            console.error('Admin secret not configured:', error)
            return NextResponse.json({
                error: "Studio authentication not configured",
                errorCode: "CONFIG_ERROR"
            }, { status: 500 })
        }

        console.log('Studio login attempt:', { email, hasPassword: !!senha })
        console.log('Secret configured:', !!secret)

        if (senha !== secret) {
            console.log('Invalid studio credentials')
            return NextResponse.json({
                error: "Invalid studio credentials",
                errorCode: "INVALID_CREDENTIALS"
            }, { status: 401 })
        }

        // Generate authentication token
        const token = await signToken(secret)
        const res = NextResponse.json({
            success: true,
            message: "Studio authentication successful"
        })

        // Set authentication cookie
        res.cookies.set("admin-auth", token, {
            path: "/",
            maxAge: 60 * 60 * 12, // 12 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        console.log('Studio authentication successful')
        return res

    } catch (error) {
        console.error('Studio login error:', error)
        return NextResponse.json({
            error: "Internal server error",
            errorCode: "INTERNAL_ERROR"
        }, { status: 500 })
    }
}
