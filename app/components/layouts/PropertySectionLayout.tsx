import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface PropertySectionLayoutProps extends PropsWithChildren {
    id: string;
    title: string;
    description: string;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    badge?: string;
    titleHighlight?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
}

export function PropertySectionLayout({
    id,
    title,
    description,
    children,
    className,
    headerClassName,
    contentClassName,
    badge,
    titleHighlight,
    viewAllLink,
    viewAllLabel = 'Ver todos'
}: PropertySectionLayoutProps) {
    // Função para destacar parte do título se especificado
    const renderTitle = () => {
        if (!titleHighlight) return title;

        const parts = title.split(titleHighlight);
        return (
            <>
                {parts.map((part, index) => (
                    <>
                        {part}
                        {index < parts.length - 1 && (
                            <span className="text-amber-700">{titleHighlight}</span>
                        )}
                    </>
                ))}
            </>
        );
    };

    return (
        <section id={id} className={twMerge(
            "py-24 relative overflow-hidden",
            className
        )}>            {/* Subtle Background Enhancement */}
            <div className="absolute inset-0">
                {/* Minimal pattern for texture */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header com Animações Refinadas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={twMerge(
                        "mb-16 max-w-3xl mx-auto text-center space-y-6",
                        headerClassName
                    )}
                >
                    {badge && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center"
                        >                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 shadow-sm">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-amber-900 text-sm font-medium tracking-wide">
                                        {badge}
                                    </span>
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-4xl font-bold text-stone-900"
                    >
                        {renderTitle()}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-stone-600 text-lg"
                    >
                        {description}
                    </motion.p>
                </motion.div>

                {/* Conteúdo */}
                <div className={twMerge("relative", contentClassName)}>
                    {children}
                </div>

                {/* Botão Ver Todos */}
                {viewAllLink && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center gap-2 px-6 py-3 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-full font-medium transition-colors shadow-sm"
                        >
                            <span>{viewAllLabel}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
