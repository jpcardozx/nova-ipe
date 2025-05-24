// Utilitário para validação robusta de componentes React
import React, { ComponentType, ReactElement, createElement } from 'react';

/**
 * Valida se um componente React é válido e funcional
 */
export function isValidReactComponent(component: any): component is ComponentType<any> {
    if (!component) {
        console.warn('⚠️ Componente é null/undefined');
        return false;
    }

    if (typeof component !== 'function') {
        console.warn('⚠️ Componente não é uma função:', typeof component);
        return false;
    }

    // Verifica se tem propriedades de componente React
    if (component.$$typeof && typeof component.$$typeof === 'symbol') {
        return true;
    }

    // Verifica se é um componente funcional válido
    try {
        const testProps = {};
        const result = component(testProps);
        return result !== undefined;
    } catch (error) {
        console.warn('⚠️ Erro ao testar componente:', error);
        return false;
    }
}

/**
 * Seleciona o primeiro componente válido de uma lista de candidatos
 */
export function selectValidComponent<T extends ComponentType<any>>(
    candidates: (T | null | undefined)[],
    fallback?: T
): T {
    for (const candidate of candidates) {
        if (isValidReactComponent(candidate)) {
            console.log('✅ Componente válido selecionado:', candidate.name || 'AnonymousComponent');
            return candidate;
        }
    }

    if (fallback && isValidReactComponent(fallback)) {
        console.log('⚠️ Usando componente fallback:', fallback.name || 'FallbackComponent');
        return fallback;
    }

    throw new Error('❌ Nenhum componente válido encontrado!');
}

/**
 * Wrapper que garante que um componente seja válido antes de renderizar
 */
export function createSafeComponent<P extends object>(
    Component: ComponentType<P>,
    fallbackContent?: ReactElement
): ComponentType<P> {
    const defaultFallback = createElement('div', {}, 'Erro no componente');
    const fallback = fallbackContent || defaultFallback;

    return function SafeComponent(props: P) {
        try {
            if (!isValidReactComponent(Component)) {
                console.error('❌ Componente inválido detectado');
                return fallback;
            }
            return createElement(Component, props);
        } catch (error) {
            console.error('❌ Erro ao renderizar componente:', error);
            return fallback;
        }
    };
}

/**
 * Hook para debugar problemas de componentes
 */
export function debugComponent(component: any, name: string = 'Unknown') {
    console.group(`🔍 Debug Component: ${name}`);
    console.log('Type:', typeof component);
    console.log('Value:', component);
    console.log('Is Valid:', isValidReactComponent(component));

    if (component) {
        console.log('Constructor:', component.constructor?.name);
        console.log('Prototype:', Object.getPrototypeOf(component));
        console.log('Keys:', Object.keys(component));

        if (typeof component === 'function') {
            console.log('Function name:', component.name);
            console.log('Function length:', component.length);
        }
    }

    console.groupEnd();
}
