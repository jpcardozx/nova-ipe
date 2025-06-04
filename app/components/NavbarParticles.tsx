'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const novaIpeColors = {
    primary: { ipe: '#E6AA2C', ipeLight: '#F7D660', ipeDark: '#B8841C' },
    earth: { brown: '#8B4513', brownLight: '#A0522D', brownDark: '#654321' }
};

interface NavbarParticlesProps {
    visible: boolean;
}

const NavbarParticles: React.FC<NavbarParticlesProps> = ({ visible }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Array<{
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        color: string;
        glowIntensity: number;
    }>>([]);

    useEffect(() => {
        if (!visible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const updateCanvasDimensions = () => {
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        };

        updateCanvasDimensions();
        window.addEventListener('resize', updateCanvasDimensions);

        // Create particles with Nova Ipê premium effects
        const createParticles = () => {
            const particleCount = 25; // Increased for more visual interest
            particlesRef.current = [];

            // Função auxiliar para converter hex para RGB
            const hexToRgb = (hex: string) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return { r, g, b };
            };

            // Nova Ipê Premium color palette for particles usando o sistema centralizado
            const colors = [
                `rgba(${hexToRgb(novaIpeColors.primary.ipe).r}, ${hexToRgb(novaIpeColors.primary.ipe).g}, ${hexToRgb(novaIpeColors.primary.ipe).b}, alpha)`,  // Nova Ipê primary
                `rgba(${hexToRgb(novaIpeColors.primary.ipeLight).r}, ${hexToRgb(novaIpeColors.primary.ipeLight).g}, ${hexToRgb(novaIpeColors.primary.ipeLight).b}, alpha)`,  // Nova Ipê light
                `rgba(${hexToRgb(novaIpeColors.primary.ipeDark).r}, ${hexToRgb(novaIpeColors.primary.ipeDark).g}, ${hexToRgb(novaIpeColors.primary.ipeDark).b}, alpha)`,  // Nova Ipê dark
                `rgba(${hexToRgb(novaIpeColors.earth.brown).r}, ${hexToRgb(novaIpeColors.earth.brown).g}, ${hexToRgb(novaIpeColors.earth.brown).b}, alpha)`,   // Earth brown
            ];

            for (let i = 0; i < particleCount; i++) {
                const colorIndex = Math.floor(Math.random() * colors.length);
                const baseOpacity = Math.random() * 0.18 + 0.05; // Slightly increased opacity range

                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2.5 + 0.5, // Slightly larger particles
                    speedX: (Math.random() - 0.5) * 0.35, // Slightly faster movement
                    speedY: (Math.random() - 0.5) * 0.35,
                    opacity: baseOpacity,
                    color: colors[colorIndex].replace('alpha', baseOpacity.toString()),
                    glowIntensity: Math.random() * 3 + 1 // For glow effect
                });
            }
        };

        createParticles();

        // Animation loop
        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update particles with premium effects
            for (const particle of particlesRef.current) {
                // Soft glow effect
                ctx.save();
                ctx.shadowBlur = particle.glowIntensity;
                ctx.shadowColor = particle.color;

                // Draw main particle (ensure positive radius)
                const mainRadius = Math.max(0.1, particle.size);
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, mainRadius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Optional: Draw a smaller, brighter center for a shimmering effect
                const centerRadius = Math.max(0.05, mainRadius * 0.5);
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, centerRadius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(/[\d.]+(?=\))/, (particle.opacity * 1.5).toString());
                ctx.fill();

                ctx.restore();

                // Add slight pulsation to particles (ensure size never goes negative)
                const baseSizeOffset = Math.sin(Date.now() * 0.003) * 0.03;
                particle.size = Math.max(0.1, particle.size + baseSizeOffset);

                // Update position with slight acceleration based on scroll position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Premium edge handling with smooth fade
                if (particle.x < -10) particle.x = canvas.width + 10;
                if (particle.x > canvas.width + 10) particle.x = -10;
                if (particle.y < -10) particle.y = canvas.height + 10;
                if (particle.y > canvas.height + 10) particle.y = -10;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        if (visible) {
            animate();
        }

        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [visible]);

    return (
        <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{
                opacity: visible ? 0.85 : 0,
                scale: visible ? 1 : 0.98
            }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }}
        />
    );
};

export default NavbarParticles;
