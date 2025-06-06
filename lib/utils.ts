import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';
import { differenceInYears, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Imovel } from '../src/types/sanity-schema';
import { sanityClient } from './sanity/sanity.client'; // Ajuste para o caminho correto do cliente Sanity

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ImovelFormatado {
    id: string;
    imagemUrl: string;
    imagemAlt: string;
    titulo: string;
    slug: string;
    endereco: string;
    descricao: string;
    preco: number;
    finalidade: string;
    destaque: boolean;
    caracteristicas: {
        dormitorios?: number;
        banheiros?: number;
        vagas?: number;
        areaUtil?: number;
    };
}

export function formatarImovelInfo(imovel: Imovel): ImovelFormatado {
    if (!imovel) {
        return {
            id: '',
            imagemUrl: '/placeholder-imovel.jpg',
            imagemAlt: 'Imóvel não disponível',
            titulo: 'Imóvel não disponível',
            slug: '',
            endereco: 'Endereço não disponível',
            descricao: '',
            preco: 0,
            finalidade: 'Venda',
            destaque: false,
            caracteristicas: {}
        };
    }

    const endereco = imovel.endereco || 'Endereço não informado';
    const imagemUrl = imovel.imagem && imovel.imagem.asset ? `/api/imagem/${imovel.imagem.asset._ref}` : '/placeholder-imovel.jpg';
    const imagemAlt = imovel.titulo || 'Imagem do imóvel';

    return {
        id: (imovel as any)._id || '',
        imagemUrl,
        imagemAlt,
        titulo: imovel.titulo || 'Imóvel sem título',
        slug: imovel.slug?.current || '',
        endereco,
        descricao: imovel.descricao || '',
        preco: imovel.preco || 0,
        finalidade: imovel.finalidade || 'Venda',
        destaque: imovel.destaque || false,
        caracteristicas: {
            dormitorios: imovel.dormitorios,
            banheiros: imovel.banheiros,
            vagas: imovel.vagas,
            areaUtil: imovel.areaUtil,
        }
    };
}

export function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valor);
}

export function formatarArea(area: number): string {
    return `${area}m²`;
}

export function formatarEndereco(endereco: string | undefined): string {
    return endereco || 'Endereço não informado';
}