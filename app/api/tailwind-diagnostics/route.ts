/**
 * API Route para Diagnósticos do Tailwind
 * 
 * Este endpoint permitirá que o componente de diagnóstico do cliente
 * obtenha informações do servidor sem importar módulos Node.js no navegador.
 */
import { NextResponse } from 'next/server';
// Importar do nosso wrapper de servidor seguro
import { checkInstalledVersions, checkTailwindConfig } from '@/lib/server-safe-tailwind';

export async function GET() {
    try {
        // Obter dados de diagnóstico
        const versions = await checkInstalledVersions();
        const config = await checkTailwindConfig();

        // Retornar os resultados
        return NextResponse.json({
            success: true,
            data: {
                versions,
                config
            }
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        );
    }
}
