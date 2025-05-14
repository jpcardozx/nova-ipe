import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Aqui você pode armazenar os dados em um sistema de análise
        // Por exemplo, enviar para o Google Analytics, Vercel Analytics, ou outro serviço

        // Para desenvolvimento, vamos apenas registrar no console do servidor
        if (process.env.NODE_ENV === 'development') {
            console.log('Web Vitals:', body);
        }

        // No ambiente de produção, você pode integrar com serviços como:
        // - Vercel Speed Insights
        // - Google Analytics
        // - New Relic
        // - Cloudflare

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving web vitals:', error);
        return NextResponse.json(
            { error: 'Failed to save web vitals data' },
            { status: 500 }
        );
    }
}
