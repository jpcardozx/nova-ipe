// Componente de Debug para identificar componentes undefined
import React from 'react';

const DebugWrapper = ({ children, componentName }: { children: React.ReactNode; componentName: string }) => {
    if (children === undefined) {
        console.error(`🚨 COMPONENTE UNDEFINED DETECTADO: ${componentName}`);
        console.trace();
        return <div style={{ color: 'red', border: '2px solid red', padding: '10px' }}>
            ERROR: Component {componentName} is undefined
        </div>;
    }

    if (typeof children === 'function') {
        try {
            const funcString = (children as Function).toString();
            if (funcString.includes('undefined')) {
                console.error(`🚨 FUNÇÃO RETORNANDO UNDEFINED: ${componentName}`);
                console.trace();
            }
        } catch (error) {
            // Ignore toString errors
        }
    }

    return <>{children}</>;
};

export default DebugWrapper;
