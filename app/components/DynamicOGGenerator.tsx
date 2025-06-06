// This component creates a dynamic image component that can be used for social media previews
'use client';

import { useEffect, useRef } from 'react';

interface DynamicOGProps {
    title: string;
    location: string;
    price: string;
    imageUrl: string;
    propertyType: 'sale' | 'rent';
}

export default function DynamicOGGenerator({ title, location, price, imageUrl, propertyType }: DynamicOGProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions for OpenGraph image (1200x630)
        canvas.width = 1200;
        canvas.height = 630;

        // Background color
        ctx.fillStyle = '#0D1F2D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create a gradient overlay for design
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(13, 31, 45, 0.85)');
        gradient.addColorStop(1, 'rgba(13, 31, 45, 0.95)');

        // Load the property image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl || '/images/property-placeholder.jpg';

        img.onload = () => {
            // Draw the property image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Apply gradient overlay
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add company logo
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.src = '/images/logo.png';

            logo.onload = () => {
                // Draw logo in top left corner
                ctx.drawImage(logo, 50, 50, 200, 80);

                // Draw property information
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 48px var(--font-montserrat)';
                ctx.fillText(title, 50, 300);

                ctx.font = '32px var(--font-montserrat)';
                ctx.fillText(`${location}`, 50, 360);

                // Draw price with tag background
                ctx.fillStyle = propertyType === 'sale' ? '#10B981' : '#3B82F6';
                ctx.fillRect(50, 400, 400, 70);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 36px var(--font-montserrat)';
                ctx.fillText(`${price}`, 70, 445);

                // Add a badge for property type
                ctx.fillStyle = '#F59E0B';
                ctx.fillRect(50, 490, propertyType === 'sale' ? 220 : 260, 50);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '28px var(--font-montserrat)';
                ctx.fillText(propertyType === 'sale' ? 'À VENDA' : 'PARA ALUGAR', 70, 525);

                // Add a border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

                // Convert to image URL for download
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

                // For debugging - add a download link
                if (process.env.NODE_ENV === 'development') {
                    const link = document.createElement('a');
                    link.download = `property-og-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
        };
    }, [title, location, price, imageUrl, propertyType]);

    return (
        <div style={{ display: 'none' }}>
            <canvas ref={canvasRef} id="og-canvas" />
        </div>
    );
}
