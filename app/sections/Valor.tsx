'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Shield,
    Award,
    Clock,
    Target,
    Building2,
    CheckCircle,
    Users,
    FileCheck,
    Home,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos
interface Service {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
}

interface Certification {
    id: string;
    name: string;
    description: string;
    year: string;
}

interface CompanyMetric {
    id: string;
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

// Serviços oferecidos
const services: Service[] = [
    {
        id: "compra-venda",
        title: "Intermediação de Compra e Venda",
        description: "Assessoria completa em todas as etapas da negociação",
        features: [
            "Avaliação mercadológica precisa",
            "Marketing digital especializado",
            "Negociação transparente",
            "Acompanhamento jurídico"
        ],
        icon: <Home className="w-6 h-6" />
    },
    {
        id: "consultoria",
        title: "Consultoria Imobiliária",
        description: "Análise estratégica para investimentos e decisões",
        features: [
            "Estudo de viabilidade",
            "Análise de mercado local",
            "Projeções de valorização",
            "Relatórios personalizados"
        ],
        icon: <Target className="w-6 h-6" />
    },
    {
        id: "documentacao",
        title: "Gestão Documental",
        description: "Segurança jurídica em todas as transações",
        features: [
            "Verificação de documentação",
            "Regularização imobiliária",
            "Certidões e registros",
            "Acompanhamento cartorial"
        ],
        icon: <FileCheck className="w-6 h-6" />
    }
];

// Certificações e reconhecimentos
const certifications: Certification[] = [
    {
        id: "creci",
        name: "CRECI-SP 12.345-J",
        description: "Registro ativo no Conselho Regional",
        year: "Desde 2010"
    },
    {
        id: "cofeci-alterar(inexistente)",
        name: "Certificação COFECI",
        description: "Padrão nacional de excelência",
        year: "Renovada em 2024"
    },
    {
        id: "abmi(alterar(inexistente))",
        name: "Membro ABMI",
        description: "Associação Brasileira do Mercado Imobiliário",
        year: "Desde 2015"
    }
];

// Métricas institucionais
const companyMetrics: CompanyMetric[] = [
    {
        id: "tempo-mercado",
        value: "15 anos",
        label: "No mercado",
        description: "Experiência consolidada em Guararema",
        icon: <Clock className="w-5 h-5" />
    },
    {
        id: "transacoes",
        value: "500+",
        label: "Transações Imobiliárias",
        description: "Negócios concretizados com sucesso",
        icon: <TrendingUp className="w-5 h-5" />
    },
    {
        id: "satisfacao",
        value: "98%",
        label: "Satisfação",
        description: "Índice de clientes satisfeitos",
        icon: <Award className="w-5 h-5" />
    },
    {
        id: "equipe",
        value: "Equipe Especializada",
        label: "Atendimento rápido e personalizado",
        description: "Corretores com conhecimento do mercado local",
        icon: <Users className="w-5 h-5" />
    }
];

export default function ApresentacaoInstitucional() {
    const [selectedService, setSelectedService] = useState<string>("compra-venda");

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Institucional */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 text-amber-800 rounded-full mb-6">
                            <Building2 className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wide">
                                Conheça a Nova Ipê
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Excelência em negócios imobiliários
                            <span className="block text-amber-600 mt-2">
                                há mais de uma década
                            </span>
                        </h2>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Somos a principal referência imobiliária de Guararema,
                            combinando tradição, inovação e conhecimento profundo do mercado local.
                        </p>
                    </motion.div>
                </div>

                {/* Imagem do Prédio e Métricas */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede Nova Ipê Imobiliária"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h3 className="text-white text-xl font-bold mb-2">
                                    Nossa Sede
                                </h3>
                                <p className="text-white/90">
                                    Localizada no coração de Guararema, nossa estrutura
                                    oferece atendimento completo e personalizado.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        {companyMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                                        {metric.icon}
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {metric.value}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {metric.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {metric.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Serviços Oferecidos */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Nossos Serviços
                    </h3>

                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={cn(
                                    "p-6 rounded-xl border-2 text-left transition-all duration-300",
                                    selectedService === service.id
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-gray-200 bg-white hover:border-amber-200"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "p-3 rounded-lg transition-colors",
                                        selectedService === service.id
                                            ? "bg-amber-600 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            {service.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Detalhes do serviço selecionado */}
                    {selectedService && (
                        <motion.div
                            key={selectedService}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-2xl p-8"
                        >
                            {services.find(s => s.id === selectedService) && (
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-6">
                                        O que inclui este serviço:
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {services.find(s => s.id === selectedService)?.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Certificações e Credibilidade */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-16">
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Certificações e Credibilidade
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="bg-white rounded-xl p-6 text-center">
                                <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                                <h4 className="font-bold text-gray-900 mb-2">
                                    {cert.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {cert.description}
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                    {cert.year}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-gray-700 mb-6">
                            Todos os nossos corretores possuem CRECI ativo e participam
                            regularmente de cursos de atualização profissional.
                        </p>
                        <a
                            href="/equipe"
                            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
                        >
                            Conheça nossa equipe
                            <CheckCircle className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* CTA Institucional */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-10 text-white max-w-3xl mx-auto">
                        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold mb-4 text-white">
                            Pronto para uma experiência imobiliária diferenciada?
                        </h3>

                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Agende uma visita ao nosso escritório ou solicite uma consultoria
                            personalizada. Nossa equipe está pronta para atender suas demandas.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contato"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                            >
                                Agendar atendimento
                            </a>
                            <a
                                href="/portfolio"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
                            >
                                Ver portfólio de imóveis
                            </a>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-sm text-gray-400">
                                Atendimento: Segunda a Sexta das 9h às 18h | Sábado das 9h às 13h<br />
                                Rua Dona Laurinda, 65 - Centro, Guararema/SP
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}