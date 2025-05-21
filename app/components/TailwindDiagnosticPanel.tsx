'use client';

import { useState, useEffect } from 'react';
import {
  checkInstalledVersions,
  checkTailwindConfig,
  testTailwindClasses,
  TailwindVersionsResult,
  // TailwindConfigResult, // Removed unused import
  TailwindTestResult,
  TailwindEnvironmentInfo,
  TailwindConfigInfo
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

interface DiagnosticState {
  loading: boolean;
  activeTab: string;
  versions: TailwindVersionsResult | null;
  config: {
    success: boolean;
    results: Record<string, TailwindConfigInfo>;
    environment: TailwindEnvironmentInfo;
  } | null;
  tests: TailwindTestResult | null;
}

export default function TailwindDiagnosticPanel() {
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>({
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
  const switchTab = (tab: string) => {
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
      </div>      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${overallStatus.status === 'loading' ? 'bg-blue-500 animate-pulse' :
          overallStatus.status === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        <span className="font-medium">Status:</span> {overallStatus.label}
      </div>      <div className="flex border-b border-gray-200">
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
      </div>      <div className="p-4">
        {diagnosticState.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Carregando diagnóstico...</span>
          </div>
        ) : (
          <>
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
              </div>)}
            {diagnosticState.activeTab === 'config' && (
              <div>
                <h3 className="text-md font-semibold mb-3">Configuração dos arquivos</h3>
                {diagnosticState.config && diagnosticState.config.success ? (
                  <div className="space-y-3">
                    {Object.entries(diagnosticState.config.results).map(([file, info]) => (
                      <div key={file} className={`p-3 rounded border ${info.status !== 'ok' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{file}</span>
                          {info.status === 'ok' ? (
                            <span className="text-green-600 text-xs">Arquivo encontrado</span>
                          ) : (
                            <span className="text-red-600 text-xs">Arquivo não encontrado</span>
                          )}
                        </div>

                        {info.exists && info.size !== undefined && (
                          <div className="mt-1 text-xs text-gray-500">
                            Tamanho: {(info.size / 1024).toFixed(2)} KB
                          </div>
                        )}                        {info.issues && info.issues.length > 0 && (
                          <div className="mt-2 text-sm text-red-700">
                            <div className="font-medium">Problemas encontrados:</div>
                            <ul className="list-disc pl-5 mt-1 text-xs">
                              {info.issues.map((issue: string) => (
                                <li key={`issue-${file}-${issue.substring(0, 10)}`}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {info.exists && (!info.issues || info.issues.length === 0) && (
                          <div className="mt-1 text-xs text-green-600">
                            ✓ Configuração válida
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (<div className="bg-red-50 text-red-700 p-3 rounded">
                  Erro ao verificar configuração: {diagnosticState.config ? "Configuração inválida" : "Erro desconhecido"}
                </div>
                )}
              </div>
            )}            {diagnosticState.activeTab === 'tests' && diagnosticState.tests && (
              <div>
                <h3 className="text-md font-semibold mb-3">Teste de classes do Tailwind</h3>

                {diagnosticState.tests.environment === 'server' ? (
                  <div className="bg-yellow-50 text-yellow-700 p-3 rounded">
                    {diagnosticState.tests.message || 'Ambiente do servidor detectado'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-3 rounded ${diagnosticState.tests.working ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                      Status: {diagnosticState.tests.working ? 'Classes funcionando' : 'Classes não aplicadas corretamente'}
                    </div>

                    {diagnosticState.tests.results && diagnosticState.tests.results.length > 0 && (
                      <>
                        <h4 className="font-medium text-sm mt-4">Teste de classes individuais:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {diagnosticState.tests.results.map((result: { class: string; applied: boolean }) => (
                            <div
                              key={result.class}
                              className={`p-2 text-sm rounded flex items-center ${result.applied ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                                }`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-2 ${result.applied ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              {result.class}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <h4 className="font-medium text-sm text-blue-800">Demonstração visual:</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-blue-500 text-white p-2 rounded">bg-blue-500</div>
                        <div className="bg-red-500 text-white p-2 rounded">bg-red-500</div>
                        <div className="p-4 bg-gray-100 rounded">p-4</div>
                        <div className="rounded-lg border border-gray-300 p-2">rounded-lg</div>
                        <div className="shadow-md p-2 bg-white">shadow-md</div>
                        <div className="hover:bg-green-500 p-2 border border-gray-300 rounded">hover:bg-green-500</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {diagnosticState.activeTab === 'tests' && !diagnosticState.tests && (
              <div className="bg-red-50 text-red-700 p-3 rounded">
                Erro ao executar testes de classes do Tailwind.
              </div>
            )}            {diagnosticState.activeTab === 'solution' && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Soluções recomendadas</h3>

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium">1. Garantir importações corretas para Tailwind v4:</h4>                  <div className="mt-2 bg-gray-800 text-gray-200 p-3 rounded text-sm font-mono">
                    <div>{`/* globals.css */`}</div>
                    <div className="text-blue-400">@import "tailwindcss/preflight";</div>
                    <div className="text-blue-400">@tailwind utilities;</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium">2. Configuração adequada do PostCSS:</h4>                  <div className="mt-2 bg-gray-800 text-gray-200 p-3 rounded text-sm font-mono">
                    <div>{`/* postcss.config.js */`}</div>
                    <div>module.exports = {'{'}</div>
                    <div>&nbsp;&nbsp;plugins: {'{'}</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">'postcss-import'</span>: { },</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">'tailwindcss/nesting'</span>: { },</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">'tailwindcss'</span>: { },</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">'autoprefixer'</span>: {'{}'}</div>
                    <div>&nbsp;&nbsp;{'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium">3. Execute o script de correção:</h4>                  <div className="mt-2 bg-gray-800 text-gray-200 p-3 rounded text-sm font-mono">
                    <div>{`# No PowerShell:`}</div>
                    <div>.\fix-tailwind-v4.ps1</div>
                  </div>
                  <p className="mt-2 text-sm text-blue-700">
                    Este script automatiza as correções necessárias para a integração do Tailwind v4 com Next.js 15.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium">4. Limpeza e reinício:</h4>
                  <div className="mt-2 grid gap-2">
                    <div className="bg-gray-800 text-gray-200 p-2 rounded text-sm font-mono">
                      npx rimraf .next
                    </div>
                    <div className="bg-gray-800 text-gray-200 p-2 rounded text-sm font-mono">
                      npm run dev
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-medium text-yellow-800">Documentação e Recursos:</h4>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li><a href="#" className="text-blue-600 hover:underline">TAILWIND-V4-GUIA.md</a> - Guia completo para integração</li>
                    <li><a href="https://tailwindcss.com/docs" className="text-blue-600 hover:underline">Documentação oficial do Tailwind v4</a></li>
                    <li><a href="https://nextjs.org/docs" className="text-blue-600 hover:underline">Documentação do Next.js 15</a></li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
