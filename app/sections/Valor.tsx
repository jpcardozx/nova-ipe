'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Users, BarChart } from 'lucide-react';

// Feature box component
interface FeatureBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
}

const FeatureBox = ({ icon, title, description, delay = 0 }: FeatureBoxProps) => (
    <motion.div
        className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
    >
        <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
            {icon}
        </div>

        <h3 className="text-xl font-bold text-stone-800 mb-3">
            {title}
        </h3>

        <p className="text-stone-600 flex-grow">
            {description}
        </p>
    </motion.div>
);

export default function Valor() {
    const features = [
        {
            icon: <ShieldCheck className="w-7 h-7" />,
            title: "Transparência Genuína",
            description: "Transmitimos informações completas e precisas sobre cada propriedade, para que suas decisões sejam baseadas em confiança e clareza."
        },
        {
            icon: <Sparkles className="w-7 h-7" />,
            title: "Seleção Criteriosa",
            description: "Cada imóvel em nosso portfólio passa por uma rigorosa avaliação de qualidade construtiva, localização e potencial de valorização."
        },
        {
            icon: <Users className="w-7 h-7" />,
            title: "Relacionamento Humano",
            description: "Construímos conexões genuínas para entender profundamente suas necessidades e encontrar o imóvel que realmente faz sentido para você."
        },
        {
            icon: <BarChart className="w-7 h-7" />,
            title: "Expertise Regional",
            description: "Nosso conhecimento aprofundado sobre Guararema permite orientações precisas sobre bairros, tendências e oportunidades exclusivas."
        }
    ];

    return (
        <section id="values" className="py-20 bg-gradient-to-b from-white to-stone-50 scroll-mt-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-amber-600 font-medium text-sm uppercase tracking-wider mb-2 inline-block">
                                O Que Nos Define
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6">
                                Compromissos que sustentam nossa trajetória
                            </h2>

                            <p className="text-stone-600 mb-8 text-lg">
                                Na Nova Ipê, acreditamos que um imóvel é mais que uma construção física –
                                é o cenário para momentos importantes da sua vida. Buscamos conectar pessoas
                                a espaços que refletem suas aspirações e estilo de vida.
                            </p>

                            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="/images/hero-bg.jpg"
                                    alt="Equipe da Nova Ipê Imobiliária"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="text-white">
                                        <p className="font-medium text-xl mb-2">Equipe Nova Ipê</p>
                                        <p className="text-white/90 text-sm">Especialistas apaixonados por conectar pessoas a lugares</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <FeatureBox
                                key={feature.title}
                                {...feature}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}