import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyType } from './components/OptimizedPropertyCard';
import { ensureNonNullProperties, extractSlugString } from './PropertyTypeFix';

// Import universal dynamic import helper that works in both server and client
import { universalDynamicImport } from './utils/dynamic-import-helper';

// Lazy load client components with universal dynamic import helper
const HomeClient = dynamic(
    universalDynamicImport(() => import('./page-client'), 'HomeClient'),
    {
        loading: () => (
            <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        ),
        ssr: true
    }
);

// Memoized data transformation
const transformPropertyData = (imovel: ImovelClient, propertyType: PropertyType) => {
    if (!imovel?._id) return null;

    try {
        const processedImage = ensureValidImageUrl(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const price = Number(imovel.preco) || 0;
        const area = Number(imovel.areaUtil) || undefined;
        const bedrooms = Number(imovel.dormitorios) || undefined;
        const bathrooms = Number(imovel.banheiros) || undefined;
        const parkingSpots = Number(imovel.vagas) || undefined;
        const slug = extractSlugString(imovel.slug, imovel._id);

        return {
            id: imovel._id,
            title: imovel.titulo || 'Imóvel em destaque',
            slug,
            location: imovel.bairro || '',
            city: imovel.cidade || 'Guararema',
            price,
            propertyType,
            area,
            bedrooms,
            bathrooms,
            parkingSpots,
            mainImage: processedImage,
            isHighlight: true,
            isPremium: Boolean(imovel.destaque),
            isNew: propertyType === 'rent' && Math.random() > 0.7,
        };
    } catch (error) {
        console.error('Error transforming property data:', error);
        return null;
    }
};

// Optimized data fetching
async function fetchPropertiesData() {
    try {
        const [imoveisDestaque, imoveisAluguel] = await Promise.all([
            getImoveisDestaque().catch(() => []),
            getImoveisAluguel().catch(() => [])
        ]);

        const destaques = normalizeDocuments<ImovelClient>(imoveisDestaque);
        const aluguel = normalizeDocuments<ImovelClient>(imoveisAluguel);

        return {
            destaques: ensureNonNullProperties(
                destaques.map(imovel =>
                    transformPropertyData(imovel, imovel.finalidade === 'Venda' ? 'sale' : 'rent')
                )
            ),
            aluguel: ensureNonNullProperties(
                aluguel.map(imovel => transformPropertyData(imovel, 'rent'))
            ),
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { destaques: [], aluguel: [] };
    }
}

export default async function Home() {
    const { destaques, aluguel } = await fetchPropertiesData();

    return (
        <main>
            <Suspense fallback={
                <div className="min-h-[60vh] grid place-items-center bg-neutral-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-neutral-600 text-sm">Carregando</span>
                    </div>
                </div>
            }>
                <HomeClient destaques={destaques} aluguel={aluguel} />
            </Suspense>
        </main>
    );
}