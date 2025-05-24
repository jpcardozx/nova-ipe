'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

/**
 * HighPerformanceHero component
 * A high-performance version of the hero section with optimized images
 * and improved loading strategy
 */
export function HighPerformanceHero() {
    const [selectedIntent, setSelectedIntent] = useState<'invest' | 'live'>('invest');
    const { ref: heroRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen bg-white overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Background with optimized image */}
            <div className="absolute inset-0">
                {/* Used picture element for more browser support with optimized formats */}
                <picture>
                    {/* AVIF format - best compression and quality */}
                    <source
                        type="image/avif"
                        srcSet="/images/optimized/hero-bg-small.avif 640w, 
                    /images/optimized/hero-bg-medium.avif 1280w, 
                    /images/optimized/hero-bg.avif 1920w"
                        sizes="100vw"
                    />
                    {/* WebP format - good fallback with wide support */}
                    <source
                        type="image/webp"
                        srcSet="/images/optimized/hero-bg-small.webp 640w, 
                    /images/optimized/hero-bg-medium.webp 1280w, 
                    /images/optimized/hero-bg.webp 1920w"
                        sizes="100vw"
                    />
                    {/* Original format fallback */}
                    <Image
                        src="/images/hero-bg.png"
                        alt=""
                        fill
                        priority={true}
                        className="object-cover opacity-10"
                        sizes="100vw"
                        aria-hidden="true"
                        loading="eager"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/3"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <h1
                        id="hero-heading"
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6"
                    >
                        Encontre o imóvel dos seus sonhos
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-8">
                        Com décadas de experiência no mercado imobiliário, a Ipê Imóveis é sua melhor escolha para encontrar o lar perfeito.
                    </p>

                    <div className="flex justify-center mt-8 space-x-4">
                        <button
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-lg"
                            onClick={() => setSelectedIntent('invest')}
                        >
                            Quero Investir
                        </button>
                        <button
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-lg"
                            onClick={() => setSelectedIntent('live')}
                        >
                            Quero Morar
                        </button>
                    </div>
                </div>
            </div>        </section>
    );
}

export default HighPerformanceHero;
