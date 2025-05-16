'use client';

import { useEffect, useState } from 'react';

interface DiagnosticsState {
  timeToFirstByte: number | null;
  domContentLoaded: number | null;
  windowLoaded: number | null;
  firstPaint: number | null;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  firstInputDelay: number | null;
  cumulativeLayoutShift: string | null;
  memoryUsage: number | null;
  resourcesCount: number | null;
  hiddenResources: string[];
  slowResources: Array<{url: string, duration: number, type: string}>;
  blockedMainThread: boolean;
  longestBlockedPeriod?: number;
  renderBlocking: string[];
  timeElapsed?: number;
}

/**
 * Componente para diagnóstico de performance e detecção de problemas de carregamento
 * Útil para identificar problemas específicos em produção
 */
export default function PerformanceDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    timeToFirstByte: null,
    domContentLoaded: null,
    windowLoaded: null,
    firstPaint: null,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    firstInputDelay: null,
    cumulativeLayoutShift: null,
    memoryUsage: null,
    resourcesCount: null,
    hiddenResources: [],
    slowResources: [],
    blockedMainThread: false,
    renderBlocking: []
  });

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Apenas executa se estiver em modo de desenvolvimento ou com parâmetro de depuração
    const isDebugMode = 
      process.env.NODE_ENV === 'development' ||
      window.location.search.includes('debug=performance') ||
      window.location.search.includes('debug=true');
    
    if (!isDebugMode) return;

    // Coleta métricas básicas de tempo
    const collectTimeMetrics = () => {
      const timing = performance.timing as any;
      const now = performance.now();
      
      setDiagnostics(prev => ({
        ...prev,
        timeToFirstByte: timing.responseStart - timing.requestStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        windowLoaded: timing.loadEventEnd > 0 
          ? timing.loadEventEnd - timing.navigationStart 
          : null,
        timeElapsed: now
      }));
    };

    // Coleta métricas de Web Vitals
    const collectWebVitals = () => {
      // Verificar se temos acesso à API de Paint Timing
      if ('performance' in window) {
        // First Paint e First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');

        // Recurso mais lento
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources
          .filter(resource => resource.duration > 300)
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5)
          .map(r => ({ 
            url: r.name.split('/').pop() || '', 
            duration: Math.round(r.duration),
            type: r.initiatorType 
          }));

        // Recursos render-blocking - usando propriedade não padrão em alguns navegadores
        const renderBlocking = resources
          .filter(r => (r as any).renderBlockingStatus === 'blocking')
          .map(r => r.name.split('/').pop() || '');

        // Atualizar diagnóstico
        setDiagnostics(prev => ({
          ...prev,
          firstPaint: firstPaint ? Math.round(firstPaint.startTime) : null,
          firstContentfulPaint: firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : null,
          resourcesCount: resources.length,
          slowResources,
          renderBlocking
        }));
      }
    };

    // Coleta métricas de layout shift
    const collectLayoutShift = () => {
      let clsValue = 0;
      let clsEntries: any[] = [];

      // Registra CLS
      const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          // Apenas se não for causado por interação do usuário
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value || 0;
            clsEntries.push(entry);
          }
        }
        
        setDiagnostics(prev => ({
          ...prev,
          cumulativeLayoutShift: clsValue.toFixed(3)
        }));
      });

      // Tenta observar, mas ignora erros se não for suportado
      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('Layout Shift API não suportada neste navegador');
      }
      
      return () => {
        try {
          observer.disconnect();
        } catch (e) {
          // Ignora erros ao desconectar
        }
      };
    };

    // Coleta LCP
    const collectLCP = () => {
      let lcpObserver: PerformanceObserver | null = null;
      
      try {
        lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lcpEntry = entries[entries.length - 1];
          
          if (lcpEntry) {
            setDiagnostics(prev => ({
              ...prev,
              largestContentfulPaint: Math.round(lcpEntry.startTime)
            }));
          }
        });

        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP API não suportada neste navegador');
      }
      
      return () => {
        if (lcpObserver) {
          try {
            lcpObserver.disconnect();
          } catch (e) {
            // Ignora erros ao desconectar
          }
        }
      };
    };

    // Executa os coletores de diagnóstico
    window.addEventListener('load', collectTimeMetrics);
    let layoutShiftCleanup = () => {};
    let lcpCleanup = () => {};
    
    try {
      layoutShiftCleanup = collectLayoutShift();
      lcpCleanup = collectLCP();
    } catch (e) {
      console.warn('Erro ao coletar métricas de performance:', e);
    }
    
    // Coleta métricas após um pequeno atraso para garantir que tudo carregou
    setTimeout(collectWebVitals, 2000);
    
    // Verificar se a Thread principal está bloqueada
    let lastTimestamp = performance.now();
    let longestBlockedPeriod = 0;
    let animFrameId: number | null = null;
    
    const checkMainThreadBlocking = () => {
      const now = performance.now();
      const timeSinceLastCheck = now - lastTimestamp;
      
      if (timeSinceLastCheck > 100) {
        longestBlockedPeriod = Math.max(longestBlockedPeriod, timeSinceLastCheck);
        
        if (longestBlockedPeriod > 200) {
          setDiagnostics(prev => ({
            ...prev,
            blockedMainThread: true,
            longestBlockedPeriod: Math.round(longestBlockedPeriod)
          }));
        }
      }
      
      lastTimestamp = now;
      animFrameId = requestAnimationFrame(checkMainThreadBlocking);
    };
    
    animFrameId = requestAnimationFrame(checkMainThreadBlocking);

    // Mostra o painel de diagnóstico após 3 segundos
    const showTimeout = setTimeout(() => {
      setShowDiagnostics(true);
    }, 3000);
    
    return () => {
      window.removeEventListener('load', collectTimeMetrics);
      layoutShiftCleanup();
      lcpCleanup();
      clearTimeout(showTimeout);
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  // Não renderiza nada se não estiver no modo de depuração
  if (!showDiagnostics) return null;

  return (
    <div className="fixed bottom-2 right-2 p-4 bg-white/90 border rounded shadow-lg z-50 max-w-md text-xs font-mono">
      <h3 className="font-bold text-sm mb-2">Diagnóstico de Performance</h3>
      <div className="space-y-1">
        {diagnostics.firstContentfulPaint && (
          <p className={diagnostics.firstContentfulPaint > 1800 ? 'text-red-600' : 'text-green-600'}>
            FCP: {Math.round(diagnostics.firstContentfulPaint)}ms
          </p>
        )}
        {diagnostics.largestContentfulPaint && (
          <p className={diagnostics.largestContentfulPaint > 2500 ? 'text-red-600' : 'text-green-600'}>
            LCP: {diagnostics.largestContentfulPaint}ms
          </p>
        )}
        {diagnostics.cumulativeLayoutShift && (
          <p className={Number(diagnostics.cumulativeLayoutShift) > 0.1 ? 'text-red-600' : 'text-green-600'}>
            CLS: {diagnostics.cumulativeLayoutShift}
          </p>
        )}
        {diagnostics.blockedMainThread && diagnostics.longestBlockedPeriod && (
          <p className="text-red-600">
            Thread principal bloqueada: {diagnostics.longestBlockedPeriod}ms
          </p>
        )}
        {diagnostics.renderBlocking?.length > 0 && (
          <div>
            <p className="text-red-600">Recursos bloqueando renderização ({diagnostics.renderBlocking.length}):</p>
            <ul className="pl-2">
              {diagnostics.renderBlocking.slice(0, 3).map((resource, i) => (
                <li key={i} className="truncate">{resource}</li>
              ))}
            </ul>
          </div>
        )}
        {diagnostics.slowResources?.length > 0 && (
          <div>
            <p className="text-yellow-600">Recursos lentos:</p>
            <ul className="pl-2">
              {diagnostics.slowResources.slice(0, 3).map((resource, i) => (
                <li key={i} className="truncate">{resource.url} ({resource.duration}ms)</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button 
        onClick={() => setShowDiagnostics(false)}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </div>
  );
}
