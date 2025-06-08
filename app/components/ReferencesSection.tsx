'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Quote, Users } from 'lucide-react';

interface TestimonialProps {
    content: string;
    author: string;
    role: string;
    rating: number;
    image?: string;
}

const testimonials: TestimonialProps[] = [
    {
        content: "A Ipê nos ajudou a encontrar a casa perfeita em Guararema. O conhecimento deles sobre o mercado local é impressionante.",
        author: "Ricardo e Ana Silva",
        role: "Compradores",
        rating: 5,
        image: "/images/testimonials/client1.jpg"
    },
    {
        content: "Profissionalismo excepcional. A equipe da Ipê entende perfeitamente o mercado premium de Guararema.",
        author: "Mariana Santos",
        role: "Investidora",
        rating: 5,
        image: "/images/testimonials/client2.jpg"
    },
    {
        content: "Transparência e expertise em cada etapa da negociação. Recomendo fortemente a Ipê Imóveis.",
        author: "Carlos Eduardo Lima",
        role: "Proprietário",
        rating: 5,
        image: "/images/testimonials/client3.jpg"
    }
];

const stats = [
    { label: "Anos de Experiência", value: "15+" },
    { label: "Imóveis Negociados", value: "1000+" },
    { label: "Clientes Satisfeitos", value: "900+" },
    { label: "Avaliação Média", value: "4.9" }
];

function Testimonial({ content, author, role, rating, image }: TestimonialProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-amber-100/30 border border-amber-100/50 hover:shadow-2xl hover:shadow-amber-200/40 transition-all duration-300"
        >
            <Quote className="w-12 h-12 text-amber-300 mb-6" />

            <p className="text-stone-700 leading-relaxed mb-8 text-lg">{content}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {image ? (
                        <Image
                            src={image}
                            alt={author}
                            width={56}
                            height={56}
                            className="rounded-full ring-2 ring-amber-100"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center ring-2 ring-amber-200">
                            <Users className="w-7 h-7 text-amber-700" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-stone-900 text-lg">{author}</h4>
                        <p className="text-amber-700 font-medium">{role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function ReferencesSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative">                <div className="max-w-4xl mx-auto text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-50 text-amber-800 text-sm font-semibold border border-amber-200 shadow-lg shadow-amber-100/50">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Depoimentos dos Nossos Clientes
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-stone-900 mt-8 mb-6"
                >
                    Histórias de{' '}
                    <span className="text-amber-700">Sucesso</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto"
                >
                    Conheça as experiências reais de quem confiou na Ipê Imóveis para
                    realizar o sonho da casa própria em Guararema.
                </motion.p>
            </div>

                {/* Grid de Depoimentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Testimonial {...testimonial} />
                        </motion.div>
                    ))}
                </div>                {/* Estatísticas Premium */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-12 border border-amber-100 shadow-2xl shadow-amber-100/30"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-amber-700 mb-3 group-hover:text-amber-800 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-stone-600 font-medium text-lg">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
