'use client';

import { useState, useEffect } from 'react';
import {
  checkInstalledVersions,
  checkTailwindConfig,
  testTailwindClasses,
} from '@/lib/tailwind-diagnostics';

/**
 * TailwindDiagnosticPanel
 * 
 * Componente avançado de diagnóstico para análise da integração
 * do Tailwind CSS com Next.js.
 * 
 * Este componente fornece uma interface visual para identificar
 * problemas com a configuração do Tailwind CSS.
 */

export default function TailwindDiagnosticPanel() {
  const [diagnosticState, setDiagnosticState] = useState({
    loading: true,
    activeTab: 'versions',
    versions: null,
    config: null,
    tests: null
  });

  useEffect(() => {
    async function runDiagnostics() {
      // Verificar versões instaladas
      const versions = await checkInstalledVersions();

      // Verificar configuração
      const config = await checkTailwindConfig();

      // Testar classes do Tailwind
      const tests = await testTailwindClasses();

      setDiagnosticState(prev => ({
        ...prev,
        loading: false,
        versions,
        config,
        tests
      }));
    }

    runDiagnostics();
  }, []);

  const switchTab = (tab) => {
    setDiagnosticState(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  // Avaliação geral
  const getOverallStatus = () => {
    if (diagnosticState.loading) return { status: 'loading', label: 'Carregando...' };

    // Verificar se há problemas sérios
    const hasVersionIssues = diagnosticState.versions && (!diagnosticState.versions.success ||
      !diagnosticState.versions.versions.some(v => v.name === 'tailwindcss'));

    const hasConfigIssues = diagnosticState.config && (!diagnosticState.config.success ||
      Object.values(diagnosticState.config.results).some(r => r.status === 'error'));

    const hasTestIssues = diagnosticState.tests && !diagnosticState.tests.success;

    if (hasVersionIssues || hasConfigIssues || hasTestIssues) {
      return { status: 'error', label: 'Problemas encontrados' };
    }

    return { status: 'success', label: 'Tudo OK' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Diagnóstico do Tailwind CSS v4</h2>
        <p className="text-sm text-gray-600">
          Ferramenta para identificar e resolver problemas na integração Tailwind + Next.js
        </p>
      </div>

      {/* Status geral */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${overallStatus.status === 'loading' ? 'bg-blue-500 animate-pulse' :
          overallStatus.status === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        <span className="font-medium">Status:</span> {overallStatus.label}
      </div>

      {/* Navegação em abas */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => switchTab('versions')}
          className={`px-4 py-2 font-medium text-sm ${diagnosticState.activeTab === 'versions'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Versões
        </button>
        <button
          onClick={() => switchTab('config')}
          className={`px-4 py-2 font-medium text-sm ${diagnosticState.activeTab === 'config'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Configuração
        </button>
        <button
          onClick={() => switchTab('tests')}
          className={`px-4 py-2 font-medium text-sm ${diagnosticState.activeTab === 'tests'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Teste de classes
        </button>
        <button
          onClick={() => switchTab('solution')}
          className={`px-4 py-2 font-medium text-sm ${diagnosticState.activeTab === 'solution'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Solução
        </button>
      </div>

      {/* Conteúdo da aba */}
      <div className="p-4">
        {diagnosticState.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Carregando diagnóstico...</span>
          </div>
        ) : (
          <>
            {/* Aba de versões */}            
            {diagnosticState.activeTab === 'versions' && (
              <div>
                <h3 className="text-md font-semibold mb-3">Versões instaladas</h3>
                {diagnosticState.versions && diagnosticState.versions.success ? (
                  <div className="space-y-3">
                    {diagnosticState.versions.versions.map((info) => (
                      <div key={info.name} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{info.name}</span>
                          {info.error ? (
                            <span className="text-red-500 text-sm">Erro: {info.error}</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                              v{info.version}
                            </span>
                          )}
                        </div>
                        {info.path && (
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {info.path}
                          </div>
                        )}
                        {info.name === 'tailwindcss' && info.isV4 && (
                          <div className="mt-1 text-xs bg-green-50 text-green-700 p-1 rounded">
                            ✓ Usando Tailwind v4 - compatível com a sintaxe atual
                          </div>
                        )}
                        {info.name === 'tailwindcss' && !info.isV4 && !info.error && (
                          <div className="mt-1 text-xs bg-yellow-50 text-yellow-700 p-1 rounded">
                            ⚠️ Não está usando Tailwind v4 - sintaxe incompatível
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-3 rounded">
                    Erro ao verificar versões: {diagnosticState.versions?.error || "Erro desconhecido"}
                  </div>
                )}
              </div>
            )}
            
            {/* Conteúdo das outras abas está simplificado para diagnóstico */}
            {diagnosticState.activeTab === 'config' && (
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="text-md font-semibold mb-3">Configuração dos arquivos</h3>
                <p>Carregando informações de configuração...</p>
              </div>
            )}
            
            {diagnosticState.activeTab === 'tests' && (
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="text-md font-semibold mb-3">Teste de classes do Tailwind</h3>
                <p>Carregando resultados de testes...</p>
              </div>
            )}
            
            {diagnosticState.activeTab === 'solution' && (
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="text-md font-semibold mb-3">Soluções recomendadas</h3>
                <p>Verificando soluções disponíveis...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
