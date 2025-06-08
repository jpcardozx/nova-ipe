'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

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
        role: 'Proprietária em Guararema',
        content: 'A assessoria da Nova Ipê foi fundamental para a aquisição estratégica do imóvel que atendia precisamente às necessidades da nossa família.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
        name: 'Roberto Almeida',
        role: 'Investidor',
        content: 'Processo conduzido com excelência e transparência. A comercialização foi concluída dentro do prazo estipulado e com rentabilidade superior à projetada inicialmente.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
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
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}                                <div>
                                    <h3 className="font-playfair text-heading-3 text-neutral-900">{testimonial.name}</h3>
                                    {testimonial.role && (
                                        <p className="text-body-2 text-neutral-500">{testimonial.role}</p>
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

                            <p className="text-body-1 text-neutral-700 leading-relaxed">{testimonial.content}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;