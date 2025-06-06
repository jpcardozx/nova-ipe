'use client';

import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { UnifiedLoading } from './ui/UnifiedComponents';
import BlocoCTAConversao from './client/BlocoCTAConversao';

export default function AnimatedCTASection() {
    return (
        <section className="bg-slate-900 relative overflow-hidden py-20">
            {/* Enhanced background patterns */}
            <div className="absolute inset-0 bg-[url('/images/wood-pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto relative z-10 px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center max-w-4xl mx-auto"
                >                    <Suspense fallback={<UnifiedLoading height="200px" title="Carregando..." />}>                        <BlocoCTAConversao
                    titulo="Seu próximo investimento estratégico está aqui"
                    subtitulo="Transforme suas economias em patrimônio imobiliário. Nossa consultoria especializada garante que você tome a decisão mais inteligente para o seu futuro."
                    ctaText="Quero descobrir oportunidades"
                    ctaLink="#contato"
                />
                    </Suspense>
                </motion.div>
            </div>
        </section>
    );
}
