import { NextResponse } from 'next/server';

export async function GET() {
    // Esta API não deve retornar dados mock em produção
    // Conectar com banco de dados real ou desabilitar endpoint
    return NextResponse.json([], {
        status: 200,
        headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    });
} 
