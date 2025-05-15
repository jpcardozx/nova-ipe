import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * API para logging de erros de imagem
 * Salva em arquivo e também pode enviar para serviços de monitoramento
 */
export async function POST(req: NextRequest) {
    try {
        // Extrai dados do corpo da requisição
        const data = await req.json();

        // Adiciona timestamp se não tiver
        if (!data.timestamp) {
            data.timestamp = new Date().toISOString();
        }

        // Formata a linha de log
        const logLine = JSON.stringify({
            ...data,
            userAgent: req.headers.get('user-agent'),
            referer: req.headers.get('referer'),
            ip: req.headers.get('x-forwarded-for') || 'unknown'
        });

        // Define caminho do arquivo de log
        const logDir = path.join(process.cwd(), 'logs');
        const logFile = path.join(logDir, 'image-errors.log');

        // Garante que o diretório de logs existe
        try {
            await fs.mkdir(logDir, { recursive: true });
        } catch (error) {
            // Ignora erro se o diretório já existir
        }

        // Grava no arquivo de log
        await fs.appendFile(logFile, logLine + '\n');

        // Aqui você poderia adicionar código para enviar para serviços externos
        // como Sentry, LogRocket, etc.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao processar log de imagem:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao processar log' },
            { status: 500 }
        );
    }
}
