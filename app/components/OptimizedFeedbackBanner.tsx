'use client';

import { useState, useCallback, useMemo } from 'react';
import { logger } from '../../lib/logger';

/**
 * Componente de feedback otimizado para o usuário
 * Permite aos visitantes fornecerem feedback sobre a nova versão
 * Otimizado para evitar travamentos e melhorar a performance
 */
export function OptimizedFeedbackBanner() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({
        rating: 0,
        comments: '',
        email: ''
    });

    // Memoizar os botões de rating para evitar re-renders desnecessários
    const ratingButtons = useMemo(() =>
        [1, 2, 3, 4, 5].map((rating) => (
            <button
                key={rating}
                type="button"
                onClick={() => setFeedback(prev => ({ ...prev, rating }))}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${feedback.rating >= rating
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                aria-label={`Avaliar com ${rating} estrela${rating > 1 ? 's' : ''}`}
            >
                {rating}
            </button>
        )), [feedback.rating]
    );

    // Otimizar o submit para evitar travamentos
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting || feedback.rating === 0) return;

        setIsSubmitting(true);

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

            // Usar requestAnimationFrame para melhor performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setIsOpen(false);
                    setSubmitted(false);
                    setIsSubmitting(false);
                }, 2000); // Reduzido para 2 segundos
            });

        } catch (error) {
            logger.error('Erro ao enviar feedback:', { metadata: { error: error instanceof Error ? error.message : String(error) } });
            setIsSubmitting(false);
            // Usar uma notificação menos intrusiva
            console.error('Houve um erro ao enviar seu feedback. Tente novamente mais tarde.');
        }
    }, [feedback, isSubmitting]);

    // Callbacks otimizados
    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleCommentsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(prev => ({ ...prev, comments: e.target.value }));
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFeedback(prev => ({ ...prev, email: e.target.value }));
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="fixed bottom-24 right-8 z-40 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Abrir formulário de feedback"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="text-sm font-medium">Feedback</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-8 z-40 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-4 flex justify-between items-center">
                <h3 className="text-white font-medium">Sua opinião é importante</h3>
                <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Fechar formulário de feedback"
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <p className="text-gray-800 font-medium">Obrigado pelo seu feedback!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Como você avalia a nova versão?</label>
                            <div className="flex space-x-3 justify-center">
                                {ratingButtons}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                                Comentários (opcional)
                            </label>
                            <textarea
                                id="comments"
                                rows={3}
                                value={feedback.comments}
                                onChange={handleCommentsChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                placeholder="O que você mais gostou ou o que poderia melhorar?"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail (opcional)
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={feedback.email}
                                onChange={handleEmailChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                placeholder="Para contato posterior se necessário"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={feedback.rating === 0 || isSubmitting}
                            className="w-full py-2 bg-amber-600 text-white font-medium rounded-md disabled:opacity-50 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar feedback'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
