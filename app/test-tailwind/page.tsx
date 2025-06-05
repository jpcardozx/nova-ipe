export default function TestTailwind() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    ✅ Tailwind CSS v4 Funcionando!
                </h1>
                <p className="text-gray-600 mb-6">
                    Sistema consolidado com cores do Ipê e configuração otimizada.
                </p>
                <div className="flex gap-4 mb-6">
                    <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded transition-colors">
                        Botão Primário
                    </button>
                    <button className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 px-4 rounded transition-colors">
                        Botão Secundário
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-100 rounded text-center">
                        <div className="w-full h-4 bg-primary rounded mb-2"></div>
                        <span className="text-sm text-green-800">Verde Ipê</span>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded text-center">
                        <div className="w-full h-4 bg-accent-yellow rounded mb-2"></div>
                        <span className="text-sm text-yellow-800">Amarelo Ipê</span>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-primary rounded">
                    <p className="text-primary font-medium">
                        🎨 Sistema de Design Ipê ativo
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Tailwind CSS v4 + PostCSS configurado corretamente
                    </p>
                </div>
            </div>
        </div>
    );
}
