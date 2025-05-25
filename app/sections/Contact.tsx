'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Entre em contato</h2>
                        <p className="text-neutral-600 mb-8">
                            Estamos à disposição para ajudar você a encontrar o imóvel ideal ou vender seu imóvel com a melhor avaliação.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-primary-50 p-3 rounded-full mr-4">
                                    <Phone className="h-5 w-5 text-primary-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Telefone</h3>
                                    <p className="text-neutral-600">(11) 99999-9999</p>
                                    <p className="text-neutral-600">(11) 5555-5555</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-primary-50 p-3 rounded-full mr-4">
                                    <Mail className="h-5 w-5 text-primary-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">E-mail</h3>
                                    <p className="text-neutral-600">contato@novaipe.com.br</p>
                                    <p className="text-neutral-600">vendas@novaipe.com.br</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-primary-50 p-3 rounded-full mr-4">
                                    <MapPin className="h-5 w-5 text-primary-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Endereço</h3>
                                    <p className="text-neutral-600">
                                        Av. Principal, 123 - Centro<br />
                                        Guararema - SP, 12500-000
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-primary-50 p-3 rounded-full mr-4">
                                    <Clock className="h-5 w-5 text-primary-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Horário de Atendimento</h3>
                                    <p className="text-neutral-600">
                                        Segunda a Sexta: 9h às 18h<br />
                                        Sábados: 9h às 13h
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100">
                        <h3 className="text-2xl font-semibold mb-6">Envie uma mensagem</h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-neutral-700">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Digite seu nome"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-700">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Digite seu e-mail"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-neutral-700">
                                    Assunto
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Digite o assunto"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block mb-2 text-sm font-medium text-neutral-700">
                                    Mensagem
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Digite sua mensagem"
                                ></textarea>
                            </div>                            <Button variant="default" size="lg" className="w-full">
                                Enviar mensagem
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection; 