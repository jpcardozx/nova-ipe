// gtag.d.ts - Declaração de tipos para Google Analytics
interface Window {
    gtag: (
        command: 'event' | 'config' | 'set' | 'js' | 'consent',
        targetId: string,
        config?: {
            [key: string]: any;
        }
    ) => void;
}
