/**
 * Component Metrics API Route
 * 
 * Este endpoint recebe e processa métricas de carregamento de componentes
 * para análise de performance e otimização. Trabalha em conjunto com
 * o DynamicComponentLoader para coletar dados sobre tempo de carregamento.
 * 
 * @version 1.0.0
 * @date 18/05/2025
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Definição de tipos para os dados de métricas
interface ComponentMetric {
    component: string;
    loadTime: number;
    timestamp: number;
    page?: string;
    viewport?: string;
    connection?: string;
}

/**
 * POST handler para receber dados de métricas de componentes
 */
export async function POST(request: NextRequest) {
    try {
        // Parse do corpo da requisição
        const body = await request.json();

        // Normaliza os dados recebidos
        const metric: ComponentMetric = {
            component: body.component || 'unknown',
            loadTime: Number(body.loadTime || 0),
            timestamp: body.timestamp || Date.now(),
            page: request.nextUrl.pathname,
            viewport: request.headers.get('viewport-width')
                ? `${request.headers.get('viewport-width')}x${request.headers.get('viewport-height')}`
                : undefined,
            connection: request.headers.get('connection-type') || undefined,
        };

        // Em desenvolvimento, armazena métricas localmente para análise
        if (process.env.NODE_ENV === 'development') {
            console.log(`[ComponentMetric] ${metric.component}: ${Math.round(metric.loadTime)}ms`);

            try {
                // Cria diretório para métricas se não existir
                const metricsDir = path.join(os.tmpdir(), 'component-metrics');
                await fs.mkdir(metricsDir, { recursive: true });

                // Define nome do arquivo com data atual
                const metricsFile = path.join(metricsDir, `components-${new Date().toISOString().split('T')[0]}.json`);

                // Lê dados existentes ou inicia com array vazio
                let existingData: ComponentMetric[] = [];
                try {
                    const fileData = await fs.readFile(metricsFile, 'utf-8');
                    existingData = JSON.parse(fileData);
                } catch (e) {
                    // Arquivo não existe ainda, inicia com array vazio
                }

                // Adiciona nova métrica e salva de volta
                existingData.push(metric);
                await fs.writeFile(metricsFile, JSON.stringify(existingData, null, 2));
            } catch (err) {
                console.error('Error saving component metrics locally:', err);
            }
        }

        // Em produção, pode enviar para serviço de analytics
        if (process.env.NODE_ENV === 'production' && process.env.COMPONENT_METRICS_ENDPOINT) {
            try {
                fetch(process.env.COMPONENT_METRICS_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(metric),
                    // Usando keepalive para garantir que a requisição complete mesmo após mudança de página
                    keepalive: true
                }).catch(err => console.error('Error sending to component metrics service:', err));
            } catch (err) {
                // Tratamento de erro não-bloqueante para analytics
                console.error('Failed to send to component metrics endpoint:', err);
            }
        }

        // Resposta de sucesso
        return NextResponse.json({ success: true });

    } catch (error) {
        // Log de erro e resposta de erro
        console.error('Error processing component metrics:', error);
        return NextResponse.json(
            { error: 'Failed to process component metrics' },
            { status: 500 }
        );
    }
}

/**
 * GET handler para recuperar métricas agregadas (apenas em desenvolvimento)
 */
export async function GET(request: NextRequest) {
    // Apenas permite em modo de desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { error: 'Metrics retrieval only available in development mode' },
            { status: 403 }
        );
    }

    try {
        // Lê métricas do arquivo local
        const metricsDir = path.join(os.tmpdir(), 'component-metrics');
        const today = new Date().toISOString().split('T')[0];
        const metricsFile = path.join(metricsDir, `components-${today}.json`);

        let metrics: ComponentMetric[] = [];

        try {
            const fileData = await fs.readFile(metricsFile, 'utf-8');
            metrics = JSON.parse(fileData);
        } catch (e) {
            // Arquivo não existe ou está vazio
        }

        // Calcula estatísticas agregadas
        const stats = metrics.reduce((acc, metric) => {
            const component = metric.component;

            if (!acc[component]) {
                acc[component] = {
                    count: 0,
                    totalTime: 0,
                    avgTime: 0,
                    minTime: Infinity,
                    maxTime: 0,
                };
            }

            acc[component].count++;
            acc[component].totalTime += metric.loadTime;
            acc[component].avgTime = acc[component].totalTime / acc[component].count;
            acc[component].minTime = Math.min(acc[component].minTime, metric.loadTime);
            acc[component].maxTime = Math.max(acc[component].maxTime, metric.loadTime);

            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({
            totalMetrics: metrics.length,
            date: today,
            stats,
        });

    } catch (error) {
        console.error('Error retrieving component metrics:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve component metrics' },
            { status: 500 }
        );
    }
}
