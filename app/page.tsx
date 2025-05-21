// Server Component: Only data fetching, transformation, and font config
import { Montserrat } from 'next/font/google';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyType } from './components/OptimizedPropertyCard';
import { ensureNonNullProperties, extractSlugString } from './PropertyTypeFix';
import HomeClient from './page-client';

// Font config
const montSerrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-montserrat',
});

// Data transformation (no console logs, no browser-only code)
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType) {
    try {
        if (!imovel) return null;
        if (!imovel._id) imovel._id = `temp-${Date.now()}`;
        let processedImage;
        try {
            processedImage = ensureValidImageUrl(
                imovel.imagem,
                '/images/property-placeholder.jpg',
                imovel.titulo || 'Imóvel'
            );
        } catch {
            processedImage = { url: '/images/property-placeholder.jpg', alt: imovel.titulo || 'Imóvel' };
        }
        const price = typeof imovel.preco === 'number' ? imovel.preco : typeof imovel.preco === 'string' ? parseFloat(imovel.preco) || 0 : 0;
        const area = typeof imovel.areaUtil === 'number' ? imovel.areaUtil : typeof imovel.areaUtil === 'string' ? parseFloat(imovel.areaUtil) : undefined;
        const bedrooms = typeof imovel.dormitorios === 'number' ? imovel.dormitorios : typeof imovel.dormitorios === 'string' ? parseInt(imovel.dormitorios, 10) : undefined;
        const bathrooms = typeof imovel.banheiros === 'number' ? imovel.banheiros : typeof imovel.banheiros === 'string' ? parseInt(imovel.banheiros, 10) : undefined;
        const parkingSpots = typeof imovel.vagas === 'number' ? imovel.vagas : typeof imovel.vagas === 'string' ? parseInt(imovel.vagas, 10) : undefined;
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
    } catch {
        return null;
    }
}

// Fetch and process property data (server only)
async function fetchPropertiesData() {
    let imoveisDestaque = [];
    let imoveisAluguel = [];
    try {
        imoveisDestaque = await getImoveisDestaque();
    } catch { imoveisDestaque = []; }
    try {
        imoveisAluguel = await getImoveisAluguel();
    } catch { imoveisAluguel = []; }
    const destaques = normalizeDocuments<ImovelClient>(imoveisDestaque);
    const aluguel = normalizeDocuments<ImovelClient>(imoveisAluguel);
    const destaquesProcessados = ensureNonNullProperties(
        destaques.map(imovel => transformPropertyData(
            imovel,
            imovel.finalidade === 'Venda' ? 'sale' : 'rent' as PropertyType
        ))
    );
    const aluguelProcessados = ensureNonNullProperties(
        aluguel.map(imovel => transformPropertyData(imovel, 'rent' as PropertyType))
    );
    return {
        destaques: destaquesProcessados,
        aluguel: aluguelProcessados,
    };
}

// Server component: fetch data and pass to client
export default async function Home() {
    const { destaques, aluguel } = await fetchPropertiesData();
    return (
        <HomeClient destaques={destaques} aluguel={aluguel} montSerratClass={montSerrat.className} />
    );
}