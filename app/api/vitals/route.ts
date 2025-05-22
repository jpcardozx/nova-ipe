/**
 * Web Vitals API Endpoint
 * 
 * Endpoint que recebe e processa métricas de Web Vitals dos clientes
 * Implementa armazenamento local e integração com serviços de analytics
 * 
 * @version 2.0.0
 * @date 19/05/2025
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Interface para as métricas recebidas
interface WebVitalMetric {
    name: string;
    delta: number;
    value: number;
    id: string;
    page?: string;
    rating?: 'good' | 'needs-improvement' | 'poor';
    timestamp?: number;
    userAgent?: string;
    deviceType?: string;
    connection?: string;
    viewport?: string;
}

/**
 * Classifica a métrica Web Vital com base nos valores recomendados
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (name.toLowerCase()) {
        case 'lcp':
            return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        case 'fid':
            return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        case 'cls':
            return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        case 'fcp':
            return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        case 'ttfb':
            return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        case 'inp':
            return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
        default:
            return value <= 1000 ? 'good' : value <= 2500 ? 'needs-improvement' : 'poor';
    }
}

/**
 * Processa métricas recebidas de Web Vitals
 */
export async function POST(request: NextRequest) {
    try {
        // Parse do corpo da requisição
        const body = await request.json();

        // Normaliza a estrutura dos dados
        const metric: WebVitalMetric = {
            name: body.name || body.metricName,
            value: Number(body.value || body.metricValue),
            delta: Number(body.delta || 0),
            id: body.id || crypto.randomUUID(),
            page: body.page || request.nextUrl.pathname,
            timestamp: body.timestamp || Date.now(),
            // Classificação da métrica
            rating: getRating(body.name, Number(body.value)),
            // Contexto adicional
            userAgent: request.headers.get('user-agent') || undefined,
            connection: request.headers.get('connection-type') || undefined,
            viewport: request.headers.get('viewport-width') ?
                `${request.headers.get('viewport-width')}x${request.headers.get('viewport-height')}` :
                undefined
        };

        // Log em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals API] ${metric.name}: ${Math.round(metric.value)}ms | Page: ${metric.page} | Rating: ${metric.rating}`);

            // Salva métricas localmente em desenvolvimento
            try {
                const metricsDir = path.join(os.tmpdir(), 'web-vitals-metrics');
                await fs.mkdir(metricsDir, { recursive: true });

                const metricsFile = path.join(metricsDir, 'vitals.json');

                // Lê dados existentes
                let existingData: WebVitalMetric[] = [];
                try {
                    const fileData = await fs.readFile(metricsFile, 'utf-8');
                    existingData = JSON.parse(fileData);
                } catch (e) {
                    // Arquivo não existe ainda, começa com array vazio
                }

                // Adiciona nova métrica e salva
                existingData.push(metric);
                await fs.writeFile(metricsFile, JSON.stringify(existingData, null, 2));
            } catch (err) {
                console.error('Error saving metrics locally:', err);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing web vitals:', error);
        return NextResponse.json(
            { error: 'Failed to process web vitals data' },
            { status: 500 }
        );
    }
}

/**
 * Retorna as métricas coletadas
 */
export async function GET() {
    try {
        let metrics: WebVitalMetric[] = [];

        // Em desenvolvimento, lê do arquivo local
        if (process.env.NODE_ENV === 'development') {
            const metricsFile = path.join(os.tmpdir(), 'web-vitals-metrics', 'vitals.json');
            try {
                const fileData = await fs.readFile(metricsFile, 'utf-8');
                metrics = JSON.parse(fileData);
            } catch (e) {
                // Arquivo não existe ou não pode ser lido
            }
        }

        return NextResponse.json({ metrics });
    } catch (error) {
        console.error('Error retrieving web vitals:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve web vitals data' },
            { status: 500 }
        );
    }
}
