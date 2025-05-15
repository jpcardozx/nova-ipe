'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';

export default function AnuncioNovaVersao() {
    const [isClosed, setIsClosed] = useState(true); // Start as closed until we check localStorage

    useEffect(() => {
        // Check if the user has previously closed the announcement
        const announcementClosed = localStorage.getItem('novaVersaoAnnouncementClosed');

        // If they haven't closed it before, show it
        if (announcementClosed !== 'true') {
            setIsClosed(false);
        }
    }, []);

    const handleClose = () => {
        setIsClosed(true);
        // Save the preference in localStorage
        localStorage.setItem('novaVersaoAnnouncementClosed', 'true');
    };

    if (isClosed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl"
        >
            <div className="mx-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-xl p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-amber-100 rounded-full p-2 text-amber-600 mr-3">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">Experimente nossa nova versão</h3>
                        <p className="text-amber-100 text-xs">Design aprimorado e novas funcionalidades</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/nova-versao"
                        className="inline-flex items-center px-3 py-1.5 bg-white rounded-md text-sm text-amber-600 font-medium hover:bg-amber-50 transition-colors"
                    >
                        Ver agora
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>                    <button
                        onClick={handleClose}
                        className="p-1 text-amber-100 hover:text-white hover:bg-amber-600/30 rounded-full transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}