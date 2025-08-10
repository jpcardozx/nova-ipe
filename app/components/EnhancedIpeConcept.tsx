import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Shield, BarChart3, Building2, Mail, Phone, FileText, Calculator, Award, Target, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function EnhancedIpeConcept() {
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', service: 'consultoria' });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const handleSubmit = () => {
        if (!leadForm.name.trim() || !leadForm.email.trim()) {
            alert('Por favor, preencha nome e e-mail.');
            return;
        }
        alert(`Solicitação recebida. Retornaremos o contato em até 24 horas.`);
        setLeadForm({ name: '', email: '', phone: '', service: 'consultoria' });
    };

    const competencias = [
        {
            icon: <Target className="w-6 h-6" />,
            area: "Análise Territorial Especializada",
            descricao: "Mapeamento estratégico de zonas de valorização com análise preditiva de infraestrutura urbana e potencial de desenvolvimento econômico em Guararema.",
            destaque: "12 anos de experiência local"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            area: "Precificação Técnica Avançada",
            descricao: "Metodologia proprietária de avaliação que combina análise de mercado, tendências econômicas e características arquitetônicas específicas.",
            destaque: "Precisão de 96% em avaliações"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            area: "Due Diligence Completa",
            descricao: "Auditoria jurídica integral incluindo verificação documental, regularidade fiscal, análise de riscos e conformidade regulatória.",
            destaque: "Zero contestações legais"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            area: "Gestão Integral de Transações",
            descricao: "Coordenação completa do processo transacional, desde estruturação da negociação até transferência definitiva de propriedade.",
            destaque: "Prazo médio: 31 dias"
        }
    ];

    const indicadores = [
        {
            valor: "R$ 142M",
            contexto: "Volume transacionado",
            periodo: "2020-2024",
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            valor: "127",
            contexto: "Imóveis comercializados",
            periodo: "Últimos 24 meses",
            icon: <Building2 className="w-5 h-5" />
        },
        {
            valor: "R$ 1,2M",
            contexto: "Ticket médio",
            periodo: "Por transação",
            icon: <Award className="w-5 h-5" />
        },
        {
            valor: "31 dias",
            contexto: "Tempo médio",
            periodo: "Aceite à escritura",
            icon: <CheckCircle className="w-5 h-5" />
        }
    ];

    const beneficios = [
        "Assessoria técnica especializada",
        "Análise de mercado detalhada",
        "Negociação estratégica",
        "Acompanhamento jurídico completo",
        "Suporte pós-venda integral"
    ];

    return (
        <div className="bg-gradient-to-b from-white via-gray-50/30 to-white">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, #E6AA2C 2px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            {/* Content Side */}
                            <div className="space-y-8">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full">
                                    <Award className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-medium text-amber-800">CRECI 45.231-J • Ativo desde 2012</span>
                                </div>

                                {/* Title */}
                                <div className="space-y-4">
                                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                        Assessoria
                                        <span className="block text-transparent bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text">
                                            Imobiliária
                                        </span>
                                        <span className="block text-3xl lg:text-4xl font-normal text-gray-600 mt-2">
                                            Especializada em Guararema
                                        </span>
                                    </h1>

                                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                        Expertise consolidada no mercado imobiliário local, oferecendo
                                        <strong className="text-gray-800"> análises técnicas precisas</strong> e
                                        <strong className="text-gray-800"> acompanhamento integral</strong> em
                                        transações de alta complexidade.
                                    </p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Consultoria Gratuita
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>

                                    <a
                                        href="mailto:contato@ipeimóveis.com.br"
                                        className="group px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all duration-300"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Mail className="w-5 h-5" />
                                            Fale Conosco
                                        </span>
                                    </a>
                                </div>

                                {/* Benefits List */}
                                <div className="space-y-3">
                                    {beneficios.map((beneficio, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{beneficio}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="relative">
                                {/* Main Image */}
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/predioIpe.png"
                                        alt="Escritório Ipê Imóveis - Praça 9 de Julho, 65, Guararema"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={90}
                                        priority
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                    {/* Location Badge */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Nosso Escritório</p>
                                                    <p className="text-sm text-gray-600">Praça 9 de Julho, 65 - Centro</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Stats Card */}
                                <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">12+</div>
                                        <div className="text-sm text-gray-600">Anos de</div>
                                        <div className="text-sm text-gray-600">Experiência</div>
                                    </div>
                                </div>

                                {/* Floating Achievement Badge */}
                                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-4 shadow-lg">
                                    <Award className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Resultados que Comprovam Nossa Excelência
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Números que refletem nosso compromisso com a qualidade e eficiência no mercado imobiliário de Guararema
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {indicadores.map((indicador, index) => (
                                <div
                                    key={index}
                                    className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg transition-colors duration-300 ${hoveredCard === index
                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {indicador.icon}
                                        </div>
                                    </div>

                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                        {indicador.valor}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                        {indicador.contexto}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {indicador.periodo}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Competencies Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Áreas de Especialização
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Competências técnicas desenvolvidas ao longo de mais de uma década de atuação no mercado imobiliário local
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {competencias.map((competencia, index) => (
                                <div
                                    key={index}
                                    className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                            {competencia.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {competencia.area}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {competencia.descricao}
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-700">
                                                    {competencia.destaque}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Solicite uma Consultoria Personalizada
                            </h2>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                Receba uma análise detalhada e orientação estratégica para seu projeto imobiliário
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-2xl">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            Consultoria Técnica Gratuita
                                        </h3>
                                        <p className="text-gray-600">
                                            Preencha os dados e receba retorno em até 24 horas úteis
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Nome completo"
                                                value={leadForm.name}
                                                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Telefone/WhatsApp"
                                                value={leadForm.phone}
                                                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <input
                                            type="email"
                                            placeholder="E-mail"
                                            value={leadForm.email}
                                            onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                        />

                                        <select
                                            value={leadForm.service}
                                            onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                        >
                                            <option value="consultoria">Consultoria Geral</option>
                                            <option value="avaliacao">Avaliação de Imóvel</option>
                                            <option value="venda">Comercialização</option>
                                            <option value="aquisicao">Assessoria em Aquisição</option>
                                        </select>

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            Solicitar Consultoria Gratuita
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                                            Outras Formas de Contato
                                        </h4>
                                    </div>

                                    <div className="space-y-4">
                                        <a
                                            href="tel:+5521990051961"
                                            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 group"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    (11) 99999-9999
                                                </p>
                                                <p className="text-sm text-gray-600">Atendimento via WhatsApp</p>
                                            </div>
                                        </a>

                                        <a
                                            href="mailto:contato@ipeimóveis.com.br"
                                            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 group"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                                    contato@ipeimóveis.com.br
                                                </p>
                                                <p className="text-sm text-gray-600">E-mail institucional</p>
                                            </div>
                                        </a>

                                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                                            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-white">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    Praça 9 de Julho, 65
                                                </p>
                                                <p className="text-sm text-gray-600">Centro - Guararema/SP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}