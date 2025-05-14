import React, { FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Step {
    id: string;
    title: string;
    description: string;
}

interface ProgressStepsProps {
    steps: Step[];
    currentStep?: number;
}

const ProgressSteps: FC<ProgressStepsProps> = ({
    steps,
    currentStep = 0
}) => {
    return (
        <div className="py-8">
            <h2 className="text-2xl text-stone-800 font-bold text-center mb-2">
                Sua jornada para o imóvel ideal
            </h2>
            <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
                Navegar pelo mercado imobiliário pode ser complexo. Nossa abordagem simplifica cada etapa do processo.
            </p>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
                {steps.map((step, index) => (
                    <Link
                        href={`#${step.id}`}
                        key={step.id}
                        className="w-full lg:w-1/4"
                        scroll={false}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(step.id);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                    >
                        <motion.div
                            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg border border-stone-100 h-full transition-all"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl mb-4">
                                {index + 1}
                            </div>

                            <h3 className="text-lg font-semibold text-stone-800 mb-2 text-center">
                                {step.title}
                            </h3>

                            <p className="text-stone-600 text-sm text-center mb-4">
                                {step.description}
                            </p>

                            <div className="mt-auto flex items-center text-amber-600 font-medium hover:text-amber-800 transition-colors group">
                                <span>Saiba mais</span>
                                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="hidden lg:flex items-center justify-center mt-8">
                <div className="h-1 bg-amber-100 w-full max-w-3xl rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: '25%' }}
                        animate={{ width: `${25 * (currentStep + 1)}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProgressSteps; 