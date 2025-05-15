'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialProps {
    name: string;
    role?: string;
    content: string;
    rating: number;
    image?: string;
}

const testimonials: TestimonialProps[] = [
    {
        name: 'Ana Silva',
        role: 'Comprou imóvel em Guararema',
        content: 'O atendimento da Nova Ipê foi excepcional. Encontraram a casa dos meus sonhos com todas as características que eu procurava.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
        name: 'Roberto Almeida',
        role: 'Vendeu imóvel com a Nova Ipê',
        content: 'Processo muito profissional e transparente. Venderam meu imóvel em tempo recorde e com valor acima do esperado.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    {
        name: 'Carolina Mendes',
        role: 'Cliente de aluguel',
        content: 'Encontrei um apartamento perfeito para alugar. A equipe da Nova Ipê simplificou todo o processo burocrático.',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 bg-neutral-50">
            <div className="container">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-neutral-100"
                        >
                            <div className="flex items-center mb-4">
                                {testimonial.image && (
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                    {testimonial.role && (
                                        <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-neutral-700">{testimonial.content}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection; 