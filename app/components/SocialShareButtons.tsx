'use client';

import { usePathname } from 'next/navigation';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';
import WhatsAppShare from './WhatsAppShare';

interface SocialShareProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    className?: string;
    compact?: boolean;
    platforms?: Array<'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'email'>;
    showLabel?: boolean;
    analytics?: boolean;
}

export default function SocialShareButtons({
    title,
    description,
    imageUrl,
    className = '',
    compact = false,
    platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'email'],
    showLabel = true,
    analytics = true,
}: SocialShareProps) {
    const pathname = usePathname();

    // Get current URL with origin for absolute URL
    const getFullUrl = () => {
        return typeof window !== 'undefined'
            ? `${window.location.origin}${pathname || ''}`
            : `https://www.novaipe.com.br${pathname || ''}`;
    };

    // Track share events
    const trackShare = (platform: string) => {
        if (analytics && typeof window !== 'undefined' && 'gtag' in window) {
            // Properly typed gtag
            const gtag = (window as any).gtag;
            if (typeof gtag === 'function') {
                gtag('event', 'share', {
                    method: platform,
                    content_type: pathname?.includes('/imovel/') ? 'property' : 'page',
                    item_id: pathname || '',
                });
            }
        }
    };

    // Share URL generators
    const generateFacebookShareUrl = () => {
        const url = getFullUrl();
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    };

    const generateTwitterShareUrl = () => {
        const url = getFullUrl();
        const text = title || '';
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    };

    const generateLinkedinShareUrl = () => {
        const url = getFullUrl();
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    };

    const generateTelegramShareUrl = () => {
        const url = getFullUrl();
        const text = title || '';
        return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    };

    const generateEmailShareUrl = () => {
        const url = getFullUrl();
        const subject = title || 'Confira este link da Nova Ipê Imobiliária';
        const body = `${description || 'Achei que você poderia se interessar:'}\n\n${url}`;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    // Handle share button clicks
    const handleShare = (platform: string, shareUrl: string) => {
        trackShare(platform);
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    // Common button styles
    const getButtonClass = (platform: string) => {
        const baseClasses = 'flex items-center justify-center rounded-lg transition-colors duration-200';
        const sizeClasses = compact ? 'p-2' : 'py-2 px-4';

        const platformClasses: { [key: string]: string } = {
            facebook: 'bg-[#1877f2] hover:bg-[#0e5fc0] text-white',
            twitter: 'bg-[#1DA1F2] hover:bg-[#0c85d0] text-white',
            linkedin: 'bg-[#0077b5] hover:bg-[#005e93] text-white',
            telegram: 'bg-[#0088cc] hover:bg-[#0069a0] text-white',
            email: 'bg-gray-700 hover:bg-gray-800 text-white',
        };

        return `${baseClasses} ${sizeClasses} ${platformClasses[platform] || ''} ${className}`;
    };

    return (
        <div className="flex flex-wrap gap-2">
            {/* WhatsApp - Using our specialized component */}
            {platforms.includes('whatsapp') && (
                <WhatsAppShare
                    title={title}
                    message={description ? `*${title || 'Nova Ipê Imobiliária'}*\n\n${description}\n\n${getFullUrl()}` : undefined}
                    imageUrl={imageUrl}
                    showLabel={showLabel}
                    size={compact ? 'sm' : 'md'}
                    className={className}
                />
            )}

            {/* Facebook */}
            {platforms.includes('facebook') && (
                <button
                    onClick={() => handleShare('facebook', generateFacebookShareUrl())}
                    className={getButtonClass('facebook')}
                    aria-label="Compartilhar no Facebook"
                >
                    <FaFacebookF className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
                    {showLabel && <span>Facebook</span>}
                </button>
            )}

            {/* Twitter */}
            {platforms.includes('twitter') && (
                <button
                    onClick={() => handleShare('twitter', generateTwitterShareUrl())}
                    className={getButtonClass('twitter')}
                    aria-label="Compartilhar no Twitter"
                >
                    <FaTwitter className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
                    {showLabel && <span>Twitter</span>}
                </button>
            )}

            {/* LinkedIn */}
            {platforms.includes('linkedin') && (
                <button
                    onClick={() => handleShare('linkedin', generateLinkedinShareUrl())}
                    className={getButtonClass('linkedin')}
                    aria-label="Compartilhar no LinkedIn"
                >
                    <FaLinkedinIn className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
                    {showLabel && <span>LinkedIn</span>}
                </button>
            )}

            {/* Telegram */}
            {platforms.includes('telegram') && (
                <button
                    onClick={() => handleShare('telegram', generateTelegramShareUrl())}
                    className={getButtonClass('telegram')}
                    aria-label="Compartilhar no Telegram"
                >
                    <FaTelegramPlane className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
                    {showLabel && <span>Telegram</span>}
                </button>
            )}

            {/* Email */}
            {platforms.includes('email') && (
                <a
                    href={generateEmailShareUrl()}
                    onClick={() => trackShare('email')}
                    className={getButtonClass('email')}
                    aria-label="Compartilhar por Email"
                >
                    <FaEnvelope className={`text-lg ${showLabel ? 'mr-2' : ''}`} />
                    {showLabel && <span>Email</span>}            </a>
            )}
        </div>
    );
}
