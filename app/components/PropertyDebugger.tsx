'use client';

import React, { useState } from 'react';
import { validatePropertyData } from '../utils/propertyValidator';
import { debugImageObject } from '../utils/imageDebugger';

interface PropertyDebuggerProps {
    properties: any[];
    showInDev?: boolean;
}

/**
 * Componente de diagnóstico para detectar e relatar problemas com dados de propriedades
 * Só é visível em ambiente de desenvolvimento ou quando forçado
 */
export default function PropertyDebugger({ properties = [], showInDev = true }: PropertyDebuggerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

    // Verificar ambiente - só mostrar em desenvolvimento
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !showInDev) return null;

    // Validar todas as propriedades
    const validationResults = properties.map(prop => validatePropertyData(prop));
    const invalidProperties = validationResults.filter(result => !result.isValid);

    // Se tudo estiver válido e não for forçado, não mostrar nada
    if (invalidProperties.length === 0 && !isExpanded) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 shadow-xl bg-white border border-red-200 rounded-lg overflow-hidden max-w-md">
            <div
                className="bg-red-500 text-white px-4 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="font-medium">
                    Diagnóstico de Propriedades {invalidProperties.length > 0 && `(${invalidProperties.length} com erro)`}
                </h3>
                <span>{isExpanded ? '▼' : '▲'}</span>
            </div>

            {isExpanded && (
                <div className="p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-3">
                        Este é um componente de diagnóstico visível apenas em desenvolvimento.
                    </p>

                    {properties.length > 0 ? (
                        <div>
                            <p className="font-medium mb-2">{properties.length} propriedades detectadas</p>

                            <ul className="space-y-2">
                                {properties.map((prop, index) => {
                                    const validation = validationResults[index];
                                    const isValid = validation.isValid;

                                    return (
                                        <li
                                            key={prop.id || index}
                                            className={`p-3 border rounded ${isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium">
                                                    {prop.title || `Propriedade ${index + 1}`}
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        setSelectedProperty(selectedProperty === index ? null : index);
                                                        if (selectedProperty !== index) {
                                                            console.log(`Detalhes da propriedade ${index}:`, prop);
                                                            if (prop.mainImage) {
                                                                debugImageObject(prop.mainImage, `Propriedade ${index} - mainImage`);
                                                            }
                                                        }
                                                    }}
                                                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    {selectedProperty === index ? 'Ocultar detalhes' : 'Ver detalhes'}
                                                </button>
                                            </div>

                                            {!isValid && (
                                                <div className="mt-2 text-sm text-red-600">
                                                    <p className="font-medium">Problemas encontrados:</p>
                                                    <ul className="list-disc pl-5">
                                                        {validation.invalidFields.map((field, i) => (
                                                            <li key={i}>{field.field}: {field.reason}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {selectedProperty === index && (
                                                <div className="mt-3 text-xs border-t border-gray-200 pt-2">
                                                    <p className="font-medium">URL da Imagem:</p>
                                                    <code className="block bg-gray-100 p-1 mt-1 break-all">
                                                        {prop.mainImage?.url || 'URL não encontrada'}
                                                    </code>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <p>Nenhuma propriedade encontrada.</p>
                    )}

                    <div className="mt-4 text-xs text-gray-500">
                        <p>
                            Para diagnósticos avançados, abra o console do navegador (F12) e
                            clique em "Ver detalhes" nas propriedades acima.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
