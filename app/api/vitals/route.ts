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
    page: string;
    rating?: 'good' | 'needs-improvement' | 'poor';
    timestamp?: number;
    // Propriedades adicionais
    userAgent?: string;
    deviceType?: string;
    connection?: string;
    viewport?: string;
    metricName?: string;
    metricValue?: number;
    status?: string;
    path?: string;
}

/**
 * Processa métricas recebidas de Web Vitals
 */
export async function POST(request: NextRequest) {
    try {
        // Parse body
        const body = await request.json();

        // Normalize data structure (to handle different formats)
        const metric: WebVitalMetric = {
            name: body.name || body.metricName || 'unknown',
            value: Number(body.value || body.metricValue || 0),
            delta: Number(body.delta || 0),
            id: body.id || crypto.randomUUID(),
            page: body.page || body.path || request.nextUrl.pathname,
            rating: body.rating || body.status,
            timestamp: body.timestamp || Date.now(),
            // Additional context
            userAgent: request.headers.get('user-agent') || undefined,
            connection: request.headers.get('connection-type') || undefined,
            viewport: request.headers.get('viewport-width')
                ? `${request.headers.get('viewport-width')}x${request.headers.get('viewport-height')}`
                : undefined
        };

        // Determine metric source
        const isRealUser = !request.headers.get('user-agent')?.includes('bot')
            && !request.headers.get('user-agent')?.includes('spider')
            && !request.headers.get('user-agent')?.includes('crawler');

        // Write to log in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)} ms | Page: ${metric.page} | ${metric.rating || 'Unknown'}`);

            // Store metrics locally in development for analysis
            try {
                const metricsDir = path.join(os.tmpdir(), 'web-vitals-metrics');
                await fs.mkdir(metricsDir, { recursive: true });

                const metricsFile = path.join(metricsDir, `vitals-${new Date().toISOString().split('T')[0]}.json`);

                // Read existing data
                let existingData: WebVitalMetric[] = [];
                try {
                    const fileData = await fs.readFile(metricsFile, 'utf-8');
                    existingData = JSON.parse(fileData);
                } catch (e) {
                    // File doesn't exist yet, start with empty array
                }

                // Add new metric and write back
                existingData.push(metric);
                await fs.writeFile(metricsFile, JSON.stringify(existingData, null, 2));
            } catch (err) {
                console.error('Error saving metrics locally:', err);
            }
        }

        // Integration with analytics services in production
        if (process.env.NODE_ENV === 'production' && isRealUser) {
            // TODO: Send to analytics service like Google Analytics or Vercel Analytics

            // Example of sending to a custom endpoint (e.g. application monitoring)
            if (process.env.ANALYTICS_ENDPOINT) {
                try {
                    fetch(process.env.ANALYTICS_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(metric),
                        // Using keepalive to ensure the request completes even after page unload
                        keepalive: true
                    }).catch(err => console.error('Error sending to analytics:', err));
                } catch (err) {
                    // Non-blocking error handling for analytics
                    console.error('Failed to send to analytics endpoint:', err);
                }
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
