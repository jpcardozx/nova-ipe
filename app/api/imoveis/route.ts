import { NextRequest } from 'next/server';
import { serverFetch } from '../../../lib/sanity/sanity.server';
import { queries } from '../../../lib/sanity/queries';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    try {
        let data;
        if (type === 'aluguel') {
            data = await serverFetch(queries.rentalProperties());
        } else if (type === 'venda') {
            data = await serverFetch(queries.saleProperties());
        } else {
            return new Response(JSON.stringify({ error: 'Invalid type parameter' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                // Cache for 1 minute on the client, revalidate every hour on the server
                'Cache-Control': 'public, s-maxage=3600, max-age=60',
            },
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
