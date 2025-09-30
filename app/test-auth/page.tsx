'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestStudioAuth() {
    const [email, setEmail] = useState('admin@imobiliariaipe.com.br')
    const [password, setPassword] = useState('ipeplataformadigital')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const testAuth = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/test-studio-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()
            setResult(data)
        } catch (error) {
            setResult({ 
                success: false, 
                error: 'Erro na requisição: ' + error.message 
            })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Teste de Autenticação Studio</h1>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email:</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Senha:</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <Button 
                        onClick={testAuth} 
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Testando...' : 'Testar Autenticação'}
                    </Button>
                </div>

                {result && (
                    <div className="mt-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Resultado:</h3>
                        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}