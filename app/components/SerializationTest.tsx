'use client';

import { useEffect, useState } from 'react';
import { getImoveisDestaque } from '@/lib/queries';
// import { DiagnosticImage } from './DiagnosticImage'; // Component not found

// Função para serializar e desserializar um objeto
// Isso simula o que acontece quando os objetos passam do servidor para o cliente
function simulateServerClientTransfer<T>(obj: T): T {
  // Serializa para JSON e depois desserializa
  // Isso ajuda a identificar problemas de serialização entre servidor e cliente
  return JSON.parse(JSON.stringify(obj));
}

export default function SerializationTest() {
  const [originalObject, setOriginalObject] = useState<any>(null);
  const [serializedObject, setSerializedObject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Busca dados do Sanity
        const imoveis = await getImoveisDestaque();

        if (imoveis.length > 0 && imoveis[0].imagem) {
          const original = imoveis[0].imagem;
          setOriginalObject(original);

          // Simula transferência servidor-cliente
          const serialized = simulateServerClientTransfer(original);
          setSerializedObject(serialized);

          console.log('Objeto original:', original);
          console.log('Objeto após serialização:', serialized);

          // Verifica diferenças
          const differences = findDifferences(original, serialized);
          if (differences.length > 0) {
            console.warn('Diferenças encontradas após serialização:', differences);
          }
        } else {
          setError('Nenhum imóvel com imagem encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(`Erro: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Função para encontrar diferenças entre objetos
  function findDifferences(obj1: any, obj2: any, path: string = ''): string[] {
    const differences: string[] = [];

    // Se tipos forem diferentes
    if (typeof obj1 !== typeof obj2) {
      differences.push(`${path} - Tipos diferentes: ${typeof obj1} vs ${typeof obj2}`);
      return differences;
    }

    // Se não são objetos ou são null
    if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push(`${path} - Valores diferentes: ${obj1} vs ${obj2}`);
      }
      return differences;
    }

    // Para arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        differences.push(`${path} - Tamanhos de array diferentes: ${obj1.length} vs ${obj2.length}`);
      }

      const maxLength = Math.max(obj1.length, obj2.length);
      for (let i = 0; i < maxLength; i++) {
        const nestedDiff = findDifferences(obj1[i], obj2[i], `${path}[${i}]`);
        differences.push(...nestedDiff);
      }

      return differences;
    }
    // Para objetos
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of Array.from(allKeys)) {
      // Chave existe em ambos
      if (key in obj1 && key in obj2) {
        const nestedDiff = findDifferences(obj1[key], obj2[key], path ? `${path}.${key}` : key);
        differences.push(...nestedDiff);
      }
      // Chave só existe em obj1
      else if (key in obj1) {
        differences.push(`${path} - Chave '${key}' presente apenas no objeto original`);
      }
      // Chave só existe em obj2
      else {
        differences.push(`${path} - Chave '${key}' presente apenas no objeto serializado`);
      }
    }

    return differences;
  }

  function renderObjectDetails(obj: any, title: string) {
    return (
      <div className="border rounded p-3 my-2">
        <h3 className="font-bold mb-2">{title}</h3>
        {obj ? (
          <>
            <p className="mb-1">
              <span className="font-semibold">Tipo:</span> {typeof obj}
            </p>

            {typeof obj === 'object' && (
              <>
                <p className="mb-1">
                  <span className="font-semibold">Propriedades:</span> {Object.keys(obj).join(', ')}
                </p>

                <div className="grid grid-cols-2 gap-4 my-3">
                  <div>
                    <h4 className="font-semibold mb-1">Pre-visualização:</h4>
                    <div className="aspect-video relative">
                      {/* <DiagnosticImage image={obj} fill /> */}
                      <div className="bg-gray-200 flex items-center justify-center">
                        Image preview unavailable
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Detalhes:</h4>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(obj, null, 2)}
                    </pre>
                  </div>
                </div>

                {obj.asset && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Detalhes do Asset:</h4>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(obj.asset, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <p className="text-red-500">Objeto não disponível</p>
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Carregando dados para teste...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste de Serialização de Imagem</h2>

      {renderObjectDetails(originalObject, "Objeto Original (Servidor)")}
      {renderObjectDetails(serializedObject, "Objeto Após Serialização (Cliente)")}

      <div className="mt-4 border-t pt-4">
        <h3 className="font-bold mb-2">Análise de Diferenças</h3>
        {originalObject && serializedObject && (
          <div>
            {(() => {
              const differences = findDifferences(originalObject, serializedObject);
              if (differences.length === 0) {
                return <p className="text-green-600">Nenhuma diferença encontrada após serialização.</p>;
              } else {
                return (
                  <div>
                    <p className="text-red-500 mb-2">
                      {differences.length} diferença(s) encontradas durante a serialização:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {differences.map((diff, i) => (
                        <li key={i} className="text-red-700">{diff}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
