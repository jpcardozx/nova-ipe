'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';

interface InViewObserverProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function InViewObserver({ children, className = '', delay = 0 }: InViewObserverProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay) {
                        setTimeout(() => setIsVisible(true), delay);
                    } else {
                        setIsVisible(true);
                    }
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(ref.current);

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, delay]);

    return (
        <div
            ref={ref}
            className={`${className} transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {children}
        </div>
    );
}
