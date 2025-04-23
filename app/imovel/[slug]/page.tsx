import { use, Suspense } from 'react';
import { sanityClient } from '@/lib/sanity';
import { queryImovelPorSlug } from '@/lib/queries';
import type { Metadata } from 'next';
import type { ImovelExtended } from '@/src/types/imovel-extended';

import HeroImovelSimbolico from '@/app/components/HeroImovelSimbolico';
import CardCTAImovel from '@/app/components/CardCTAImovel';
import BlocoLocalizacaoImovel from '@/app/components/BlocoLocalizacaoImovel';
import Referencias from '@/app/sections/Referencias';
import { notFound } from 'next/navigation';
import { formatarArea } from '@/src/lib/utils';
import Navbar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';
import SecaoApresentacaoValor from '@/app/sections/Valor';

// Função para gerar os parâmetros estáticos
export async function generateStaticParams() {
    const slugs: { slug: { current: string } }[] = await sanityClient.fetch(
        `*[_type == "imovel" && defined(slug.current)]{ slug }`
    );

    return slugs.map(({ slug }) => ({
        slug: slug.current,
    }));
}

// Função para gerar os metadados da página
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;

    const imovel: ImovelExtended | null = await sanityClient.fetch(queryImovelPorSlug, { slug });

    if (!imovel) return {};

    const title = imovel.metaTitle || `${imovel.titulo} | Ipê Imóveis`;
    const description =
        imovel.metaDescription ||
        `Veja os detalhes deste imóvel em ${imovel.cidade}. Curadoria exclusiva da Ipê Imóveis.`;

    return {
        title,
        description,
        metadataBase: new URL('https://ipeimoveis.com'),
        alternates: {
            canonical: `https://ipeimoveis.com/imovel/${slug}`,
        },
        openGraph: {
            title,
            description,
            images: imovel.imagemOpenGraph?.asset?.url
                ? [{ url: imovel.imagemOpenGraph.asset.url }]
                : imovel.imagem?.asset?.url
                    ? [{ url: imovel.imagem.asset.url }]
                    : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Componente principal da página
export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    return (
        <div>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <ImovelPage slug={slug} />
            </Suspense>
            <SecaoApresentacaoValor />
            <Footer />
        </div>
    );
}

// Componente que renderiza os detalhes do imóvel
async function ImovelPage({ slug }: { slug: string }) {
    const imovel: ImovelExtended | null = await sanityClient.fetch(queryImovelPorSlug, { slug });

    if (!imovel) return notFound();

    const imagemUrl = imovel.imagem?.asset?.url || '/imoveis/bg3.jpg';

    return (
        <main className="w-full bg-gradient-to-br from-[#fef8e4] to-[#fff] text-[#0D1F2D]">
            <Navbar />
            <HeroImovelSimbolico
                titulo={imovel.titulo ?? ''}
                cidade={imovel.cidade ?? ''}
                tipo={imovel.finalidade ?? ''}
                metros={imovel.metros ?? ''}
                imagemFundo={imagemUrl}
                destaque={imovel.destaque ?? false}
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 mt-24 grid md:grid-cols-2 gap-16 items-start">
                <article className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-semibold border-l-4 border-[#FFAD43] pl-4">
                        Detalhes do imóvel
                    </h2>

                    <p className="text-base md:text-lg text-[#0D1F2D]/80 whitespace-pre-line leading-relaxed">
                        {imovel.descricao ??
                            'Este imóvel está em processo de curadoria. Em breve traremos todos os detalhes para você.'}
                    </p>

                    <div className="grid gap-3 text-sm text-[#0D1F2D]/80">
                        {imovel.metros && (
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFAD43] font-semibold">📐 Área:</span>
                                {formatarArea(Number(imovel.metros))}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-[#FFAD43] font-semibold">📄 Documentação:</span>
                            {imovel.documentacaoOk ? '100% regularizada' : 'Em análise'}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#FFAD43] font-semibold">🏘️ Vizinhança:</span>
                            Local tranquilo e seguro
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                        ✅ Verificado pela equipe Ipê
                    </div>
                </article>

                <aside className="sticky top-28">
                    <CardCTAImovel
                        preco={imovel.preco}
                        titulo={imovel.titulo ?? ''}
                        linkPersonalizado={imovel.linkPersonalizado ?? ''}
                        destaque={imovel.destaque ?? false}
                    />
                </aside>
            </section>

            <div className="max-w-6xl mx-auto px-6 md:px-8 mt-24">
                <BlocoLocalizacaoImovel
                    endereco={imovel.endereco ?? ''}
                    cidade={imovel.cidade ?? ''}
                    mapaLink={imovel.mapaLink ?? ''}
                />
            </div>

            <div className="mt-24">
                <Referencias />
            </div>
            <Footer />
        </main>
    );
}
