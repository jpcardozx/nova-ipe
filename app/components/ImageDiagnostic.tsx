/**
 * Diagnóstico específico para problemas de imagens
 * Executa verificações detalhadas e reporta problemas
 */

'use client';

import { useEffect } from 'react';

interface ImageDiagnosticProps {
    properties: any[];
}

export default function ImageDiagnostic({ properties }: ImageDiagnosticProps) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && properties.length > 0) {
            // Aguarda um pouco para garantir que todos os componentes foram montados
            const timer = setTimeout(() => {
                // Só mostra diagnóstico se houver problemas reais
                const hasProblems = properties.some(p => !p.imagem?.imagemUrl && !p.imagem?.asset?.url);
                if (!hasProblems) return;
                
                console.group('🔍 DIAGNÓSTICO DE IMAGENS (Apenas Problemas)');
                
                let totalImages = 0;
                let workingImages = 0;
                let brokenImages = 0;
                let missingImages = 0;
                
                const detailedReport = properties.map((property, index) => {
                    const diagnosis = {
                        index: index + 1,
                        id: property._id?.slice(-8) || 'unknown',
                        title: property.titulo?.slice(0, 30) || 'Sem título',
                        mainImage: null as string | null,
                        gallery: 0,
                        issues: [] as string[]
                    };
                    
                    // Verifica imagem principal
                    if (property.imagem?.imagemUrl) {
                        diagnosis.mainImage = property.imagem.imagemUrl;
                        totalImages++;
                        
                        // Testa se a URL é válida
                        if (property.imagem.imagemUrl.startsWith('http')) {
                            workingImages++;
                        } else {
                            brokenImages++;
                            diagnosis.issues.push('URL de imagem inválida');
                        }
                    } else if (property.imagem?.asset?.url) {
                        diagnosis.mainImage = property.imagem.asset.url;
                        totalImages++;
                        
                        if (property.imagem.asset.url.startsWith('http')) {
                            workingImages++;
                        } else {
                            brokenImages++;
                            diagnosis.issues.push('URL do asset inválida');
                        }
                    } else {
                        missingImages++;
                        diagnosis.issues.push('Sem imagem principal');
                    }
                    
                    // Verifica galeria
                    if (property.galeria && Array.isArray(property.galeria)) {
                        diagnosis.gallery = property.galeria.length;
                        
                        property.galeria.forEach((img: any, imgIndex: number) => {
                            if (img.imagemUrl || img.asset?.url) {
                                totalImages++;
                                const url = img.imagemUrl || img.asset.url;
                                if (url.startsWith('http')) {
                                    workingImages++;
                                } else {
                                    brokenImages++;
                                    diagnosis.issues.push(`Galeria[${imgIndex}] URL inválida`);
                                }
                            }
                        });
                    } else {
                        diagnosis.issues.push('Sem galeria de imagens');
                    }
                    
                    return diagnosis;
                });
                
                // Relatório consolidado
                console.log('📊 ESTATÍSTICAS GERAIS:');
                console.table({
                    'Total de propriedades': properties.length,
                    'Total de imagens': totalImages,
                    'Imagens funcionando': workingImages,
                    'URLs quebradas': brokenImages,
                    'Propriedades sem imagem': missingImages,
                    'Taxa de sucesso': `${Math.round((workingImages / totalImages) * 100)}%`
                });
                
                console.log('🏠 DIAGNÓSTICO POR PROPRIEDADE:');
                console.table(detailedReport.map(d => ({
                    '#': d.index,
                    'ID': d.id,
                    'Título': d.title,
                    'Img Principal': d.mainImage ? '✅' : '❌',
                    'Galeria': d.gallery,
                    'Problemas': d.issues.length
                })));
                
                // Testa algumas URLs aleatoriamente
                const sampleImages = detailedReport
                    .filter(d => d.mainImage)
                    .slice(0, 3)
                    .map(d => d.mainImage);
                
                if (sampleImages.length > 0) {
                    console.log('🧪 TESTE DE CONECTIVIDADE (amostra):');
                    sampleImages.forEach(async (url, index) => {
                        if (url) {
                            try {
                                const response = await fetch(url, { method: 'HEAD' });
                                console.log(`${response.ok ? '✅' : '❌'} Imagem ${index + 1}: ${response.status} - ${url.slice(-30)}`);
                            } catch (error) {
                                console.log(`❌ Imagem ${index + 1}: ERRO - ${url.slice(-30)}`);
                            }
                        }
                    });
                }
                
                // Problemas mais comuns
                const allIssues = detailedReport.flatMap(d => d.issues);
                const issueCounts = allIssues.reduce((acc, issue) => {
                    acc[issue] = (acc[issue] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                
                if (Object.keys(issueCounts).length > 0) {
                    console.log('⚠️ PROBLEMAS MAIS COMUNS:');
                    console.table(issueCounts);
                }
                
                // Recomendações
                console.log('💡 RECOMENDAÇÕES:');
                if (missingImages > 0) {
                    console.log(`• ${missingImages} propriedades sem imagem principal - verificar queries Sanity`);
                }
                if (brokenImages > 0) {
                    console.log(`• ${brokenImages} URLs inválidas - verificar configuração CDN Sanity`);
                }
                if (workingImages / totalImages < 0.8) {
                    console.log('• Taxa de sucesso baixa - revisar mapeamento de dados');
                }
                
                console.groupEnd();
                
            }, 3000); // 3 segundos para garantir que tudo carregou
            
            return () => clearTimeout(timer);
        }
    }, [properties]);
    
    return null; // Componente invisível
}