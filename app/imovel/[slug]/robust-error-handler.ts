// Middleware global para interceptar e corrigir erros de "Element type is invalid"
import { ComponentType, ReactElement, createElement } from 'react';

// Tipos de erros conhecidos
type ElementTypeError = {
  message: string;
  componentInfo?: any;
  errorBoundary?: boolean;
};

// Interceptador global de erros de componente
const originalConsoleError = console.error;

console.error = function(...args: any[]) {
  const message = args.join(' ');
  
  // Detecta erros de "Element type is invalid"
  if (message.includes('Element type is invalid') || 
      message.includes('Expected a string') ||
      message.includes('or a class/function')) {
    
    console.warn('🚨 Erro de tipo de elemento detectado:', message);
    
    // Adiciona informações de debug
    console.group('🔍 Debug de Element Type Error');
    console.log('Argumentos originais:', args);
    console.log('Stack trace:', new Error().stack);
    console.groupEnd();
    
    // Tenta identificar o componente problemático
    const componentMatch = message.match(/Check the render method of `(\w+)`/);
    if (componentMatch) {
      console.warn(`⚠️ Componente problemático identificado: ${componentMatch[1]}`);
    }
  }
  
  // Chama o console.error original
  originalConsoleError.apply(console, args);
};

// Error Boundary customizado para capturar erros de componente
export class RobustErrorBoundary extends Error {
  componentStack?: string;
  
  constructor(message: string, componentStack?: string) {
    super(message);
    this.name = 'RobustErrorBoundary';
    this.componentStack = componentStack;
  }
}

// Wrapper que protege componentes contra erros de tipo
export function createRobustWrapper<P extends object>(
  Component: ComponentType<P> | null | undefined,
  fallback?: ReactElement
): ComponentType<P> {
  return function RobustWrapper(props: P) {
    try {
      // Valida o componente
      if (!Component) {
        console.warn('⚠️ Componente é null/undefined, usando fallback');
        return fallback || createElement('div', {}, 'Componente não disponível');
      }
      
      if (typeof Component !== 'function') {
        console.warn('⚠️ Componente não é uma função, usando fallback');
        return fallback || createElement('div', {}, 'Tipo de componente inválido');
      }
      
      // Tenta renderizar o componente
      return createElement(Component, props);
      
    } catch (error) {
      console.error('❌ Erro ao renderizar componente wrapper:', error);
      
      // Se é um erro de tipo de elemento, fornece informações detalhadas
      if (error instanceof Error && error.message.includes('Element type is invalid')) {
        console.group('🚨 Element Type Error Detalhado');
        console.log('Componente:', Component);
        console.log('Props:', props);
        console.log('Erro:', error.message);
        console.log('Stack:', error.stack);
        console.groupEnd();
      }
      
      return fallback || createElement('div', {
        style: { 
          padding: '1rem', 
          border: '1px solid #ef4444', 
          borderRadius: '0.5rem',
          backgroundColor: '#fef2f2',
          color: '#dc2626'
        }
      }, `Erro no componente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };
}

// Utilitário para debugging de componentes problemáticos
export function debugElementType(element: any, name: string = 'Unknown') {
  console.group(`🔍 Debug Element Type: ${name}`);
  
  console.log('Element:', element);
  console.log('Type:', typeof element);
  console.log('Constructor:', element?.constructor?.name);
  
  if (element && typeof element === 'object') {
    console.log('$$typeof:', element.$$typeof);
    console.log('_owner:', element._owner);
    console.log('props:', element.props);
    console.log('type:', element.type);
    console.log('key:', element.key);
    console.log('ref:', element.ref);
  }
  
  if (typeof element === 'function') {
    console.log('Function name:', element.name);
    console.log('Function prototype:', element.prototype);
    console.log('Function toString:', element.toString().substring(0, 200));
  }
  
  console.groupEnd();
}

// Validador de props para componentes
export function validateProps(props: any, componentName: string) {
  if (!props || typeof props !== 'object') {
    console.warn(`⚠️ Props inválidas para ${componentName}:`, props);
    return false;
  }
  
  // Verifica por props com valores undefined problemáticos
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined && key !== 'children') {
      console.warn(`⚠️ Prop '${key}' é undefined em ${componentName}`);
    }
    
    if (typeof value === 'function' && !value.name && key !== 'children') {
      console.warn(`⚠️ Prop '${key}' é uma função anônima em ${componentName}`);
    }
  }
  
  return true;
}

// Export do interceptador para uso em desenvolvimento
export const elementTypeErrorInterceptor = {
  install() {
    console.log('🛡️ Element Type Error Interceptor instalado');
  },
  
  uninstall() {
    console.error = originalConsoleError;
    console.log('🛡️ Element Type Error Interceptor removido');
  }
};

// Auto-instala em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  elementTypeErrorInterceptor.install();
}
