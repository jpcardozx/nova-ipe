'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Building2,
    Users,
    Calendar,
    Phone,
    Mail,
    Target,
    FileText,
    Camera,
    X
} from 'lucide-react'

interface QuickAction {
    icon: any
    label: string
    color: string
    action: () => void
}

export default function QuickActions() {
    const [isOpen, setIsOpen] = useState(false)

    const quickActions: QuickAction[] = [
        {
            icon: Building2,
            label: 'Novo Imóvel',
            color: 'bg-blue-500 hover:bg-blue-600',
            action: () => {
                window.location.href = '/dashboard/properties?action=create'
                setIsOpen(false)
            }
        },
        {
            icon: Users,
            label: 'Novo Cliente',
            color: 'bg-purple-500 hover:bg-purple-600',
            action: () => {
                window.location.href = '/dashboard/clients?action=create'
                setIsOpen(false)
            }
        },
        {
            icon: Calendar,
            label: 'Agendar Visita',
            color: 'bg-orange-500 hover:bg-orange-600',
            action: () => {
                window.location.href = '/dashboard/appointments?action=create'
                setIsOpen(false)
            }
        },
        {
            icon: Phone,
            label: 'Registrar Ligação',
            color: 'bg-green-500 hover:bg-green-600',
            action: () => {
                // Open call log modal or navigate to leads
                window.location.href = '/dashboard/leads?action=call'
                setIsOpen(false)
            }
        },
        {
            icon: Mail,
            label: 'Enviar Email',
            color: 'bg-pink-500 hover:bg-pink-600',
            action: () => {
                // Open email composer or navigate to campaigns
                window.location.href = '/dashboard/campaigns?action=email'
                setIsOpen(false)
            }
        },
        {
            icon: Target,
            label: 'Nova Campanha',
            color: 'bg-indigo-500 hover:bg-indigo-600',
            action: () => {
                window.location.href = '/dashboard/campaigns?action=create'
                setIsOpen(false)
            }
        },
        {
            icon: FileText,
            label: 'Upload Documento',
            color: 'bg-teal-500 hover:bg-teal-600',
            action: () => {
                window.location.href = '/dashboard/documents?action=upload'
                setIsOpen(false)
            }
        },
        {
            icon: Camera,
            label: 'Adicionar Fotos',
            color: 'bg-yellow-500 hover:bg-yellow-600',
            action: () => {
                // Open photo upload interface
                window.location.href = '/dashboard/properties?action=photos'
                setIsOpen(false)
            }
        }
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-16 right-0 space-y-3"
                    >
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    transition: {
                                        delay: index * 0.05,
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 15
                                    }
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 100,
                                    scale: 0.8,
                                    transition: { delay: (quickActions.length - index - 1) * 0.05 }
                                }}
                                onClick={action.action}
                                className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 group min-w-[160px]`}
                            >
                                <action.icon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium text-sm whitespace-nowrap">
                                    {action.label}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${isOpen
                        ? 'bg-red-500 hover:bg-red-600 rotate-45'
                        : 'bg-amber-500 hover:bg-amber-600 hover:shadow-xl'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Plus className="h-6 w-6 text-white" />
                )}
            </motion.button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-20 z-[-1]"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
