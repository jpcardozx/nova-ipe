// Analytics tracking for form interactions
declare global {
    interface Window {
        gtag: (command: "event" | "config" | "set" | "js" | "consent", targetId: string, config?: { [key: string]: any }) => void;
    }
}

// Form analytics helper
export const trackFormInteraction = (action: string, formData?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_interaction', {
            event_category: 'engagement',
            event_label: 'contact_form_subtle',
            action: action,
            form_data: formData ? {
                interest_type: formData.interest,
                has_message: !!formData.message
            } : undefined
        });
    }
};

// Performance monitoring
export const trackFormPerformance = (metric: string, value: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_performance', {
            metric_name: metric,
            metric_value: value,
            form_type: 'contact_form_subtle'
        });
    }
};

// Enhanced phone validation for Brazilian numbers
export const validateBrazilianPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Check for valid Brazilian phone patterns
    if (cleaned.length === 10) {
        // Landline: (11) 9999-9999
        return /^[1-9][1-9]\d{8}$/.test(cleaned);
    } else if (cleaned.length === 11) {
        // Mobile: (11) 99999-9999
        return /^[1-9][1-9]9\d{8}$/.test(cleaned);
    }
    
    return false;
};

// Email domain validation for common providers
export const validateEmailDomain = (email: string): boolean => {
    const commonDomains = [
        'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
        'uol.com.br', 'terra.com.br', 'ig.com.br', 'bol.com.br'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Allow common domains or any .com.br/.com domain
    return commonDomains.includes(domain) || 
           /\.(com|com\.br|org|edu|gov\.br)$/.test(domain);
};

// Form submission rate limiting
const formSubmissionTracker = {
    attempts: 0,
    lastAttempt: 0,
    maxAttempts: 3,
    cooldownPeriod: 60000, // 1 minute
    
    canSubmit(): boolean {
        const now = Date.now();
        
        // Reset if cooldown period has passed
        if (now - this.lastAttempt > this.cooldownPeriod) {
            this.attempts = 0;
        }
        
        return this.attempts < this.maxAttempts;
    },
    
    recordAttempt(): void {
        this.attempts++;
        this.lastAttempt = Date.now();
    },
    
    getRemainingTime(): number {
        const elapsed = Date.now() - this.lastAttempt;
        return Math.max(0, this.cooldownPeriod - elapsed);
    }
};

export { formSubmissionTracker };

// Form field focus management
export const manageFocus = {
    focusFirstError: (errors: Record<string, string>) => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            setTimeout(() => {
                const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                element?.focus();
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    },
    
    focusNextField: (currentField: string, formFields: string[]) => {
        const currentIndex = formFields.indexOf(currentField);
        const nextField = formFields[currentIndex + 1];
        
        if (nextField) {
            setTimeout(() => {
                const element = document.querySelector(`[name="${nextField}"]`) as HTMLElement;
                element?.focus();
            }, 50);
        }
    }
};

// Local storage for form persistence
export const formPersistence = {
    saveFormData: (data: any) => {
        try {
            localStorage.setItem('contact_form_draft', JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to save form data:', error);
        }
    },
    
    loadFormData: () => {
        try {
            const saved = localStorage.getItem('contact_form_draft');
            if (saved) {
                const data = JSON.parse(saved);
                const ageInHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
                
                // Only restore if less than 24 hours old
                if (ageInHours < 24) {
                    delete data.timestamp;
                    return data;
                }
            }
        } catch (error) {
            console.warn('Failed to load form data:', error);
        }
        return null;
    },
    
    clearFormData: () => {
        try {
            localStorage.removeItem('contact_form_draft');
        } catch (error) {
            console.warn('Failed to clear form data:', error);
        }
    }
};
