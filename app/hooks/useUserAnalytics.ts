/**
 * Sistema Avançado de Analytics e Tracking de Lead
 * Mapeia comportamento do usuário para otimizar conversão
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export interface UserBehavior {
    sessionId: string;
    userId?: string;
    startTime: number;
    actions: UserAction[];
    interests: PropertyInterest[];
    searchPatterns: SearchPattern[];
    engagement: EngagementMetrics;
    leadScore: number;
    preferences: UserPreferences;
}

export interface UserAction {
    type: 'view' | 'click' | 'favorite' | 'share' | 'contact' | 'scroll' | 'filter' | 'search';
    timestamp: number;
    data: Record<string, any>;
    duration?: number;
    elementId?: string;
}

export interface PropertyInterest {
    propertyId: string;
    viewTime: number;
    interactions: string[];
    priceRange: [number, number];
    type: string;
    location: string;
    features: string[];
}

export interface SearchPattern {
    query: string;
    filters: Record<string, any>;
    results: number;
    timestamp: number;
    clickedResults: string[];
}

export interface EngagementMetrics {
    totalTime: number;
    scrollDepth: number;
    pageViews: number;
    bounceRate: boolean;
    returnVisits: number;
    socialShares: number;
    contactAttempts: number;
}

export interface UserPreferences {
    priceRange: [number, number];
    propertyTypes: string[];
    locations: string[];
    features: string[];
    viewMode: 'grid' | 'list';
    sortPreference: string;
}

class UserAnalytics {
    private behavior: UserBehavior;
    private observers: Map<string, IntersectionObserver> = new Map();
    private scrollListener: (() => void) | null = null;

    constructor() {
        this.behavior = this.initializeBehavior();
        this.setupTracking();
    }

    private initializeBehavior(): UserBehavior {
        const sessionId = this.generateSessionId();
        const existingData = this.loadFromStorage();

        return {
            sessionId,
            startTime: Date.now(),
            actions: [],
            interests: [],
            searchPatterns: [],
            engagement: {
                totalTime: 0,
                scrollDepth: 0,
                pageViews: 0,
                bounceRate: false,
                returnVisits: (existingData?.engagement?.returnVisits) || 0,
                socialShares: 0,
                contactAttempts: 0
            },
            leadScore: 0,
            preferences: {
                priceRange: [0, 2000000],
                propertyTypes: [],
                locations: [],
                features: [],
                viewMode: 'grid',
                sortPreference: 'relevance'
            },
            ...existingData
        };
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private loadFromStorage(): Partial<UserBehavior> | null {
        if (typeof window === 'undefined') return null;
        
        try {
            const stored = localStorage.getItem('nova-ipe-analytics');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    private saveToStorage(): void {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem('nova-ipe-analytics', JSON.stringify(this.behavior));
        } catch (error) {
            console.warn('Erro ao salvar analytics:', error);
        }
    }

    private setupTracking(): void {
        // Verificar se está no browser
        if (typeof window === 'undefined') return;

        // Tracking de scroll
        this.scrollListener = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            this.behavior.engagement.scrollDepth = Math.max(
                this.behavior.engagement.scrollDepth, 
                scrollPercent
            );
        };

        window.addEventListener('scroll', this.scrollListener, { passive: true });

        // Tracking de saída
        window.addEventListener('beforeunload', () => {
            this.behavior.engagement.totalTime = Date.now() - this.behavior.startTime;
            this.calculateLeadScore();
            this.saveToStorage();
        });

        // Tracking de visibilidade
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.behavior.engagement.totalTime = Date.now() - this.behavior.startTime;
                    this.saveToStorage();
                }
            });
        }
    }

    // Métodos públicos para tracking
    trackAction(action: Omit<UserAction, 'timestamp'>): void {
        const fullAction: UserAction = {
            ...action,
            timestamp: Date.now()
        };

        this.behavior.actions.push(fullAction);
        this.updateLeadScore(action.type);
        this.saveToStorage();
    }

    trackPropertyView(propertyId: string, property: any): (() => void) {
        const startTime = Date.now();
        const interest: PropertyInterest = {
            propertyId,
            viewTime: 0,
            interactions: ['view'],
            priceRange: [property.preco * 0.8, property.preco * 1.2],
            type: property.tipo || 'unknown',
            location: property.bairro || 'unknown',
            features: property.caracteristicas || []
        };

        this.behavior.interests.push(interest);
        this.trackAction({
            type: 'view',
            data: { propertyId, property: property.titulo }
        });

        // Retorna função para atualizar tempo de visualização
        return () => {
            const duration = Date.now() - startTime;
            interest.viewTime = duration;
            this.updatePreferences(property);
        };
    }

    trackSearch(query: string, filters: Record<string, any>, results: number): void {
        const pattern: SearchPattern = {
            query,
            filters,
            results,
            timestamp: Date.now(),
            clickedResults: []
        };

        this.behavior.searchPatterns.push(pattern);
        this.trackAction({
            type: 'search',
            data: { query, filters, results }
        });

        this.analyzeSearchIntent(query, filters);
    }

    trackFavorite(propertyId: string, property: any): void {
        this.trackAction({
            type: 'favorite',
            data: { propertyId, property: property.titulo }
        });

        // Atualiza interesse na propriedade
        const interest = this.behavior.interests.find(i => i.propertyId === propertyId);
        if (interest) {
            interest.interactions.push('favorite');
        }

        this.updatePreferences(property);
    }

    trackContact(method: string, propertyId?: string): void {
        this.behavior.engagement.contactAttempts++;
        this.trackAction({
            type: 'contact',
            data: { method, propertyId }
        });
    }

    trackElementView(elementId: string, element: HTMLElement): () => void {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackAction({
                            type: 'view',
                            elementId,
                            data: { visibility: entry.intersectionRatio }
                        });
                    }
                });
            },
            { threshold: [0.1, 0.5, 0.9] }
        );

        observer.observe(element);
        this.observers.set(elementId, observer);

        return () => {
            observer.disconnect();
            this.observers.delete(elementId);
        };
    }

    private updatePreferences(property: any): void {
        const prefs = this.behavior.preferences;

        // Atualiza faixa de preço baseada no interesse
        if (property.preco) {
            const currentRange = prefs.priceRange;
            prefs.priceRange = [
                Math.min(currentRange[0], property.preco * 0.8),
                Math.max(currentRange[1], property.preco * 1.2)
            ];
        }

        // Adiciona tipos de propriedade
        if (property.tipo && !prefs.propertyTypes.includes(property.tipo)) {
            prefs.propertyTypes.push(property.tipo);
        }

        // Adiciona localizações
        if (property.bairro && !prefs.locations.includes(property.bairro)) {
            prefs.locations.push(property.bairro);
        }

        // Adiciona características
        if (property.caracteristicas) {
            property.caracteristicas.forEach((feature: string) => {
                if (!prefs.features.includes(feature)) {
                    prefs.features.push(feature);
                }
            });
        }
    }

    private analyzeSearchIntent(query: string, filters: Record<string, any>): void {
        // Análise de intenção baseada na busca
        const lowercaseQuery = query.toLowerCase();
        
        // Detecta urgência
        const urgentWords = ['urgente', 'hoje', 'agora', 'rápido', 'imediato'];
        const isUrgent = urgentWords.some(word => lowercaseQuery.includes(word));
        
        // Detecta fase de compra
        const buyingWords = ['comprar', 'financiar', 'entrada', 'parcela'];
        const rentingWords = ['alugar', 'locação', 'aluguel'];
        
        if (buyingWords.some(word => lowercaseQuery.includes(word))) {
            this.trackAction({
                type: 'click',
                data: { intent: 'buying', urgency: isUrgent ? 'high' : 'normal' }
            });
        }
        
        if (rentingWords.some(word => lowercaseQuery.includes(word))) {
            this.trackAction({
                type: 'click',
                data: { intent: 'renting', urgency: isUrgent ? 'high' : 'normal' }
            });
        }
    }

    private updateLeadScore(actionType: string): void {
        const scoreMap: Record<string, number> = {
            'view': 1,
            'click': 2,
            'search': 3,
            'filter': 2,
            'favorite': 5,
            'share': 4,
            'contact': 15
        };

        this.behavior.leadScore += scoreMap[actionType] || 0;

        // Bônus por engajamento
        if (this.behavior.engagement.totalTime > 300000) { // 5 minutos
            this.behavior.leadScore += 5;
        }

        if (this.behavior.actions.length > 10) {
            this.behavior.leadScore += 3;
        }
    }

    private calculateLeadScore(): void {
        let score = 0;

        // Score baseado em ações
        score += this.behavior.actions.length * 2;
        score += this.behavior.interests.length * 5;
        score += this.behavior.engagement.contactAttempts * 20;

        // Score baseado em tempo
        const minutes = this.behavior.engagement.totalTime / 60000;
        score += Math.min(minutes * 2, 30);

        // Score baseado em scroll
        score += this.behavior.engagement.scrollDepth / 10;

        // Desconto para bounce
        if (this.behavior.engagement.bounceRate) {
            score *= 0.5;
        }

        this.behavior.leadScore = Math.round(score);
    }

    // Getters públicos
    getBehavior(): UserBehavior {
        return { ...this.behavior };
    }

    getLeadScore(): number {
        return this.behavior.leadScore;
    }

    getPreferences(): UserPreferences {
        return { ...this.behavior.preferences };
    }

    getRecommendations(): string[] {
        const interests = this.behavior.interests;
        const preferences = this.behavior.preferences;
        
        const recommendations: string[] = [];

        // Recomendações baseadas em preço
        if (preferences.priceRange[1] > 1000000) {
            recommendations.push('premium');
        }

        // Recomendações baseadas em localização
        if (preferences.locations.length > 0) {
            recommendations.push(`location:${preferences.locations[0]}`);
        }

        // Recomendações baseadas em tipo
        if (preferences.propertyTypes.length > 0) {
            recommendations.push(`type:${preferences.propertyTypes[0]}`);
        }

        return recommendations;
    }

    cleanup(): void {
        // Verificar se está no browser
        if (typeof window === 'undefined') return;

        // Limpa observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Remove listeners
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
        }
    }
}

// Hook para usar o sistema de analytics
export function useUserAnalytics() {
    const [analytics] = useState(() => new UserAnalytics());

    useEffect(() => {
        return () => analytics.cleanup();
    }, [analytics]);

    return analytics;
}