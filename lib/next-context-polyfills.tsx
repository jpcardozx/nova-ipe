'use client';

import React, { createContext, useState, type ReactNode } from 'react';

interface ActionQueueContextType {
    ping: () => void;
    invalidate: () => void;
    refresh: () => void;
    reset: () => void;
}

const defaultActionQueue: ActionQueueContextType = {
    ping: () => { },
    invalidate: () => { },
    refresh: () => { },
    reset: () => { },
};

export const ActionQueueContext = createContext(defaultActionQueue);

interface Props {
    children: ReactNode;
}

interface State {
    lastPing: number;
}

export function NextContextProvider({ children }: Props): JSX.Element {
    const [state, setState] = useState<State>({
        lastPing: 0,
    });

    const value: ActionQueueContextType = {
        ping: () => setState(prev => ({ ...prev, lastPing: Date.now() })),
        invalidate: () => { },
        refresh: () => { },
        reset: () => { },
    };

    return (
        <ActionQueueContext.Provider value={value}>
            {children}
        </ActionQueueContext.Provider>
    );
}
