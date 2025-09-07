'use client';

import { formatarMoeda } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Ruler } from 'lucide-react';

interface MobilePropertyCardProps {
    property: {
        _id: string;
        titulo?: string;
        preco?: number;
        bairro?: string;
        cidade?: string;
        dormitorios?: number;
        banheiros?: number;
        area?: number;
        imagem?: {
            imagemUrl?: string;
            alt?: string;
        };
        slug?: string | { current: string };
    };
    className?: string;
}

const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({ property, className = '' }) => {
    const slug = typeof property.slug === 'string' ? property.slug : property.slug?.current || property._id;
    const location = [property.bairro, property.cidade].filter(Boolean).join(', ');

    return (
        <Link href={`/imovel/${slug}`} className={`block ${className}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                    {property.imagem?.imagemUrl ? (
                        <Image
                            src={property.imagem.imagemUrl}
                            alt={property.imagem.alt || property.titulo || 'Imóvel'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">Sem imagem</span>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.titulo}</h3>

                    {location && (
                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin size={16} className="mr-1" />
                            <span className="text-sm">{location}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {property.dormitorios && (
                            <div className="flex items-center">
                                <Bed size={16} className="mr-1" />
                                <span>{property.dormitorios}</span>
                            </div>
                        )}
                        {property.banheiros && (
                            <div className="flex items-center">
                                <Bath size={16} className="mr-1" />
                                <span>{property.banheiros}</span>
                            </div>
                        )}
                        {property.area && (
                            <div className="flex items-center">
                                <Ruler size={16} className="mr-1" />
                                <span>{property.area}m²</span>
                            </div>
                        )}
                    </div>

                    {property.preco && (
                        <div className="text-2xl font-bold text-blue-600">
                            {formatarMoeda(property.preco)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MobilePropertyCard;
