'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
        role: 'Comprou imóvel com a Ipê',
        content: 'O atendimento que recebi dos corretores da Ipê foi excepcional. Encontraram a casa dos meus sonhos com todas as características que eu procurava.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
        name: 'Roberto Almeida',
        role: 'Vendeu imóvel com a Ipê',
        content: 'Processo muito profissional e transparente. Venderam meu imóvel em tempo recorde e com valor acima do esperado.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    {
        name: 'Carolina Mendes',
        role: 'Alugou casa de temporada',
        content: 'Excelente experiência! A Nova Ipê entendeu perfeitamente o que eu precisava e encontrou uma opção perfeita para minhas férias.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
    },
];

const TestimonialCard: React.FC<TestimonialProps> = ({
    name,
    role,
    content,
    rating,
    image
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-md"
        >
            <div className="flex items-center mb-4">
                {image && (
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-lg">{name}</h4>
                    {role && (
                        <p className="text-neutral-500 text-sm">{role}</p>
                    )}
                </div>
            </div>

            <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'
                            }`}
                    />
                ))}
            </div>

            <p className="text-neutral-600">{content}</p>
        </motion.div>
    );
};

const TestimonialsSection = () => {
    return (
        <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                ))}
            </div>
        </div>
    );
};

export default TestimonialsSection;
