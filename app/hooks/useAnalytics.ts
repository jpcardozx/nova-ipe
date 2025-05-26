import { useEffect, useCallback } from 'react';
'use client';

import { getScrollPercentage } from '../utils/scroll-helper';

// Tipos para eventos de analytics
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number | undefined;
  custom_parameters?: Record<string, any>;
}

interface PropertyViewEvent {
  property_id: string;
  property_type: 'sale' | 'rent';
  price?: number;
  location?: string;
}

interface LeadEvent {
  lead_type: 'contact_form' | 'whatsapp' | 'phone' | 'email';
  property_id?: string;
  source_page: string;
}

interface ConversionEvent {
  conversion_type: 'form_submit' | 'phone_click' | 'whatsapp_click' | 'property_inquiry';
  value?: number;
  currency?: string;
}

/**
 * Hook para tracking de analytics com eventos tipados
 * Suporta Google Analytics 4, Facebook Pixel e eventos customizados
 */
export function useAnalytics() {
  // Verificar se o analytics está habilitado
  const isAnalyticsEnabled = typeof window !== 'undefined' && 
    process.env['NEXT_PUBLIC_ENABLE_ANALYTICS'] === 'true';

  // Função para enviar evento para GA4
  const sendToGA4 = useCallback((event: AnalyticsEvent) => {
    if (!isAnalyticsEnabled || typeof window === 'undefined') return;

    try {
      if (window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          ...(typeof event.value === 'number' ? { value: event.value } : {}),
          ...event.custom_parameters
        });
      }
    } catch (error) {
      console.warn('Erro ao enviar evento para GA4:', error);
    }
  }, [isAnalyticsEnabled]);

  // Função para enviar evento para Facebook Pixel
  const sendToFacebookPixel = useCallback((event: string, parameters?: any) => {
    if (!isAnalyticsEnabled || typeof window === 'undefined') return;

    try {
      if ((window as any).fbq) {
        (window as any).fbq('track', event, parameters);
      }
    } catch (error) {
      console.warn('Erro ao enviar evento para Facebook Pixel:', error);
    }
  }, [isAnalyticsEnabled]);

  // Evento: Visualização de imóvel
  const trackPropertyView = useCallback((data: PropertyViewEvent) => {
    sendToGA4({
      action: 'view_item',
      category: 'property',
      label: data.property_id,
      value: typeof data.price === 'number' ? data.price : undefined,
      custom_parameters: {
        item_id: data.property_id,
        item_category: data.property_type,
        location: data.location,
        currency: 'BRL'
      }
    });

    sendToFacebookPixel('ViewContent', {
      content_ids: [data.property_id],
      content_type: 'product',
      value: data.price,
      currency: 'BRL'
    });
  }, [sendToGA4, sendToFacebookPixel]);

  // Evento: Geração de lead
  const trackLead = useCallback((data: LeadEvent) => {
    sendToGA4({
      action: 'generate_lead',
      category: 'lead',
      label: data.lead_type,
      custom_parameters: {
        lead_type: data.lead_type,
        property_id: data.property_id,
        source_page: data.source_page
      }
    });

    sendToFacebookPixel('Lead', {
      content_name: data.lead_type,
      source: data.source_page
    });
  }, [sendToGA4, sendToFacebookPixel]);

  // Evento: Conversão
  const trackConversion = useCallback((data: ConversionEvent) => {
    sendToGA4({
      action: data.conversion_type,
      category: 'conversion',
      ...(typeof data.value === 'number' ? { value: data.value } : {}),
      custom_parameters: {
        currency: data.currency || 'BRL',
        conversion_type: data.conversion_type
      }
    });

    // Eventos específicos do Facebook Pixel
    switch (data.conversion_type) {
      case 'form_submit':
        sendToFacebookPixel('SubmitApplication');
        break;
      case 'property_inquiry':
        sendToFacebookPixel('Contact');
        break;
      default:
        sendToFacebookPixel('Lead');
    }
  }, [sendToGA4, sendToFacebookPixel]);

  // Evento: Clique em botão
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    sendToGA4({
      action: 'click',
      category: 'button',
      label: buttonName,
      custom_parameters: {
        button_name: buttonName,
        page_location: location
      }
    });
  }, [sendToGA4]);

  // Evento: Scroll profundo
  const trackDeepScroll = useCallback((percentage: number) => {
    sendToGA4({
      action: 'scroll',
      category: 'engagement',
      label: `${percentage}%`,
      ...(typeof percentage === 'number' ? { value: percentage } : {})
    });
  }, [sendToGA4]);

  // Evento: Tempo na página
  const trackTimeOnPage = useCallback((seconds: number, pagePath: string) => {
    sendToGA4({
      action: 'timing_complete',
      category: 'engagement',
      label: pagePath,
      ...(typeof seconds === 'number' ? { value: seconds } : {}),
      custom_parameters: {
        name: 'page_view_time',
        value: seconds
      }
    });
  }, [sendToGA4]);

  // Evento: Erro capturado
  const trackError = useCallback((error: string, location: string) => {
    sendToGA4({
      action: 'exception',
      category: 'error',
      label: error,
      custom_parameters: {
        description: error,
        fatal: false,
        location
      }
    });
  }, [sendToGA4]);

  // Auto-tracking de scroll profundo
  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    let hasTracked25 = false;
    let hasTracked50 = false;
    let hasTracked75 = false;
    let hasTracked90 = false;
    
    const handleScroll = () => {
      const scrollPercentage = getScrollPercentage();

      if (scrollPercentage >= 25 && !hasTracked25) {
        hasTracked25 = true;
        trackDeepScroll(25);
      } else if (scrollPercentage >= 50 && !hasTracked50) {
        hasTracked50 = true;
        trackDeepScroll(50);
      } else if (scrollPercentage >= 75 && !hasTracked75) {
        hasTracked75 = true;
        trackDeepScroll(75);
      } else if (scrollPercentage >= 90 && !hasTracked90) {
        hasTracked90 = true;
        trackDeepScroll(90);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAnalyticsEnabled, trackDeepScroll]);

  // Auto-tracking de tempo na página
  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    const startTime = Date.now();
    const pagePath = window.location.pathname;

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      if (timeOnPage > 10) { // Só trackear se passou mais de 10 segundos
        trackTimeOnPage(timeOnPage, pagePath);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnalyticsEnabled, trackTimeOnPage]);

  return {
    // Eventos específicos
    trackPropertyView,
    trackLead,
    trackConversion,
    trackButtonClick,
    trackDeepScroll,
    trackTimeOnPage,
    trackError,
    
    // Evento genérico
    trackEvent: sendToGA4,
    
    // Estado
    isEnabled: isAnalyticsEnabled
  };
}

// Hook para tracking automático de Web Vitals
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined' || 
        process.env['NEXT_PUBLIC_ENABLE_WEB_VITALS'] !== 'true') {
      return;
    }    // Importar Web Vitals dinamicamente
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      const sendToAnalytics = (metric: any) => {
        if (window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true
          });
        }

        // Log para debug em desenvolvimento
        if (process.env['NEXT_PUBLIC_VITALS_DEBUG'] === 'true') {
          console.log('Web Vital:', metric);
        }
      };      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });
  }, []);
}

// Tipos para declaração global do gtag
declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js" | "set" | "consent",
      targetId: string, // Adjusted to string based on gtag.d.ts, Date might have been an error
      config?: { [key: string]: any; } | undefined
    ) => void;
    fbq?: (...args: any[]) => void; // Added fbq for completeness if Facebook Pixel is used
  }
}

export {}; // Ensures this file is treated as a module
