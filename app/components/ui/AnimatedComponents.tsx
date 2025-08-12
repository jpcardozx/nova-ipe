import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedNavProps {
    children: React.ReactNode;
    isScrolled: boolean;
    className?: string;
}

/**
 * Wrapper de animação que gerencia transições SSR-safe
 */
export const AnimatedNav: React.FC<AnimatedNavProps> = ({
    children,
    isScrolled,
    className = ''
}) => {
    return (
        <motion.nav
            className={`
        fixed top-0 left-0 w-full z-50 
        bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm
        ${className}
      `}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1 // Pequeno delay para garantir que o CSS carregue primeiro
            }}
        >
            {children}
        </motion.nav>
    );
};

interface NavItemProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

/**
 * Item de navegação com animações otimizadas
 */
export const NavItem: React.FC<NavItemProps> = ({
    href,
    label,
    isActive,
    onClick
}) => {
    return (
        <motion.li layout>
            <motion.a
                href={href}
                onClick={onClick}
                className={`nav-item ${isActive ? 'active' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="relative z-10">{label}</span>

                {/* Indicador ativo com layoutId para transições suaves */}
                {isActive && (
                    <motion.div
                        className="nav-active-indicator"
                        layoutId="activeNavItem"
                        initial={false}
                        transition={{
                            type: 'spring',
                            bounce: 0.15,
                            duration: 0.4
                        }}
                    />
                )}

                {/* Hover indicator sempre presente */}
                <div className="nav-hover-indicator" />
            </motion.a>
        </motion.li>
    );
};

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * Menu mobile com animações controladas
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    children
}) => {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                className="mobile-menu-backdrop"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    pointerEvents: isOpen ? 'auto' : 'none',
                    display: isOpen ? 'block' : 'none'
                }}
            />

            {/* Menu */}
            <motion.div
                className="mobile-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : -20
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut" as const
                }}
                style={{
                    pointerEvents: isOpen ? 'auto' : 'none',
                    display: isOpen ? 'block' : 'none'
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

