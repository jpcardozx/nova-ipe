'use client'

import { motion } from 'framer-motion'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'

// Interface para artigos educativos
interface EducationalArticle {
    id: string
    title: string
    subtitle: string
    readingTime: number
    category: string
    difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
    imageUrl: string
    content: string
    tags: string[]
    publishDate: string
}

// Componente Educativo
export function EducationalView({
    selectedArticle,
    onSelectArticle,
    onBack
}: {
    selectedArticle: string | null
    onSelectArticle: (articleId: string) => void
    onBack: () => void
}) {
    const articles: EducationalArticle[] = [
        {
            id: 'investimento-digital-imoveis',
            title: 'Investimento Digital no Mercado Imobiliário',
            subtitle: 'Como maximizar resultados com estratégias online',
            readingTime: 8,
            category: 'Estratégia Digital',
            difficulty: 'Iniciante',
            imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
            publishDate: '2025-01-07',
            tags: ['Marketing Digital', 'ROI', 'Leads'],
            content: `# Investimento Digital no Mercado Imobiliário

O mercado imobiliário está passando por uma transformação digital. Hoje, **83% dos compradores** começam sua jornada de compra online, e quem não se adapta perde oportunidades valiosas.

## Por que investir em marketing digital?

### 1. Alcance Direcionado
- Chegue exatamente ao seu público-alvo
- Pessoas que realmente têm interesse em imóveis
- Otimização de investimento com foco nos resultados

### 2. Mensuração de Resultados
- Acompanhe cada real investido
- Veja quantos leads cada campanha gera
- Ajuste estratégias em tempo real

### 3. Competitividade
- Seus concorrentes já estão online
- Capture clientes antes da concorrência
- Construa autoridade no mercado

## Como começar de forma inteligente

### Passo 1: Definir Objetivos Claros
- Quantos leads por mês você precisa?
- Qual o ticket médio dos seus imóveis?
- Em quanto tempo quer ver resultados?

### Passo 2: Conhecer seu Cliente Ideal
- Idade e perfil socioeconômico
- Onde procuram por imóveis
- Principais dúvidas e objeções

### Passo 3: Escolher as Plataformas Certas
- **Google Ads**: Para quem já está procurando
- **Facebook/Instagram**: Para despertar interesse
- **WhatsApp**: Para nutrir relacionamentos

## Investimento Inicial Sugerido

Para uma estratégia completa, considere:
- **Google Ads**: R$ 2.000 - R$ 5.000/mês
- **Facebook Ads**: R$ 1.500 - R$ 3.000/mês
- **Gestão e Otimização**: R$ 2.000 - R$ 4.000/mês

*Valores podem variar conforme região e concorrência*

## Resultados Esperados

Com uma estratégia bem executada:
- **30-50 leads qualificados/mês**
- **3-8 visitas agendadas/mês**
- **1-3 vendas/mês** (dependendo do ticket médio)

*Lembre-se: marketing digital não é gasto, é investimento. Cada real bem aplicado retorna multiplicado em vendas.*`
        },
        {
            id: 'google-ads-imoveis',
            title: 'Google Ads para Imóveis: Guia Prático',
            subtitle: 'Capture leads quando eles mais precisam',
            readingTime: 12,
            category: 'Google Ads',
            difficulty: 'Intermediário',
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
            publishDate: '2025-01-06',
            tags: ['Google Ads', 'PPC', 'Palavras-chave'],
            content: `# Google Ads para Imóveis: Guia Prático

O Google Ads é a ferramenta mais poderosa para capturar pessoas que **já estão procurando** por imóveis. É como ter uma equipe de vendas trabalhando 24/7.

## Por que Google Ads Funciona

### Intenção de Compra Alta
- Quem pesquisa "apartamento para comprar" está pronto para decidir
- Não precisa "criar" a necessidade, ela já existe
- Timing perfeito para converter

### Controle Total
- Defina exatamente quanto investir por dia
- Ajuste horários de exibição
- Foque nas regiões que atendem

## Estrutura de uma Campanha Vencedora

### 1. Palavras-chave Estratégicas

**Alta Intenção (Mais caras, mais conversão)**
- "apartamento para comprar [região]"
- "casa à venda [bairro]"
- "imóvel novo [cidade]"

**Média Intenção (Custo/benefício)**
- "apartamentos [região]"
- "casas [bairro]"
- "imóveis [cidade]"

### 2. Anúncios que Convertem

**Título 1**: Apartamentos em [Região] - Pronto para Morar
**Título 2**: Financiamento até 100% | Visite Hoje
**Descrição**: "✅ Localização privilegiada ✅ Documentação pronta"

## Próximos Passos

1. **Pesquisa de palavras-chave** com Planejador Google
2. **Configuração de campanhas** seguindo estrutura
3. **Monitoramento diário** primeiras 2 semanas

*Lembre-se: Google Ads não é sobre gastar mais, é sobre gastar melhor.*`
        },
        {
            id: 'facebook-ads-imoveis',
            title: 'Facebook Ads: Despertar Interesse em Imóveis',
            subtitle: 'Como criar demanda onde ela ainda não existe',
            readingTime: 10,
            category: 'Facebook Ads',
            difficulty: 'Iniciante',
            imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
            publishDate: '2025-01-05',
            tags: ['Facebook Ads', 'Públicos', 'Creative'],
            content: `# Facebook Ads: Despertar Interesse em Imóveis

Enquanto o Google captura quem já procura, o Facebook **cria** o interesse. É onde você mostra às pessoas que ainda não sabiam que queriam mudar de vida.

## O Poder do Facebook para Imóveis

### Segmentação Precisa
- Idade, renda, estado civil, interesses
- Pessoas que visitam sites imobiliários
- Quem mora de aluguel há mais de 2 anos

### Formatos Visuais Impactantes
- Carroseis com múltiplas fotos
- Vídeos de tour virtual
- Stories imersivos

## Próximos Passos

1. **Configure o Pixel** corretamente no site
2. **Crie campanhas de teste** com R$ 50/dia
3. **Monitore métricas** diariamente na primeira semana

*O Facebook Ads é uma maratona, não um sprint. Consistência e paciência geram os melhores resultados a longo prazo.*`
        }
    ]

    if (selectedArticle) {
        const article = articles.find(a => a.id === selectedArticle)
        if (article) {
            return <ArticleReader article={article} onBack={onBack} />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Aquisicao de Clientes & Venda de Imóveis</h2>
                    <p className="text-gray-600">Estratégias e insights para potencializar seus resultados</p>
                </div>
            </div>

            {/* Categorias */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {['Todos', 'Estratégia Digital', 'Google Ads', 'Facebook Ads', 'WhatsApp', 'ROI'].map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${category === 'Todos'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid de Artigos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <motion.article
                        key={article.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                        whileHover={{ y: -4 }}
                        onClick={() => onSelectArticle(article.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${article.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                                        article.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {article.difficulty}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {article.readingTime}min
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-3">
                                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                    {article.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {article.subtitle}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {article.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(article.publishDate).toLocaleDateString('pt-BR')}</span>
                                <span className="text-blue-600 font-medium group-hover:underline">
                                    Ler artigo →
                                </span>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Quer sugestões de novos tópicos?
                </h3>
                <p className="text-gray-600 mb-6">
                    Envie suas dúvidas e criaremos conteúdo personalizado para sua realidade
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all">
                    Sugerir Tópico
                </button>
            </div>
        </div>
    )
}

// Componente para leitura individual do artigo
function ArticleReader({ article, onBack }: { article: EducationalArticle, onBack: () => void }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar aos artigos
                </button>

                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end">
                        <div className="p-6 text-white">
                            <span className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full mb-3 inline-block">
                                {article.category}
                            </span>
                            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                            <p className="text-lg text-white/90">{article.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTime} min de leitura</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${article.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                            article.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {article.difficulty}
                    </span>
                </div>
            </div>

            <div className="prose prose-lg max-w-none bg-white rounded-2xl p-8 border border-gray-200">
                <div className="markdown-content whitespace-pre-line">
                    {article.content}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Gostou do conteúdo?
                </h3>
                <p className="text-gray-600 mb-4">
                    Implemente essas estratégias e veja seus resultados crescerem
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Ler Outros Artigos
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Falar com Especialista
                    </button>
                </div>
            </div>
        </div>
    )
}