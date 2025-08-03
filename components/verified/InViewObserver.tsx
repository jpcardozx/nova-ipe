'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';

interface InViewObserverProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

function InViewObserver({ children, className = '', delay = 0 }: InViewObserverProps) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsInView(true), delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={className}>
            {isInView && children}
        </div>
    );
}

export default InViewObserver;