'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
    MapPin,
    Check,
    Square,
    Home as Casa,
} from 'lucide-react'

import HeroImovelSimbolico from '@/app/components/HeroImovelSimbolico'
import CardCTAImovel from '@/app/components/CardCTAImovel'
import BlocoLocalizacaoImovel from '@/app/components/BlocoLocalizacaoImovel'
import SecaoApresentacaoValor from '@/app/sections/Valor'
import Referencias from '@/app/sections/Referencias'
import Navbar from '@/app/sections/NavBar'
import Footer from '@/app/sections/Footer'

import { ImovelClient as ImovelData } from '@/src/types/imovel-client'


/* --------------------------- PROPS -------------------------------- */
interface Props {
    imovel: ImovelData
    relacionados: ImovelData[]
    preco: number
    metragem: string | null
}



/* ------------------------ COMPONENTE ------------------------------ */
export default function ImovelClient({
    imovel,
    relacionados,
    preco,
    metragem,
}: Props) {
    /* helpers ----------------------------------------------------- */
    const specs = useMemo(
        () => [
            { icon: Casa, label: 'Dormitórios', value: imovel.dormitorios },
            { icon: Check, label: 'Banheiros', value: imovel.banheiros },
            { icon: Square, label: 'Área útil', value: metragem },
        ],
        [imovel, metragem],
    )

    const [agendarOpen, setAgendarOpen] = useState(false)

    /* ------------------------- RENDER --------------------------- */
    return (
        <>
            <Navbar />

            <HeroImovelSimbolico
                titulo={imovel.titulo ?? ''}
                imagemFundo={imovel.imagem?.url ?? ''}
                preco={preco}
                destaque={imovel.destaque}
                finalidade={imovel.finalidade}
            />

            {/* SOBRE ---------------------------------------------------- */}
            <section id="sobre" className="relative py-16">
                <div className="container grid lg:grid-cols-[minmax(0,1fr)_260px] gap-12">
                    <article className="prose lg:prose-lg max-w-none">
                        <p>{imovel.descricao}</p>
                        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {specs.map(({ icon: I, label, value }) =>
                                value && (
                                    <li key={label} className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <I size={18} />
                                        </span>
                                        <span>
                                            <strong className="block text-sm font-semibold">{value}</strong>
                                            <span className="text-xs text-gray-500">{label}</span>
                                        </span>
                                    </li>
                                ),
                            )}
                        </ul>
                    </article>

                    <CardCTAImovel
                        preco={preco}
                        finalidade={imovel.finalidade}
                        full
                        destaque={imovel.destaque}
                        onAgendar={() => setAgendarOpen(true)}
                    />
                </div>
            </section>

            {/* LOCALIZAÇÃO --------------------------------------------- */}
            <section id="localizacao" className="py-20">
                <BlocoLocalizacaoImovel
                    cidade={imovel.cidade ?? ''}
                    bairro={imovel.bairro ?? ''}
                    endereco={imovel.endereco}
                    mapaLink={imovel.mapaLink}
                />
            </section>

            {/* CTA ------------------------------------------------------ */}
            <section className="container">
                <div className="my-20">
                    <CardCTAImovel
                        preco={preco}
                        finalidade={imovel.finalidade}
                        full
                        onAgendar={() => setAgendarOpen(true)}
                    />
                </div>
            </section>

            {/* RELACIONADOS ------------------------------------------- */}
            {!!relacionados.length && (
                <section id="relacionados" className="py-16 bg-gray-50">
                    <div className="container">
                        <h2 className="text-2xl font-bold mb-8">Imóveis semelhantes</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relacionados.map((rel) => (
                                <ImovelRelacionadoCard key={rel._id} imovel={rel} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <SecaoApresentacaoValor />
            <Referencias />
            <Footer />

            {/* MODAL AGENDA ------------------------------------------- */}
            <AnimatePresence>
                {agendarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 grid place-items-center px-4"
                        onClick={() => setAgendarOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="bg-white max-w-md w-full p-8 rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Agendar visita</h3>
                            {/* …formulário real aqui… */}
                            <button
                                className="mt-4 w-full py-3 rounded-xl bg-amber-600 text-white font-semibold
                           hover:bg-amber-700 transition"
                                onClick={() => setAgendarOpen(false)}
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

/* Card de relacionado simplificado -------------------------------- */
function ImovelRelacionadoCard({ imovel }: { imovel: ImovelData }) {
    const slug = imovel.slug?.current ?? ''
    return (
        <a
            href={`/imovel/${slug}`}
            className="block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
        >
            {imovel.imagem?.url && (
                <img
                    src={imovel.imagem.url}
                    alt={imovel.titulo}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                />
            )}
            <div className="p-4">
                <h3 className="font-medium">{imovel.titulo}</h3>
                <p className="text-sm text-gray-500">{imovel.cidade}</p>
            </div>
        </a>
    )
}
