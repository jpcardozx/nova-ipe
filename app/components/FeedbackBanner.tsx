'use client';

import { useState } from 'react';
import { logger } from '../../lib/logger';

/**
 * Componente de feedback para o usuário
 * Permite aos visitantes fornecerem feedback sobre a nova versão
 */
export function FeedbackBanner() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState({
        rating: 0,
        comments: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Enviar feedback para a API (a ser implementada)
            // await fetch('/api/feedback', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(feedback)
            // });

            // Simulando envio bem-sucedido
            logger.info('Feedback enviado:', { metadata: { feedback } });
            setSubmitted(true);

            // Limpar formulário
            setFeedback({ rating: 0, comments: '', email: '' });

            // Fechar após 3 segundos
            setTimeout(() => {
                setIsOpen(false);

                // Resetar para futuro uso após fechar
                setTimeout(() => setSubmitted(false), 300);
            }, 3000);
        } catch (error) {
            logger.error('Erro ao enviar feedback:', { metadata: { error: error instanceof Error ? error.message : String(error) } });
            alert('Houve um erro ao enviar seu feedback. Tente novamente mais tarde.');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-8 z-40 flex items-center gap-2 bg-gradient-to-r from-amber-900/95 to-amber-800/95 text-amber-50 py-2.5 px-5 rounded-full shadow-lg hover:shadow-amber-900/20 transition-all duration-300 border border-amber-700/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="text-sm font-medium">Feedback</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-8 z-40 w-80 bg-gradient-to-b from-amber-50 to-white rounded-xl shadow-xl border border-amber-100/50 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-amber-900 to-amber-800 py-3 px-4 flex justify-between items-center">
                <h3 className="text-amber-50 font-medium">Sua opinião é importante</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-amber-100/80 hover:text-amber-50 transition-colors"
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div className="p-4">
                {submitted ? (
                    <div className="py-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <p className="text-amber-900 font-medium">Obrigado pelo seu feedback!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Como você avalia a nova versão?</label>
                            <div className="flex space-x-3 justify-center">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setFeedback({ ...feedback, rating })}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${feedback.rating >= rating
                                            ? 'bg-gradient-to-br from-amber-700 to-amber-600 text-amber-50 shadow-md'
                                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">
                                Comentários (opcional)
                            </label>
                            <textarea
                                value={feedback.comments}
                                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-amber-900 placeholder-amber-400"
                                placeholder="Conte-nos sua experiência..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">
                                Email (opcional)
                            </label>
                            <input
                                type="email"
                                value={feedback.email}
                                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-amber-900 placeholder-amber-400"
                                placeholder="Seu email para retorno"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50 py-2 px-4 rounded-lg hover:from-amber-800 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                        >
                            Enviar Feedback
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
