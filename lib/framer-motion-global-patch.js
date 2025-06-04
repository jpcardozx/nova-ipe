// Patch global para Framer Motion - Previne erros de SSR completamente
// Este arquivo deve ser carregado ANTES de qualquer componente que use Framer Motion

'use strict';

// Detecta se estamos no servidor
const isServer = typeof window === 'undefined';

if (isServer) {
    // No servidor, criamos um mock completo do Framer Motion
    const createMockMotion = () => {
        const mockComponent = ({ children, ...props }) => {
            const React = require('react');
            // Remove propriedades específicas do Framer Motion
            const {
                initial,
                animate,
                exit,
                transition,
                variants,
                whileHover,
                whileTap,
                whileInView,
                drag,
                dragConstraints,
                layout,
                layoutId,
                ...safeProps
            } = props;
            
            return React.createElement('div', safeProps, children);
        };

        return new Proxy({}, {
            get: () => mockComponent
        });
    };

    const mockHooks = {
        useAnimation: () => ({ start: () => {}, stop: () => {}, set: () => {} }),
        useInView: () => false,
        useScroll: () => ({ scrollY: { get: () => 0 }, scrollX: { get: () => 0 } }),
        useTransform: () => ({ get: () => 0 }),
        useMotionValue: () => ({ get: () => 0, set: () => {} }),
        useSpring: () => ({ get: () => 0 }),
        useVelocity: () => ({ get: () => 0 }),
        useMotionValueEvent: () => {},
        useAnimationControls: () => ({ start: () => {}, stop: () => {}, set: () => {} }),
        usePresence: () => [true, () => {}],
        useMotionTemplate: () => '',
        useDragControls: () => ({ start: () => {} }),
        useMotionEvent: () => {},
        useReducedMotion: () => false,
        useTime: () => ({ get: () => 0 })
    };

    const mockComponents = {
        motion: createMockMotion(),
        AnimatePresence: ({ children }) => {
            const React = require('react');
            return React.createElement(React.Fragment, {}, children);
        },
        LazyMotion: ({ children }) => {
            const React = require('react');
            return React.createElement(React.Fragment, {}, children);
        },
        MotionConfig: ({ children }) => {
            const React = require('react');
            return React.createElement(React.Fragment, {}, children);
        },
        LayoutGroup: ({ children }) => {
            const React = require('react');
            return React.createElement(React.Fragment, {}, children);
        },
        Reorder: {
            Group: ({ children, ...props }) => {
                const React = require('react');
                const { onReorder, values, axis, ...safeProps } = props;
                return React.createElement('div', safeProps, children);
            },
            Item: ({ children, ...props }) => {
                const React = require('react');
                const { value, ...safeProps } = props;
                return React.createElement('div', safeProps, children);
            }
        },
        ...mockHooks
    };

    // Intercepta o require/import do framer-motion
    const Module = require('module');
    const originalRequire = Module.prototype.require;

    Module.prototype.require = function(...args) {
        if (args[0] === 'framer-motion') {
            return mockComponents;
        }
        return originalRequire.apply(this, args);
    };

    // Para ES modules (se necessário)
    if (typeof globalThis !== 'undefined') {
        globalThis.__FRAMER_MOTION_SSR_PATCHED__ = true;
    }

    console.log('✅ Framer Motion SSR patch aplicado - todos os imports serão seguros no servidor');
}
