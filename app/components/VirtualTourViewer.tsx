'use client';

import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore - Ignore missing types for pannellum-react
import { Pannellum } from 'pannellum-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Info, Maximize, ChevronRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define tipos para os pontos de interesse (hotspots) e cenas do tour
type Hotspot = {
    id: string;
    type: 'info' | 'custom' | 'scene';
    pitch: number;
    yaw: number;
    text?: string;
    targetScene?: string;
    cssClass?: string;
    createTooltipFunc?: (hotSpotDiv: HTMLElement) => void;
};

type Scene = {
    id: string;
    title: string;
    imageUrl: string;
    hotspots?: Hotspot[];
    infoText?: string;
    thumbnail?: string;
};

interface VirtualTourViewerProps {
    scenes: Scene[];
    startScene?: string;
    autoLoad?: boolean;
    showControls?: boolean;
    showFullscreenButton?: boolean;
    showZoomControls?: boolean;
    showThumbnails?: boolean;
    className?: string;
    height?: string;
    onSceneChange?: (sceneId: string) => void;
}

export default function VirtualTourViewer({
    scenes,
    startScene,
    autoLoad = true,
    showControls = true,
    showFullscreenButton = true,
    showZoomControls = true,
    showThumbnails = true,
    className = '',
    height = 'h-[70vh]',
    onSceneChange
}: VirtualTourViewerProps) {
    // Estado para controlar a cena atual
    const [currentScene, setCurrentScene] = useState<string>(startScene || (scenes[0]?.id || ''));
    const [showInfo, setShowInfo] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [floorplanVisible, setFloorplanVisible] = useState(false);

    // Referência para o componente Pannellum
    const pannellumRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Encontrar a cena atual com base no ID
    const activeScene = scenes.find(scene => scene.id === currentScene);

    // Efeito para notificar mudanças de cena
    useEffect(() => {
        if (onSceneChange) {
            onSceneChange(currentScene);
        }
    }, [currentScene, onSceneChange]);

    // Manipulador de mudança de cena
    const handleSceneChange = (sceneId: string) => {
        setCurrentScene(sceneId);
        setShowInfo(false); // Ocultar informações ao trocar de cena
    };

    // Função para criar tooltips personalizados para os hotspots
    const createHotspotTooltip = (hotspot: Hotspot) => (hotSpotDiv: HTMLElement) => {
        // Criar elementos do tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('pannellum-tooltip');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '0.5rem 1rem';
        tooltip.style.borderRadius = '0.25rem';
        tooltip.style.transform = 'translate(-50%, -100%)';
        tooltip.style.top = '-20px';
        tooltip.style.left = '50%';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '10';
        tooltip.style.width = 'max-content';
        tooltip.style.maxWidth = '200px';
        tooltip.style.textAlign = 'center';
        tooltip.textContent = hotspot.text || '';

        // Adicionar tooltip ao hotspot
        hotSpotDiv.appendChild(tooltip);

        // Mostrar tooltip ao passar o mouse
        hotSpotDiv.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        hotSpotDiv.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Adicionar classes personalizadas se necessário
        if (hotspot.cssClass) {
            hotSpotDiv.classList.add(hotspot.cssClass);
        }
    };

    // Função para alternar modo de tela cheia
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error(`Erro ao entrar em tela cheia: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Função para navegar para a próxima cena
    const goToNextScene = () => {
        const currentIndex = scenes.findIndex(scene => scene.id === currentScene);
        const nextIndex = (currentIndex + 1) % scenes.length;
        setCurrentScene(scenes[nextIndex].id);
    };

    // Função para navegar para a cena anterior
    const goToPreviousScene = () => {
        const currentIndex = scenes.findIndex(scene => scene.id === currentScene);
        const prevIndex = (currentIndex - 1 + scenes.length) % scenes.length;
        setCurrentScene(scenes[prevIndex].id);
    };

    // Função para configurar os hotspots da cena atual
    const configureHotspots = () => {
        return activeScene?.hotspots?.map(hotspot => {
            const hotspotConfig: any = {
                id: hotspot.id,
                pitch: hotspot.pitch,
                yaw: hotspot.yaw,
                type: hotspot.type,
                cssClass: hotspot.cssClass || '',
            };

            if (hotspot.type === 'info') {
                hotspotConfig.createTooltipFunc = createHotspotTooltip(hotspot);
                hotspotConfig.text = hotspot.text;
            } else if (hotspot.type === 'scene' && hotspot.targetScene) {
                hotspotConfig.sceneId = hotspot.targetScene;
                hotspotConfig.text = hotspot.text;
                hotspotConfig.createTooltipFunc = createHotspotTooltip(hotspot);
            }

            return hotspotConfig;
        }) || [];
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative", height, className)}
            style={{ overflow: 'hidden', borderRadius: '0.75rem' }}
        >
            {activeScene && (
                <Pannellum
                    ref={pannellumRef}
                    width="100%"
                    height="100%"
                    image={activeScene.imageUrl}
                    autoLoad={autoLoad} showZoomCtrl={showZoomControls}
                    showFullscreenCtrl={false} // Usamos nosso próprio botão de tela cheia
                    // Note: showControls não é uma propriedade válida de Pannellum
                    hfov={120}
                    maxHfov={140}
                    minHfov={50}
                    hotspotDebug={false} compass={true}
                    // Note: onScenechange e hotspots não são propriedades válidas de Pannellum, removidas
                    className="rounded-xl"
                />
            )}

            {/* Controles personalizados */}
            {showControls && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-10">
                    <button
                        onClick={goToPreviousScene}
                        className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        aria-label="Cena anterior"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {showThumbnails && scenes.length > 1 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                            {scenes.map((scene) => (
                                <button
                                    key={scene.id}
                                    onClick={() => handleSceneChange(scene.id)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        currentScene === scene.id
                                            ? "bg-primary-500 w-6"
                                            : "bg-neutral-400 hover:bg-neutral-600"
                                    )}
                                    aria-label={`Ver ${scene.title}`}
                                    aria-current={currentScene === scene.id ? "true" : "false"}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        onClick={goToNextScene}
                        className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        aria-label="Próxima cena"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {/* Botões de controle (informações, planta baixa, tela cheia) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                {/* Botão de informações */}
                {activeScene?.infoText && (
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={cn(
                            "p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all",
                            showInfo && "bg-primary-500 text-white hover:bg-primary-600"
                        )}
                        aria-label={showInfo ? "Ocultar informações" : "Mostrar informações"}
                    >
                        <Info size={20} />
                    </button>
                )}

                {/* Botão de planta baixa */}
                <button
                    onClick={() => setFloorplanVisible(!floorplanVisible)}
                    className={cn(
                        "p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all",
                        floorplanVisible && "bg-primary-500 text-white hover:bg-primary-600"
                    )}
                    aria-label={floorplanVisible ? "Ocultar planta baixa" : "Mostrar planta baixa"}
                >
                    <MapPin size={20} />
                </button>

                {/* Botão de tela cheia */}
                {showFullscreenButton && (
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        aria-label={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
                    >
                        <Maximize size={20} />
                    </button>
                )}
            </div>

            {/* Painel de informações */}
            <AnimatePresence>
                {showInfo && activeScene?.infoText && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 left-4 max-w-md bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg z-10"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{activeScene.title}</h3>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-neutral-500 hover:text-neutral-700"
                                aria-label="Fechar informações"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-neutral-700">{activeScene.infoText}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Planta Baixa / Mapa */}
            <AnimatePresence>
                {floorplanVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-20 left-4 md:left-auto md:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg z-10"
                        style={{ width: '200px', height: '150px' }}
                    >
                        <div className="relative w-full h-full">
                            {/* Aqui seria renderizada uma planta baixa com pontos de navegação */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-sm text-center text-neutral-500">
                                    Planta baixa do imóvel <br />
                                    (Personalizar de acordo com o projeto)
                                </p>
                            </div>

                            {/* Exemplo de pontos de navegação */}
                            {scenes.map((scene, index) => (
                                <button
                                    key={scene.id}
                                    className={cn(
                                        "absolute w-3 h-3 rounded-full border-2 border-white transition-all",
                                        currentScene === scene.id ? "bg-primary-500" : "bg-neutral-400"
                                    )}
                                    style={{
                                        top: `${30 + (index * 25)}%`,
                                        left: `${20 + (index * 20)}%`,
                                    }}
                                    onClick={() => handleSceneChange(scene.id)}
                                    aria-label={`Ir para ${scene.title}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de miniaturas (alternativa) */}
            {showThumbnails && scenes.length > 1 && (
                <div className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 flex-col gap-2 z-10">
                    {scenes.map((scene) => (
                        <motion.button
                            key={scene.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSceneChange(scene.id)}
                            className={cn(
                                "relative overflow-hidden w-16 h-12 rounded-md transition-all border-2",
                                currentScene === scene.id
                                    ? "border-primary-500 shadow-lg"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                            aria-label={`Ver ${scene.title}`}
                            aria-current={currentScene === scene.id ? "true" : "false"}
                        >
                            {scene.thumbnail ? (
                                <img
                                    src={scene.thumbnail}
                                    alt={scene.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                    <ChevronRight size={16} />
                                </div>
                            )}
                            {currentScene === scene.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" />
                            )}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
} 