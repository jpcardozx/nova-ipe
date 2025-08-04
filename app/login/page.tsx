'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../sections/NavBar'
import Footer from '../sections/Footer'

const AUTH_COOKIE_NAME = 'admin-auth'

export default function LoginPage() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const redirecionarParaStudio = useCallback(() => {
    window.location.assign('/studio')
  }, [])

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
        redirecionarParaStudio()
      } else {
        setErro('Senha incorreta. Verifique e tente novamente.')
      }
    } catch {
      setErro('Erro de rede. Tente novamente em instantes.')
    } finally {
      setLoading(false)
    }
  }, [senha, redirecionarParaStudio])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    autenticarSenha()
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl border border-neutral-200 space-y-6">
          <header className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-neutral-900">Acesso Restrito</h1>
            <p className="text-sm text-neutral-500">
              Área exclusiva para sócios e administradores da Ipê Imóveis
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-neutral-700 mb-1">
                Senha de acesso
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all"
                required
                disabled={loading}
                aria-describedby={erro ? 'erro-senha' : undefined}
              />
            </div>

            {erro && (
              <div
                id="erro-senha"
                role="alert"
                className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-all font-medium disabled:opacity-60"
            >
              {loading ? 'Validando acesso...' : 'Acessar painel'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-neutral-400 border-t border-neutral-200">
            Sessão ativa?{' '}
            <button
              onClick={handleLogout}
              className="text-amber-400 hover:underline font-medium"
            >
              Finalizar acesso
            </button>
          </div>

          <footer className="text-center text-xs text-neutral-400 pt-4">
            Ipê Imóveis · Painel Administrativo
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  )
}
