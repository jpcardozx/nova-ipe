'use client';

import { motion } from 'framer-motion';

export default function AnimatedCTASection() {
    return (
        <section className="bg-slate-900 relative overflow-hidden py-20">
            <div className="container mx-auto relative z-10 px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Seu próximo investimento estratégico está aqui
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Transforme suas economias em patrimônio imobiliário.
                    </p>
                    <a 
                        href="#contato" 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quero descobrir oportunidades
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

