'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

export interface Step {
    title: string
    description: string
    icon?: React.ReactNode
}

interface ClientProgressStepsProps {
    steps?: Step[]
    activeStep?: number
}

const defaultSteps: Step[] = [
    {
        title: "Entendendo Suas Necessidades",
        description: "Criamos um perfil personalizado baseado nos seus desejos, estilo de vida e objetivos a longo prazo."
    },
    {
        title: "Curadoria de Imóveis",
        description: "Selecionamos propriedades que verdadeiramente se alinham com suas expectativas e possibilidades financeiras."
    },
    {
        title: "Visitas Estratégicas",
        description: "Acompanhamento personalizado para explorar cada detalhe dos imóveis e visualizar possibilidades."
    },
    {
        title: "Negociação Transparente",
        description: "Assessoria especializada para garantir condições justas e vantajosas em cada proposta."
    },
    {
        title: "Suporte Documental Completo",
        description: "Cuidamos de todos os trâmites legais para uma transação segura e sem complicações."
    }
]

const ClientProgressSteps: React.FC<ClientProgressStepsProps> = ({
    steps = defaultSteps,
    activeStep = -1
}) => {
    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 md:gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex-1 group ${index <= activeStep ? 'opacity-100' : 'opacity-90'}`}
                        >
                            <div className="flex items-start md:items-center md:flex-col">
                                {/* Número ou ícone do passo */}
                                <div className={`
                                    flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl font-bold mb-0 md:mb-4 mr-4 md:mr-0
                                    ${index <= activeStep
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-neutral-100 text-neutral-600'}
                                    transition-all group-hover:shadow-md
                                `}>
                                    {index <= activeStep ? (
                                        <CheckCircle size={24} />
                                    ) : (
                                        step.icon || (index + 1)
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-grow md:text-center">
                                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                                    <p className="text-neutral-600 text-sm">{step.description}</p>
                                </div>
                            </div>

                            {/* Linha conectora */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block h-1 bg-neutral-200 w-full mt-8 mb-6 relative">
                                    <div
                                        className={`absolute top-0 left-0 h-1 bg-primary-500 transition-all duration-500 ease-out`}
                                        style={{ width: index < activeStep ? '100%' : '0%' }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ClientProgressSteps