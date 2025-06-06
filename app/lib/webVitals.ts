'use client';

import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

// Tipos para configuração do webVitals
type WebVitalsParams = {
  path: string;
  analyticsId?: string;
  debug?: boolean;
  reportAllChanges?: boolean;
};

// Função para enviar métricas para o Google Analytics
function sendToAnalytics(
  { name, value, id }: Metric, 
  path: string, 
  analyticsId?: string,
  debug?: boolean
) {
  // Enviar para Google Analytics se configurado
  if (analyticsId && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true, // Não afeta taxa de bounce
      page_path: path,
      debug_mode: debug ? 1 : undefined
    });
  }

  // Log no console em modo debug
  if (debug) {
    console.log(`[Web Vitals] ${name}: ${value} (${id})`);
  }

  // Enviar para endpoint customizado (opcional)
  const metricsEndpoint = process.env['NEXT_PUBLIC_VITALS_ENDPOINT'];
  if (metricsEndpoint) {
    const body = JSON.stringify({
      name,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      id,
      path,
      timestamp: Date.now(),
    });

    // Usar sendBeacon para não bloquear navegação
    if (navigator.sendBeacon) {
      navigator.sendBeacon(metricsEndpoint, body);
    } else {
      // Fallback para fetch
      fetch(metricsEndpoint, {
        body,
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
}

// Função principal para registrar todas as métricas Web Vitals
export function webVitals({ 
  path, 
  analyticsId, 
  debug = false,
  reportAllChanges = false
}: WebVitalsParams) {
  try {    // Cria handler para processamento consistente
    const reportHandler = (metric: Metric) => {
      sendToAnalytics(metric, path, analyticsId, debug);
    };

    // Registra observadores para cada métrica
    // https://web.dev/vitals/
      // Largest Contentful Paint - tempo para renderizar o maior elemento visível
    onLCP(reportHandler, { reportAllChanges });
    
    // Interaction to Next Paint - substitui FID nas versões mais recentes
    onINP(reportHandler, { reportAllChanges });
    
    // Cumulative Layout Shift - soma de todas as mudanças inesperadas de layout
    onCLS(reportHandler, { reportAllChanges });
    
    // First Contentful Paint - primeiro conteúdo significativo renderizado
    onFCP(reportHandler, { reportAllChanges });
    
    // Time to First Byte - tempo até o primeiro byte da resposta
    onTTFB(reportHandler);
    
    // Interaction to Next Paint - responsividade a interações do usuário
    onINP(reportHandler, { reportAllChanges });

  } catch (error) {
    console.error('[Web Vitals] Error initializing metrics:', error);
  }
}

// Função auxiliar para compor classes CSS condicionais
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Utilitário para registrar interação significativa para métricas
export function trackUserInteraction(elementId: string, eventName = 'click') {
  try {
    const element = document.getElementById(elementId);
    if (!element) return;

    const markName = `${elementId}-${eventName}`;
    
    const handler = () => {
      // Registra marca para análise de performance
      performance.mark(markName);
      
      // Envia para analytics se configurado
      if (window.gtag) {
        window.gtag('event', 'user_interaction', {
          event_category: 'Performance',
          event_label: markName,
          interaction_type: eventName,
        });
      }
    };

    element.addEventListener(eventName, handler);
    
    // Retorna função para remover listener
    return () => element.removeEventListener(eventName, handler);
  } catch (error) {
    console.error('[Performance] Error tracking interaction:', error);
    return () => {}; // Retorna noop function
  }
}

// Utilitário para registrar performance de componente
export function measureComponentPerformance(
  componentName: string,
  phase: 'mount' | 'update' | 'render'
) {
  const markName = `${componentName}-${phase}-${Date.now()}`;
  performance.mark(markName);
  
  // Envia para analytics em produção
  if (process.env['NODE_ENV'] === 'production' && window.gtag) {
    window.gtag('event', 'component_performance', {
      event_category: 'Performance',
      event_label: componentName,
      phase: phase,
      timestamp: Date.now()
    });
  }
  
  return markName;
}

// Função para relatar métricas Web Vitals específicas
function reportWebVitals(metric: Metric) {
  if (metric.name === 'FCP') {
    console.log('First Contentful Paint:', metric);
  }
  // Adicione mais condições conforme necessário para outras métricas
}

export default reportWebVitals;
