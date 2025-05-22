/**
 * Tailwind CSS Configuration
 * Configuração profissional para Next.js com Tailwind v3.3
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
    darkMode: 'class',
    mode: 'jit',
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: ['bg-red-500', 'text-center'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        }, extend: {
            fontFamily: {
                sans: ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
                display: ['Merriweather', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
                body: ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
            colors: {
                // Cores primárias da Nova Ipê
                brand: {
                    green: {
                        DEFAULT: '#1a6f5c',
                        dark: '#145a49',
                        light: '#3a8f7c'
                    },
                    dark: {
                        DEFAULT: '#0D1F2D',
                        light: '#1e3042'
                    },
                    light: '#f8f4e3'
                },
                accent: {
                    yellow: {
                        DEFAULT: '#ffcc00',
                        dark: '#e6b800'
                    }
                },
                // Design system moderno - compatível com v3
                border: '#e5e5e5',
                input: '#f0f0f0',
                ring: 'rgba(26, 111, 92, 0.3)',
                background: '#ffffff',
                foreground: '#333333',
                primary: {
                    DEFAULT: '#1a6f5c',
                    foreground: '#ffffff',
                    50: '#EBF5FF',
                    100: '#E1EFFE',
                    200: '#C3DDFD',
                    300: '#A4CAFE',
                    400: '#76A9FA',
                    500: '#3F83F8',
                    600: '#1C64F2',
                    700: '#1A56DB',
                    800: '#1E429F',
                    900: '#233876',
                },
                secondary: {
                    DEFAULT: '#0D1F2D',
                    foreground: '#ffffff',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                destructive: {
                    DEFAULT: '#e11d48',
                    foreground: '#ffffff',
                },
                muted: {
                    DEFAULT: '#f2f2f2',
                    foreground: '#6B7280',
                },
                accent: {
                    DEFAULT: '#ffcc00',
                    foreground: '#0D1F2D',
                },
                popover: {
                    DEFAULT: '#ffffff',
                    foreground: '#333333',
                },
                card: {
                    DEFAULT: '#ffffff',
                    foreground: '#333333',
                },
            },
            borderRadius: {
                lg: '0.75rem',
                md: '0.5rem',
                sm: '0.375rem',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                "accordion-up": {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "shimmer": "shimmer 2s infinite linear",
                "float": "float 4s ease-in-out infinite",
                "fade-in": "fadeIn 0.5s ease-in",
                "slide-up": "slideUp 0.5s ease-out",
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [
        // require('@tailwindcss/line-clamp'), // Comentado ou removido
        // Embora o line-clamp seja nativamente integrado ao Tailwind CSS v3.3+,
        // estamos incluindo o plugin para compatibilidade com o build atual
    ],
}