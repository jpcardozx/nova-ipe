'use client';

import { motion } from 'framer-motion';

interface StatItem {
    icon: string;
    number: string;
    label: string;
    description: string;
}

interface AnimatedStatsCardProps {
    item: StatItem;
    index: number;
}

export default function AnimatedStatsCard({ item, index }: AnimatedStatsCardProps) {
    return (
        <motion.div
            className="group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-amber-200 h-full relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                        {item.number}
                    </h3>
                    <p className="text-amber-600 font-semibold mb-4 text-sm uppercase tracking-wide">
                        {item.label}
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
