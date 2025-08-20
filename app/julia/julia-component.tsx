'use client'

import { motion } from 'framer-motion'
import { Instagram, Linkedin, Globe, Home, Phone, MessageCircle } from 'lucide-react'

export default function JuliaLinktree() {

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Olá Julia! Vi seu perfil e tenho interesse em conversar sobre imóveis em Guararema.')
        window.open(`https://wa.me/5511981024749?text=${message}`, '_blank')
    }

    const links = [
        {
            title: 'Conversar no WhatsApp',
            subtitle: 'Atendimento rápido e personalizado',
            icon: <MessageCircle className="w-6 h-6" />,
            action: handleWhatsApp,
            color: 'bg-gradient-to-r from-green-500 to-teal-500'
        },
        {
            title: 'Ver Imóveis Disponíveis',
            subtitle: 'Catálogo completo de casas, terrenos e sítios',
            icon: <Home className="w-6 h-6" />,
            action: () => window.open('https://imobiliariaipe.com.br/catalogo', '_blank'),
            color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        },
        {
            title: 'Site da Ipê Imóveis',
            subtitle: 'Conheça mais sobre nosso trabalho',
            icon: <Globe className="w-6 h-6" />,
            action: () => window.open('https://imobiliariaipe.com.br', '_blank'),
            color: 'bg-gradient-to-r from-amber-500 to-orange-500'
        }
    ]

    const socialLinks = [
        {
            name: 'Instagram',
            url: 'https://instagram.com/julia.ipeimoveis',
            icon: <Instagram className="w-5 h-5" />,
            color: 'from-pink-500 to-purple-600'
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/julia-mello-imoveis',
            icon: <Linkedin className="w-5 h-5" />,
            color: 'from-blue-600 to-blue-800'
        }
    ]

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="max-w-lg mx-auto px-4 py-10"
            >
                
                {/* Header */}
                <header className="text-center mb-10">
                    <div className="relative w-36 h-36 mx-auto mb-5">
                        <motion.div 
                            className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-1 shadow-2xl"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="w-full h-full rounded-full bg-slate-900 p-1">
                                <img 
                                    src="/images/julia.png" 
                                    alt="Julia de Mello" 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Julia de Mello</h1>
                    <h2 className="text-xl font-medium text-amber-300 mb-4">Corretora de Imóveis em Guararema</h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Especialista em encontrar o imóvel ideal para você e sua família, com transparência e dedicação.
                    </p>
                </header>

                {/* Links Principais */}
                <section className="space-y-4 mb-10">
                    {links.map((link, index) => (
                        <motion.button
                            key={link.title}
                            onClick={link.action}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className={`w-full ${link.color} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-left`}
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                    {link.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white">{link.title}</h3>
                                    <p className="text-sm text-white/80">{link.subtitle}</p>
                                </div>
                                <motion.div whileHover={{ x: 2, rotate: 5 }}>
                                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.button>
                    ))}
                </section>

                {/* Redes Sociais e Contato */}
                <footer className="text-center">
                    <p className="text-slate-400 mb-4">Me encontre nas redes sociais:</p>
                    <div className="flex justify-center gap-5 mb-8">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -3 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                className={`p-3 rounded-full bg-gradient-to-br ${social.color} shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>

                    <div className="text-slate-500 text-sm space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4 text-amber-400" />
                            <span>(11) 98102-4749</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <img src="/images/ipeLogo.png" alt="Ipê Imóveis" className="w-4 h-4 opacity-70"/>
                            <span>Corretora Parceira Ipê Imóveis</span>
                        </div>
                        <p>CRECI: 123.456-F</p>
                    </div>
                </footer>

            </motion.div>
        </div>
    )
}
