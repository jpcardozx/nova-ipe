'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/sections/NavBar'
import Footer from '@/sections/Footer'

export default function LoginPage() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const autenticarSenha = useCallback(async () => {
    setErro('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })

      if (res.ok) {
        router.push('/studio')
      } else {
        setErro('Senha incorreta. Tente novamente.')
      }
    } catch (err) {
      setErro('Erro de conexão. Tente em instantes.')
    } finally {
      setLoading(false)
    }
  }, [senha, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    autenticarSenha()
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl border border-neutral-200 space-y-6">
          <header className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Acesso Restrito</h1>
            <p className="text-sm text-neutral-500 mt-1">Autenticação de administrador</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Senha de acesso
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                required
                disabled={loading}
              />
            </div>

            {erro && (
              <div
                role="alert"
                className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Validando acesso...' : 'Entrar'}
            </button>
          </form>

          <footer className="text-center text-xs text-neutral-400 pt-4 border-t border-neutral-200">
            Ipê Imóveis · Painel administrativo
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  )
}
