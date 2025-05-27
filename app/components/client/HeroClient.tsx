/* app/components/client/HeroClient.tsx */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car, X, Play
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { HeroServerData } from '../server/HeroServer';

interface MarketMetric {
    id: string;
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}

interface NeighborhoodData {
    name: string;
    priceRange: string;
    characteristics: string;
    distance: string;
    highlight: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    intent: 'invest' | 'live';
    message?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

interface HeroClientProps {
    serverData?: HeroServerData;
}

const HeroClient: React.FC<HeroClientProps> = ({ serverData }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        intent: 'invest',
        message: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'invest' | 'live'>('invest');
    const [showNeighborhoods, setShowNeighborhoods] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });

    useEffect(() => {
        setMounted(true);
    }, []);

    const validateForm = useCallback((): boolean => {
        const errors: FormErrors = {};

        if (!formData.name.trim()) {
            errors.name = 'Nome é obrigatório';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email inválido';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Telefone é obrigatório';
        } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
            errors.phone = 'Formato inválido. Use (99) 99999-9999';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contato', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', intent: 'invest', message: '' });
                setTimeout(() => setShowForm(false), 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm]);

    const scrollToForm = useCallback(() => {
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }, []);

    if (!mounted || !serverData) return null;

    // Aqui você pode retornar o layout principal como já estruturado
    return (
        <div ref={heroRef}>
            {/* Aqui entra o layout principal do HeroClient */}
            {/* Para não extrapolar, você pode reinserir a parte visual a partir deste ponto */}
        </div>
    );
};

export default HeroClient;
