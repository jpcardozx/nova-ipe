// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Definir runtime como edge (necessário para o ImageResponse)
export const runtime = 'edge';

// Rota de API para gerar imagens OG dinâmicas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros da imagem
        const title = searchParams.get('title') || 'Nova Ipê Imobiliária';
        const subtitle = searchParams.get('subtitle') || 'Imóveis Premium em Guararema';
        const type = searchParams.get('type') || 'default'; // default, imovel, whatsapp

        // Cores e estilos com base no tipo
        const bgColor = type === 'whatsapp' ? '#128C7E' : '#0D1F2D';
        const textColor = '#FFFFFF';
        const accentColor = '#E5A453';        // Carregando a fonte
        let montserratMedium, montserratBold;
        try {
            // Tenta carregar fontes localmente
            montserratMedium = await fetch(
                new URL('../../../public/fonts/Montserrat-Medium.ttf', import.meta.url)
            ).then((res) => res.arrayBuffer());

            montserratBold = await fetch(
                new URL('../../../public/fonts/Montserrat-Bold.ttf', import.meta.url)
            ).then((res) => res.arrayBuffer());
        } catch (e) {
            // Fallback: usa fontes do Google Fonts CDN
            console.warn('Fontes locais não encontradas, usando CDN:', e);
            montserratMedium = await fetch(
                'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aXp-p7K4KLg.woff2'
            ).then((res) => res.arrayBuffer());

            montserratBold = await fetch(
                'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.woff2'
            ).then((res) => res.arrayBuffer());
        }

        // Altura e largura com base no tipo (WhatsApp prefere imagens mais quadradas)
        const width = type === 'whatsapp' ? 800 : 1200;
        const height = type === 'whatsapp' ? 800 : 630;

        // Gerar a imagem dinamicamente
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: bgColor,
                        padding: '40px',
                        position: 'relative',
                        fontFamily: '"Montserrat"',
                        overflow: 'hidden',
                    }}
                >
                    {/* Elemento decorativo - Folha estilizada */}
                    <div
                        style={{
                            position: 'absolute',
                            right: '-50px',
                            bottom: '-50px',
                            width: '300px',
                            height: '300px',
                            opacity: 0.1,
                            borderRadius: '50%',
                            background: accentColor,
                        }}
                    />

                    {/* Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '32px',
                        }}
                    >
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M30 0L55 15V45L30 60L5 45V15L30 0Z"
                                fill={accentColor}
                            />
                            <path
                                d="M30 12L45 20.5V37.5L30 46L15 37.5V20.5L30 12Z"
                                fill={bgColor}
                            />
                        </svg>
                        <div
                            style={{
                                marginLeft: '16px',
                                fontSize: '28px',
                                fontWeight: 700,
                                color: textColor,
                            }}
                        >
                            Nova Ipê
                        </div>
                    </div>

                    {/* Título principal */}
                    <div
                        style={{
                            fontSize: '48px',
                            fontWeight: 700,
                            textAlign: 'center',
                            color: textColor,
                            marginBottom: '16px',
                            maxWidth: '90%',
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </div>

                    {/* Subtítulo */}
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 500,
                            textAlign: 'center',
                            color: accentColor,
                            maxWidth: '80%',
                        }}
                    >
                        {subtitle}
                    </div>

                    {/* Rodapé */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '24px',
                            fontSize: '14px',
                            color: textColor,
                            opacity: 0.7,
                        }}
                    >
                        www.novaipe.com.br
                    </div>
                </div>
            ),
            {
                width,
                height,
                fonts: [
                    {
                        name: 'Montserrat',
                        data: montserratMedium,
                        weight: 500,
                        style: 'normal',
                    },
                    {
                        name: 'Montserrat',
                        data: montserratBold,
                        weight: 700,
                        style: 'normal',
                    },
                ],
            }
        );
    } catch (error) {
        // Em caso de erro, retorna uma imagem estática de fallback
        return new Response(`Erro ao gerar imagem OG: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, {
            status: 500,
        });
    }
}
