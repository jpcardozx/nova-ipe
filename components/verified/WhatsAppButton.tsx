'use client';

import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import SafeHydration from './SafeHydration';

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
    pulseAnimation?: boolean;
    showAfterScroll?: boolean;
    className?: string;
}

export default function WhatsAppButton({
    phoneNumber,
    message = 'Olá! Quero descobrir oportunidades selecionadas de investimento imobiliário em Guararema (via site)',
    pulseAnimation = true,
    showAfterScroll = true,
    className = '',
}: WhatsAppButtonProps) {
    const [isVisible, setIsVisible] = useState(!showAfterScroll);
    const [isBusinessHours, setIsBusinessHours] = useState(false);
    const ref = React.useRef(null);

    // Verifica se está dentro do horário comercial
    useEffect(() => {
        const checkBusinessHours = () => {
            const now = new Date();
            const hours = now.getHours();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

            // Segunda a Sexta (1-5), das 8:30 às 18:00
            const isWeekday = day >= 1 && day <= 5;
            const isWorkingHours = (hours >= 8 && hours < 18) || (hours === 8 && now.getMinutes() >= 30);

            setIsBusinessHours(isWeekday && isWorkingHours);
        };

        // Verifica horário comercial no mount e a cada minuto
        checkBusinessHours();
        const interval = setInterval(checkBusinessHours, 60000);

        return () => clearInterval(interval);
    }, []);

    // Quando o usuário rola 60% da página, mostrar botão
    useEffect(() => {
        if (!showAfterScroll) return;

        function handleScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);

            if (scrollPercent > 0.6) {
                setIsVisible(true);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showAfterScroll]); const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

    // Só mostra o botão se estiver visível E dentro do horário comercial
    const shouldShow = isVisible && isBusinessHours;

    return (<SafeHydration>
        <div ref={ref} className={`fixed bottom-24 right-8 z-40 ${shouldShow ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ${className}`}>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
              flex items-center justify-center gap-2 
              bg-gradient-to-r from-green-500 to-green-600
              text-white text-base font-medium
              py-3 px-4 rounded-full shadow-lg hover:shadow-xl
              transition-all duration-200 hover:-translate-y-1
              ${pulseAnimation ? 'animate-pulse-subtle' : ''}
            `}
                aria-label="Conversar no WhatsApp"
            >
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full">
                    <Phone className="w-4 h-4" />
                </div>
                <span>Consultor online</span>
            </a>
        </div>
    </SafeHydration>
    );
}

