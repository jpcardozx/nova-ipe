import Image from 'next/image';

export default function DemoUIPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-500 to-teal-500 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold mb-4">Bem-vindo à Ipê Imóveis</h1>
                    <p className="text-lg mb-6">Encontre o imóvel dos seus sonhos com a melhor consultoria imobiliária de Guararema-SP.</p>
                    <button className="bg-white text-green-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                        Explore Agora
                    </button>
                </div>
                <Image
                    src="/images/bg-outlines-fill.png"
                    alt="Background Hero"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-20"
                />
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold text-center mb-8">Por que escolher a Ipê Imóveis?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Atendimento Personalizado</h3>
                            <p className="text-gray-600">Nossa equipe está pronta para entender suas necessidades e oferecer as melhores opções.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Variedade de Imóveis</h3>
                            <p className="text-gray-600">Casas, apartamentos e terrenos para compra e aluguel em Guararema-SP.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Confiança e Credibilidade</h3>
                            <p className="text-gray-600">Anos de experiência no mercado imobiliário com clientes satisfeitos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">Pronto para encontrar seu imóvel ideal?</h2>
                    <button className="bg-white text-green-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                        Fale Conosco
                    </button>
                </div>
            </section>
        </div>
    );
}
