// filepath: app/components/TrustAndCredibilitySection.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from './TrustAndCredibilityData';

export interface TrustAndCredibilitySectionClientProps {
    testimonials: Testimonial[];
}

export default function TrustAndCredibilitySectionClient({ testimonials }: TrustAndCredibilitySectionClientProps) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(id);
    }, [testimonials.length]);

    const current = testimonials[active];

    return (
        <section aria-label="Depoimentos" className="trust-section">
            <AnimatePresence mode="wait">
                <motion.blockquote
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="testimonial"
                >
                    <p>{current.content}</p>
                    <footer>
                        — {current.name}, <span>{current.role}</span>
                    </footer>
                </motion.blockquote>
            </AnimatePresence>
        </section>
    );
}

