'use server';

import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface WebVitalMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
    page: string;
    rating?: 'good' | 'needs-improvement' | 'poor';
    timestamp: number;
}

/**
 * Salva métrica de Web Vitals no armazenamento local
 */
export async function saveWebVital(metric: WebVitalMetric) {
    try {
        const metricsDir = path.join(os.tmpdir(), 'web-vitals-metrics');
        await fs.mkdir(metricsDir, { recursive: true });

        const metricsFile = path.join(metricsDir, 'vitals.json');

        // Ler dados existentes
        let existingData: WebVitalMetric[] = [];
        try {
            const fileData = await fs.readFile(metricsFile, 'utf-8');
            existingData = JSON.parse(fileData);
        } catch (e) {
            // Arquivo não existe ainda
        }

        // Classificar a métrica usando Web Vitals Core
        // https://web.dev/vitals/
        const rating = getRating(metric.name, metric.value);

        // Adicionar nova métrica com classificação
        existingData.push({
            ...metric,
            rating
        });

        // Limitar histórico a 1000 métricas para evitar arquivos muito grandes
        if (existingData.length > 1000) {
            existingData = existingData.slice(-1000);
        }

        // Salvar dados atualizados
        await fs.writeFile(metricsFile, JSON.stringify(existingData, null, 2));

        // Em produção, enviar para analytics real
        if (process.env.NODE_ENV === 'production') {
            // TODO: Implementar envio para serviço de analytics
        }

        return { success: true };
    } catch (error) {
        console.error('Error saving web vital:', error);
        return { success: false, error: 'Failed to save metric' };
    }
}

/**
 * Recupera métricas salvas
 */
export async function getWebVitals() {
    try {
        const metricsFile = path.join(os.tmpdir(), 'web-vitals-metrics', 'vitals.json');

        const fileData = await fs.readFile(metricsFile, 'utf-8');
        const metrics = JSON.parse(fileData);

        return {
            success: true,
            metrics
        };
    } catch (error) {
        return {
            success: false,
            metrics: []
        };
    }
}

/**
 * Classifica uma métrica Web Vital com base nos valores recomendados
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (name.toLowerCase()) {
        case 'lcp':
            return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        case 'fid':
            return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        case 'cls':
            return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        case 'ttfb':
            return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        case 'inp':
            return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
        default:
            return value <= 1000 ? 'good' : value <= 2500 ? 'needs-improvement' : 'poor';
    }
}

/**
 * Compara métricas atuais com baseline
 */
export async function compareWithBaseline(metrics: WebVitalMetric[]) {
    const baseline = {
        lcp: 78056, // LCP original era 78056ms
        tbt: 57778, // Thread blocking time original era 57778ms
        pageLoads: {
            alugar: 6860,
            comprar: 6860
        }
    };

    // Calcula médias das métricas atuais
    const currentMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.name]) {
            acc[metric.name] = {
                sum: metric.value,
                count: 1
            };
        } else {
            acc[metric.name].sum += metric.value;
            acc[metric.name].count++;
        }
        return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    // Calcula as melhorias
    const improvements = Object.entries(currentMetrics).map(([name, data]) => {
        const average = data.sum / data.count;
        const baselineValue = name === 'LCP' ? baseline.lcp :
            name === 'TBT' ? baseline.tbt :
                name.includes('load') ? baseline.pageLoads.alugar :
                    null;

        if (!baselineValue) return null;

        const improvement = ((baselineValue - average) / baselineValue) * 100;

        return {
            metric: name,
            baseline: baselineValue,
            current: average,
            improvement: Math.round(improvement * 100) / 100
        };
    }).filter(Boolean);

    return improvements;
}
