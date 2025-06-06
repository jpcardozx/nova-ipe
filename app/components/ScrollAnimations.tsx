'use client';

import { useEffect, type PropsWithChildren } from 'react';

export default function ScrollAnimations({ children }: PropsWithChildren) {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in-section');
        fadeElements.forEach((el) => observer.observe(el));

        // Smooth scroll management
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (typeof targetId === 'string') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    }
                }
            });
        });

        // Parallax effect handling
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');

            parallaxElements.forEach((element) => {
                const speedAttr = element.getAttribute('data-parallax');
                const speed = speedAttr ? parseFloat(speedAttr) : 0.5;
                const yPos = -(scrolled * speed);
                (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            fadeElements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <div className="fade-in-section">{children}</div>;
}
