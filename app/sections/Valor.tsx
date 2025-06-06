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
        title: "Compra e Venda de Imóveis",
        description: "Ajudamos você a encontrar o lar ideal",
        features: [
            "Avaliação gratuita do seu imóvel",
            "Divulgação em todos os portais",
            "Acompanhamento em toda negociação",
            "Suporte com documentação"
        ],
        icon: <Home className="w-6 h-6" />
    },
    {
        id: "consultoria",
        title: "Orientação para Investidores",
        description: "Conselhos práticos para bons investimentos",
        features: [
            "Análise do potencial de valorização",
            "Comparação de oportunidades locais",
            "Orientação sobre custos e benefícios",
            "Relatório simples e claro"
        ],
        icon: <Target className="w-6 h-6" />
    },
    {
        id: "documentacao",
        title: "Apoio com Documentação",
        description: "Cuidamos da burocracia para você",
        features: [
            "Verificação de documentos do imóvel",
            "Orientação sobre regularizações",
            "Apoio na obtenção de certidões",
            "Acompanhamento até a escritura"
        ],
        icon: <FileCheck className="w-6 h-6" />
    }
];

// Certificações e reconhecimentos
const certifications: Certification[] = [
    {
        id: "creci",
        name: "CRECI-SP Ativo",
        description: "Registro profissional válido e atualizado",
        year: "Desde 2010"
    },
    {
        id: "experiencia",
        name: "15 Anos de Experiência",
        description: "Conhecimento profundo do mercado local",
        year: "Desde 2009"
    },
    {
        id: "local",
        name: "Especialistas em Guararema",
        description: "Foco total no mercado da região",
        year: "Desde o início"
    }
];

// Métricas institucionais
const companyMetrics: CompanyMetric[] = [{
    id: "tempo-mercado",
    value: "15 anos",
    label: "De experiência",
    description: "Conhecimento profundo do mercado local",
    icon: <Clock className="w-5 h-5" />
},
{
    id: "transacoes",
    value: "500+",
    label: "Famílias atendidas",
    description: "Clientes que encontraram sua casa ideal",
    icon: <TrendingUp className="w-5 h-5" />
},
{
    id: "satisfacao",
    value: "95%",
    label: "Clientes satisfeitos",
    description: "Famílias que recomendam nossos serviços",
    icon: <Award className="w-5 h-5" />
},
{
    id: "equipe",
    value: "Sempre presentes",
    label: "Atendimento dedicado",
    description: "Equipe local sempre disponível para você",
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
                    >                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 text-amber-800 rounded-full mb-6">
                            <Building2 className="w-5 h-5" />                            <span className="text-sm font-semibold uppercase tracking-wide">
                                Conheça a Ipê
                            </span>
                        </div>                        <h2 className="text-display-1 text-gray-900 mb-6">
                            Nova Ipê Imóveis
                            <span className="block text-amber-600 mt-2">
                                A imobiliária de Guararema
                            </span>
                        </h2>

                        <p className="text-body-large text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Mais de 500 famílias confiaram em nossa
                            <span className="text-amber-600 cursor-pointer"> experiência local</span> para encontrar a casa ideal ou fazer um bom investimento.
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
                                sizes="(min-width: 1024px) 50vw, 100vw" // Added sizes prop
                                priority
                            />                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/70 to-transparent p-6">
                                <h3 className="text-white text-xl font-bold mb-2">
                                    Escritório Central
                                </h3>
                                <p className="text-white/90">
                                    Localizado na região central de Guararema, com atendimento
                                    integrado para compradores e proprietários.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        {companyMetrics.map((metric, index) => (<motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                                    {metric.icon}
                                </div>
                                <div>                                <p className="text-heading-1 text-gray-900">
                                    {metric.value}
                                </p>
                                    <p className="text-body-small medium-text text-gray-700">
                                        {metric.label}
                                    </p>
                                    <p className="text-caption text-gray-500 mt-1">
                                        {metric.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                </div>

                {/* Serviços Oferecidos */}                <div className="mb-20">                    <h3 className="text-display-3 text-gray-900 text-center mb-4">
                    Como podemos ajudar você?
                </h3>                    <p className="text-body text-gray-600 text-center max-w-2xl mx-auto mb-12">
                        Escolha o que você precisa e veja como simplificamos tudo para você.
                    </p>

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
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-8 font-display tracking-tight">
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
                        <h3 className="text-3xl font-bold mb-4 text-white font-display tracking-tight">
                            Pronto para uma experiência imobiliária diferenciada?
                        </h3>

                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-body">
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

const ServiceCard: React.FC<{ service: Service; isActive: boolean; onClick: () => void }> = ({
    service,
    isActive,
    onClick
}) => (
    <motion.button
        onClick={onClick}
        className={cn(
            "w-full p-6 rounded-xl text-left transition-all",
            "border bg-white",
            isActive
                ? "border-primary-200 shadow-lg ring-2 ring-primary-100"
                : "border-neutral-100 shadow-sm hover:shadow-md"
        )}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
    >
        <div className="flex items-start gap-4">
            <div className={cn(
                "p-3 rounded-lg",
                isActive ? "bg-primary-50 text-primary-600" : "bg-neutral-50 text-neutral-400"
            )}>
                {service.icon}
            </div>
            <div>
                <h3 className="text-heading-3 text-neutral-900 font-medium mb-1">{service.title}</h3>
                <p className="text-body-2 text-neutral-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className={cn(
                                "w-4 h-4",
                                isActive ? "text-primary-500" : "text-neutral-400"
                            )} />
                            <span className="text-body-2 text-neutral-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </motion.button>
);

const CertificationCard: React.FC<{ certification: Certification }> = ({ certification }) => (
    <div className="p-6 bg-white rounded-xl border border-neutral-100 shadow-sm">
        <h4 className="text-heading-4 text-neutral-900 font-medium mb-2">{certification.name}</h4>
        <p className="text-body-2 text-neutral-600 mb-3">{certification.description}</p>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="text-body-2 text-neutral-500">{certification.year}</span>
        </div>
    </div>
);

const CompanyMetrics: React.FC<{ metrics: CompanyMetric[] }> = ({ metrics }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
            <div key={metric.id} className="p-6 bg-white rounded-xl border border-neutral-100 shadow-sm">
                <div className="mb-4 p-2 bg-primary-50 text-primary-600 rounded-lg w-fit">
                    {metric.icon}
                </div>
                <h4 className="text-display-3 text-primary-600 font-bold mb-1">{metric.value}</h4>
                <h5 className="text-heading-4 text-neutral-900 font-medium mb-2">{metric.label}</h5>
                <p className="text-body-2 text-neutral-600">{metric.description}</p>
            </div>
        ))}
    </div>
);