import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API para limpar o cache e forçar revalidação da página inicial
 * Para uso após implantação de novas versões
 * Protegido por senha para evitar uso não autorizado
 */
export async function POST(request: NextRequest) {
    try {
        // Verifica o token de segurança para autorizar a revalidação
        const { token } = await request.json();

        if (token !== process.env.REVALIDATE_TOKEN) {
            return NextResponse.json(
                { message: 'Token inválido' },
                { status: 401 }
            );
        }

        // Revalida a página inicial e os caminhos relacionados
        revalidatePath('/');
        revalidatePath('/pagina-aprimorada');

        return NextResponse.json(
            {
                success: true,
                message: 'Cache limpo com sucesso',
                timestamp: new Date().toISOString()
            }
        );
    } catch (error) {
        console.error('Erro ao revalidar cache:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Erro ao processar a solicitação'
            },
            { status: 500 }
        );
    }
}

/**
 * Responde a requisições GET com instruções de como usar a API
 */
export async function GET() {
    return NextResponse.json(
        {
            message: 'Use POST com um JSON contendo o token de revalidação',
            example: { token: 'seu-token-secreto' }
        },
        { status: 200 }
    );
}
