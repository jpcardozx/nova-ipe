'use client';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export function Contact() {
  return (
    <section className="container mx-auto px-4 py-12" >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
          <div className="h-2 w-2 rounded-full bg-amber-600"></div>
          Vamos Trabalhar Juntos
        </div>
        <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">Pronto Para Começar Seu Projeto?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Respondo em <span className="font-semibold text-amber-600">até 2 horas</span> com um plano de ação personalizado para seu projeto.
        </p>
        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Consulta gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Orçamento em 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Início em 1 semana</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100"
        >
          <form className="space-y-8">
            {/* Project Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">Que tipo de projeto você tem em mente?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'website', label: 'Website/Landing Page', icon: '💻' },
                  { value: 'webapp', label: 'Aplicação Web', icon: '⚙️' },
                  { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' }
                ].map((type) => (
                  <label key={type.value} className="relative">
                    <input
                      type="radio"
                      name="projectType"
                      value={type.value}
                      className="sr-only peer"
                    />
                    <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-emerald-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-50">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium text-gray-700 peer-checked:text-emerald-700">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Seu nome"
                  className="block w-full rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-0 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="seu@email.com"
                  className="block w-full rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-0 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-semibold text-gray-900 mb-2">Orçamento Aproximado</label>
                <select
                  name="budget"
                  id="budget"
                  className="block w-full rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 px-4 py-3 text-gray-900 transition-colors"
                >
                  <option value="">Selecione uma faixa</option>
                  <option value="5k-10k">R$ 5k - 10k</option>
                  <option value="10k-20k">R$ 10k - 20k</option>
                  <option value="20k-50k">R$ 20k - 50k</option>
                  <option value="50k+">R$ 50k+</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-semibold text-gray-900 mb-2">Quando precisa ficar pronto?</label>
                <select
                  name="timeline"
                  id="timeline"
                  className="block w-full rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 px-4 py-3 text-gray-900 transition-colors"
                >
                  <option value="">Selecione o prazo</option>
                  <option value="1month">1 mês</option>
                  <option value="3months">3 meses</option>
                  <option value="6months">6 meses</option>
                  <option value="flexible">Flexível</option>
                </select>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Descreva seu projeto *</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                placeholder="Conte-me sobre sua ideia, objetivos, público-alvo e principais funcionalidades que imagina..."
                className="block w-full rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 px-4 py-3 text-gray-900 placeholder-gray-500 resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-12 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Enviar Solicitação</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Vou analisar seu projeto e responder com um plano detalhado em até 24 horas
              </p>
            </div>
          </form>
        </motion.div>

        {/* Quick Contact Options */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="mailto:contato@jpcardozo.com" className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-colors group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Email Direto</div>
              <div className="text-sm text-emerald-600">contato@jpcardozo.com</div>
            </div>
          </a>
          <a href="https://wa.me/5561999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-colors group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">WhatsApp</div>
              <div className="text-sm text-emerald-600">Resposta rápida</div>
            </div>
          </a>
          <a href="https://linkedin.com/in/jpcardozx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-colors group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Linkedin className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">LinkedIn</div>
              <div className="text-sm text-emerald-600">/in/jpcardozx</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
