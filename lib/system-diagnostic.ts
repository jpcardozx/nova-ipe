/**
 * Diagnóstico completo de imagens e UX
 * Sistema para identificar e corrigir problemas
 */

export interface ImageDiagnostic {
    id: string;
    title: string;
    mainImageUrl?: string;
    galleryCount: number;
    rawImageData?: any;
    issues: string[];
    status: 'success' | 'warning' | 'error';
}

export interface UXDiagnostic {
    component: string;
    issues: string[];
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
}

export class SystemDiagnostic {
    private static imageDiagnostics: ImageDiagnostic[] = [];
    private static uxDiagnostics: UXDiagnostic[] = [];

    static addImageDiagnostic(diagnostic: ImageDiagnostic) {
        this.imageDiagnostics.push(diagnostic);
        
        // Log crítico se imagem não carrega
        if (diagnostic.status === 'error') {
            console.error(`🚨 IMAGEM CRÍTICA - ${diagnostic.id}:`, {
                title: diagnostic.title,
                mainImage: diagnostic.mainImageUrl,
                issues: diagnostic.issues,
                rawData: diagnostic.rawImageData
            });
        }
    }

    static addUXDiagnostic(diagnostic: UXDiagnostic) {
        this.uxDiagnostics.push(diagnostic);
        
        if (diagnostic.severity === 'high') {
            console.warn(`⚠️ UX CRÍTICO - ${diagnostic.component}:`, {
                issues: diagnostic.issues,
                recommendations: diagnostic.recommendations
            });
        }
    }

    static generateReport() {
        console.group('📊 RELATÓRIO DIAGNÓSTICO COMPLETO');
        
        // Relatório de imagens
        console.group('🖼️ Diagnóstico de Imagens');
        const imageStats = {
            total: this.imageDiagnostics.length,
            success: this.imageDiagnostics.filter(d => d.status === 'success').length,
            warning: this.imageDiagnostics.filter(d => d.status === 'warning').length,
            error: this.imageDiagnostics.filter(d => d.status === 'error').length,
            withGallery: this.imageDiagnostics.filter(d => d.galleryCount > 0).length
        };
        
        console.table(imageStats);
        
        if (this.imageDiagnostics.length > 0) {
            console.table(this.imageDiagnostics.map(d => ({
                id: d.id.slice(-8),
                title: d.title.slice(0, 30),
                hasImage: d.mainImageUrl ? '✅' : '❌',
                gallery: d.galleryCount,
                status: d.status === 'success' ? '✅' : d.status === 'warning' ? '⚠️' : '❌',
                issues: d.issues.length
            })));
        }
        console.groupEnd();

        // Relatório de UX
        console.group('🎨 Diagnóstico de UX');
        const uxStats = {
            components: this.uxDiagnostics.length,
            high: this.uxDiagnostics.filter(d => d.severity === 'high').length,
            medium: this.uxDiagnostics.filter(d => d.severity === 'medium').length,
            low: this.uxDiagnostics.filter(d => d.severity === 'low').length
        };
        
        console.table(uxStats);
        
        if (this.uxDiagnostics.length > 0) {
            console.table(this.uxDiagnostics.map(d => ({
                component: d.component,
                severity: d.severity === 'high' ? '🚨' : d.severity === 'medium' ? '⚠️' : '💡',
                issues: d.issues.length,
                recommendations: d.recommendations.length
            })));
        }
        console.groupEnd();

        console.groupEnd();
    }

    static scheduleReport() {
        // Agenda relatório após 5 segundos
        setTimeout(() => {
            this.generateReport();
            this.reset();
        }, 5000);
    }

    static reset() {
        this.imageDiagnostics = [];
        this.uxDiagnostics = [];
    }
}

// Função para diagnosticar uma propriedade
export function diagnoseProperty(property: any): ImageDiagnostic {
    const issues: string[] = [];
    let status: 'success' | 'warning' | 'error' = 'success';

    // Verifica imagem principal
    if (!property.mainImage?.url && !property.imagem?.imagemUrl && !property.imagem?.asset?.url) {
        issues.push('Sem imagem principal');
        status = 'error';
    }

    // Verifica URL da imagem
    const imageUrl = property.mainImage?.url || property.imagem?.imagemUrl || property.imagem?.asset?.url;
    if (imageUrl && !imageUrl.startsWith('http')) {
        issues.push('URL de imagem inválida');
        status = 'error';
    }

    // Verifica galeria
    const galleryCount = property.galeria?.length || property.gallery?.length || 0;
    if (galleryCount === 0) {
        issues.push('Sem galeria de imagens');
        if (status === 'success') status = 'warning';
    }

    return {
        id: property.id || property._id,
        title: property.title || property.titulo,
        mainImageUrl: imageUrl,
        galleryCount,
        rawImageData: {
            imagem: property.imagem,
            mainImage: property.mainImage,
            galeria: property.galeria,
            gallery: property.gallery
        },
        issues,
        status
    };
}

// Função para diagnosticar UX de componente
export function diagnoseUX(component: string, element?: HTMLElement): UXDiagnostic {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';

    // Diagnósticos específicos por componente
    switch (component) {
        case 'PropertyCard':
            // Verifica se tem animações suaves
            if (!element?.style.transition) {
                issues.push('Sem transições suaves');
                recommendations.push('Adicionar transition CSS');
                severity = 'medium';
            }
            
            // Verifica contraste
            const bgColor = window.getComputedStyle(element || document.body).backgroundColor;
            if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                issues.push('Background transparente pode afetar legibilidade');
                recommendations.push('Definir background sólido ou gradiente sutil');
            }
            break;

        case 'Hero':
            issues.push('Design genérico detectado');
            recommendations.push('Implementar design único e memorável');
            recommendations.push('Adicionar elementos visuais distintivos');
            severity = 'high';
            break;

        case 'Badges':
            issues.push('Badges com design básico');
            recommendations.push('Implementar glassmorphism ou neumorphism');
            recommendations.push('Adicionar micro-interações');
            severity = 'medium';
            break;
    }

    return {
        component,
        issues,
        recommendations,
        severity
    };
}

// Hook para auto-diagnóstico
export function useSystemDiagnostic() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        SystemDiagnostic.scheduleReport();
    }
}