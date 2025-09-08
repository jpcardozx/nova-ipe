'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Maria Silva',
    position: 'Founder',
    company: 'TechStart Solutions',
    content: 'João Pedro entregou um trabalho excepcional no desenvolvimento da nossa plataforma. Sua atenção aos detalhes e capacidade de traduzir ideias complexas em soluções elegantes é impressionante.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?auto=format&fit=crop&w=150&q=80',
    project: 'Plataforma SaaS'
  },
  {
    name: 'Carlos Mendes',
    position: 'Product Manager',
    company: 'InnovateLab',
    content: 'Trabalhar com o JP foi uma experiência fantástica. Ele não apenas codifica, mas pensa como um product owner, sempre sugerindo melhorias que agregam valor real ao usuário final.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    project: 'Dashboard Analytics'
  },
  {
    name: 'Ana Costa',
    position: 'Designer UX/UI',
    company: 'Creative Studio',
    content: 'A colaboração entre design e desenvolvimento nunca foi tão fluida. JP entende design e consegue implementar as visões mais complexas mantendo a performance e acessibilidade.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    project: 'E-commerce Luxury'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Testimonials() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            Depoimentos
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            O Que Dizem Sobre Meu Trabalho
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Feedback de clientes e parceiros que tiveram a oportunidade de trabalhar comigo em projetos diversos.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid gap-8 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-emerald-200 h-full">
                {/* Quote icon */}
                <div className="absolute top-6 right-6">
                  <Quote className="h-8 w-8 text-emerald-200 group-hover:text-emerald-300 transition-colors" />
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 leading-relaxed mb-8 relative z-10">
                  "{testimonial.content}"
                </blockquote>

                {/* Project tag */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    📋 {testimonial.project}
                  </span>
                </div>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-amber-200 group-hover:ring-amber-300 transition-colors"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.position}</div>
                    <div className="text-sm font-medium text-amber-600">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Quer ser o próximo a compartilhar uma experiência positiva?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Vamos Conversar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}