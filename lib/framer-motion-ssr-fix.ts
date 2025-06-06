// Simple Framer Motion SSR Fix
'use client';

import React, { useEffect, useState } from 'react';

// Simple client check hook
export const useIsClient = () => {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    return isClient;
};

// Simple motion wrapper that only renders on client
export const ClientOnlyMotion = ({ children }: { children: React.ReactNode }) => {
    const isClient = useIsClient();
    
    if (!isClient) {
        return null;
    }
    
    return React.createElement(React.Fragment, {}, children);
};
