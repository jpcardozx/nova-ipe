'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareProps {
    title?: string;
    message?: string;
    imageUrl?: string;
    className?: string;
    buttonText?: string;
    fullWidth?: boolean;
    showLabel?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    analytics?: boolean;
    phone?: string; // Optional phone number to send direct message
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
}

export default function WhatsAppShare({
    title,
    message,
    imageUrl,
    className = '',
    buttonText = 'Compartilhar',
    fullWidth = false,
    showLabel = true,
    variant = 'primary',
    size = 'md',
    analytics = true,
    phone,
    utmSource = 'website',
    utmMedium = 'share',
    utmCampaign = 'property'
}: WhatsAppShareProps) {
    const pathname = usePathname();
    const [shared, setShared] = useState(false);

    // Get current URL with origin for absolute URL
    const getFullUrl = useCallback(() => {
        const baseUrl = typeof window !== 'undefined'
            ? window.location.origin
            : 'https://www.novaipe.com.br';

        // Add UTM parameters for tracking
        const url = new URL(`${baseUrl}${pathname}`);
        url.searchParams.append('utm_source', utmSource);
        url.searchParams.append('utm_medium', utmMedium);
        url.searchParams.append('utm_campaign', utmCampaign);

        return url.toString();
    }, [pathname, utmSource, utmMedium, utmCampaign]);    // Build the WhatsApp message
    const buildShareUrl = useCallback(() => {
        const fullUrl = getFullUrl();
        const pageTitle = title || (typeof document !== 'undefined' ? document.title : 'Nova Ipê Imobiliária');

        // Create share text with custom message or default
        const shareText = message ||
            `*${pageTitle}*\n\nAcabei de encontrar este imóvel na Nova Ipê Imobiliária e achei que você poderia se interessar:\n\n${fullUrl}`;

        // If phone is provided, create a direct message link
        if (phone) {
            let formattedPhone = phone.replace(/\D/g, '');
            if (!formattedPhone.startsWith('55')) {
                formattedPhone = `55${formattedPhone}`;
            }
            return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(shareText)}`;
        }

        // Otherwise create a general share link
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    }, [getFullUrl, title, message, phone]);

    // Handle share button click
    const handleShare = () => {
        if (analytics && typeof window !== 'undefined' && 'gtag' in window) {
            // @ts-ignore - Google Analytics tracking
            window.gtag('event', 'share', {
                method: 'whatsapp',
                content_type: 'property',
                item_id: pathname,
            });
        }        // Use Web Share API if available
        if (typeof window !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
            navigator.share({
                title: title || 'Nova Ipê Imobiliária',
                text: message || 'Confira este imóvel',
                url: getFullUrl(),
            })
                .then(() => setShared(true)).catch((error: Error) => {
                    console.log('Error sharing:', error);
                    // Fallback to regular WhatsApp link
                    if (typeof window !== 'undefined') {
                        window.open(buildShareUrl(), '_blank');
                    }
                });
        } else {
            // Regular WhatsApp sharing
            if (typeof window !== 'undefined') {
                window.open(buildShareUrl(), '_blank');
            }
            setShared(true);
        }
    };

    // Generate CSS classes based on variant and size
    const getButtonClasses = () => {
        const baseClasses = 'flex items-center justify-center rounded-lg transition-colors duration-200';
        const widthClass = fullWidth ? 'w-full' : '';

        const variantClasses = {
            primary: 'bg-green-600 hover:bg-green-700 text-white',
            secondary: 'bg-gray-100 hover:bg-gray-200 text-green-700',
            outline: 'border-2 border-green-600 text-green-700 hover:bg-green-50'
        };

        const sizeClasses = {
            sm: 'text-sm py-1 px-3',
            md: 'text-base py-2 px-4',
            lg: 'text-lg py-3 px-6'
        };

        return `${baseClasses} ${widthClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    };

    return (
        <button
            onClick={handleShare}
            className={getButtonClasses()}
            aria-label="Compartilhar no WhatsApp"
        >
            <MessageCircle className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
            {showLabel && <span>{shared ? 'Compartilhado!' : buttonText}</span>}
        </button>
    );
}
