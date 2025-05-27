'use client';

import { useState, useEffect } from 'react';

interface TrustBadge {
    icon: string;
    title: string;
    description: string;
    stat: string;
}

interface Testimonial {
    quote: string;
    author: string;
    location: string;
    rating: number;
    service: 'venda' | 'compra' | 'aluguel';
}

export const TrustAndCredibilitySection = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const trustBadges: TrustBadge[] = [
        {
            icon: '🏆',
            title: 'Líder do Mercado',
            description: 'Mais vendas em Guararema nos últimos 3 anos',
            stat: '#1 em resultados'
        },
        {
            icon: '⚡',
            title: 'Vendas Rápidas',
            description: 'Tempo médio de venda 40% mais rápido que a média',
            stat: '45 dias médio'
        },
        {
            icon: '💰',
            title: 'Melhor Preço',
            description: 'Conseguimos valores 8% acima da média local',
            stat: '+R$ 35k média'
        },
        {
            icon: '🛡️',
            title: 'Segurança Total',
            description: 'Processo 100% documentado e transparente',
            stat: '0% problemas'
        }
    ];

    const testimonials: Testimonial[] = [
        {
            quote: "Venderam minha casa em 30 dias pelo valor que eu queria. Processo super transparente e profissional.",
            author: "Carlos Montenegro",
            location: "Jardim Florestal",
            rating: 5,
            service: 'venda'
        },
        {
            quote: "Encontraram a casa dos nossos sonhos! Conhecem cada cantinho de Guararema e foram super atenciosos.",
            author: "Família Rodrigues",
            location: "Centro",
            rating: 5,
            service: 'compra'
        },
        {
            quote: "Aluguei meu apartamento rapidinho e com inquilinos de qualidade. Recomendo de olhos fechados!",
            author: "Mariana Costa",
            location: "Itapema",
            rating: 5,
            service: 'aluguel'
        },
        {
            quote: "Profissionais que realmente entendem do mercado local. Me ajudaram a tomar a melhor decisão.",
            author: "Roberto Silva",
            location: "Vila Esperança",
            rating: 5,
            service: 'venda'
        }
    ];

    const objectionBreakers = [
        {
            objection: "Será que conseguem vender pelo preço justo?",
            response: "Histórico comprovado: vendas 8% acima da média do mercado",
            proof: "R$ 120M+ em negócios nos últimos 5 anos"
        },
        {
            objection: "E se demorar muito para vender?",
            response: "Tempo médio de 45 dias - 40% mais rápido que concorrentes",
            proof: "92% dos imóveis vendidos em até 60 dias"
        },
        {
            objection: "Os custos não vão ser altos demais?",
            response: "Transparência total: sem taxas ocultas ou surpresas",
            proof: "Orçamento detalhado antes de qualquer compromisso"
        },
        {
            objection: "Conhecem mesmo o mercado de Guararema?",
            response: "15+ anos atuando exclusivamente na região",
            proof: "Participação em 35% de todas as vendas da cidade"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Comprovado por resultados
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Por que somos a escolha nº1 em Guararema
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Números que comprovam nossa excelência e o compromisso com cada cliente
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {trustBadges.map((badge, index) => (
                        <div
                            key={index}
                            className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:bg-slate-50"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards',
                                opacity: 0
                            }}
                        >
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {badge.icon}
                            </div>
                            <div className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {badge.stat}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {badge.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Testimonials Carousel */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-3xl p-8 lg:p-12 mb-16">
                    <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
                        O que dizem nossos clientes
                    </h3>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative min-h-[200px] flex items-center">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-500 ${index === activeTestimonial
                                            ? 'opacity-100 transform translate-x-0'
                                            : 'opacity-0 transform translate-x-full'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>

                                        <blockquote className="text-xl text-slate-700 mb-6 italic max-w-3xl mx-auto">
                                            "{testimonial.quote}"
                                        </blockquote>

                                        <div className="flex items-center justify-center space-x-4">
                                            <div>
                                                <div className="font-semibold text-slate-900">{testimonial.author}</div>
                                                <div className="text-slate-600 text-sm">{testimonial.location} • {testimonial.service}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center space-x-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Objection Breakers */}
                <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white">
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Suas dúvidas, nossas respostas
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {objectionBreakers.map((item, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <h4 className="text-lg font-semibold mb-3 text-red-300">
                                    💭 "{item.objection}"
                                </h4>
                                <p className="text-blue-200 mb-3 font-medium">
                                    ✅ {item.response}
                                </p>
                                <div className="text-amber-300 text-sm font-semibold">
                                    📊 {item.proof}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-slate-300 mb-4">
                            Ainda tem dúvidas? Fale conosco!
                        </p>
                        <a
                            href="https://wa.me/5511981845016"
                            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                        >
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Tirar dúvidas no WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
