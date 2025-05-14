'use client';

import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";
import Image from 'next/image';

export default function ShadcnDemo() {
    const [loading, setLoading] = useState(false);

    // Função para demonstrar o toast
    const showToast = (type: 'default' | 'success' | 'error' | 'info' | 'warning') => {
        const messages = {
            default: "Esta é uma mensagem padrão",
            success: "Operação realizada com sucesso!",
            error: "Ocorreu um erro na operação",
            info: "Informação importante para você",
            warning: "Atenção! Verifique os dados"
        };

        const descriptions = {
            default: "Detalhes adicionais sobre esta notificação",
            success: "Os dados foram salvos corretamente no servidor",
            error: "Não foi possível conectar ao servidor",
            info: "Este recurso estará disponível em breve",
            warning: "Alguns campos estão incompletos"
        };

        switch (type) {
            case 'success':
                toast.success(messages.success, { description: descriptions.success });
                break;
            case 'error':
                toast.error(messages.error, { description: descriptions.error });
                break;
            case 'info':
                toast.info(messages.info, { description: descriptions.info });
                break;
            case 'warning':
                toast.warning(messages.warning, { description: descriptions.warning });
                break;
            default:
                toast(messages.default, { description: descriptions.default });
        }
    };

    // Função simulando carregamento
    const handleLoadDemo = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToast('success');
        }, 1500);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-2">Shadcn/UI Componentes</h1>
            <p className="text-neutral-600 mb-8">
                Demonstração dos componentes shadcn/ui instalados
            </p>

            <Tabs defaultValue="carousel" className="mb-12">
                <TabsList className="mb-8">
                    <TabsTrigger value="carousel">Carousel</TabsTrigger>
                    <TabsTrigger value="accordion">Accordion</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="carousel" className="space-y-8">
                    <h2 className="text-2xl font-semibold mb-4">Caroussel Shadcn</h2>

                    <Carousel className="w-full max-w-4xl mx-auto">
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <AspectRatio ratio={16 / 9} className="bg-neutral-100 rounded-md overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center relative">
                                                <Image
                                                    src={`/images/casaEx${index + 1 || 1}.jpg`}
                                                    alt={`Slide ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                                                    Slide {index + 1}
                                                </div>
                                            </div>
                                        </AspectRatio>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </TabsContent>

                <TabsContent value="accordion" className="space-y-8">
                    <h2 className="text-2xl font-semibold mb-4">Accordion</h2>

                    <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>O que é o sistema Ipê Imóveis?</AccordionTrigger>
                            <AccordionContent>
                                Ipê Imóveis é uma plataforma imobiliária completa para gerenciamento de imóveis,
                                com recursos avançados para compra, venda e aluguel de propriedades. O sistema
                                conta com interface otimizada seguindo as melhores práticas de UI/UX.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Como filtrar imóveis por características?</AccordionTrigger>
                            <AccordionContent>
                                Na interface principal, utilize os filtros avançados para selecionar
                                características como número de quartos, banheiros, vagas de garagem,
                                localização e faixa de preço. Os resultados serão atualizados em tempo real.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>O que são as bibliotecas UI/UX implementadas?</AccordionTrigger>
                            <AccordionContent>
                                São um conjunto de ferramentas modernas para melhorar a experiência do usuário
                                e otimizar a performance da aplicação. Incluem componentes para carrossel,
                                exibição de imagens, feedback visual, e controles de formulário acessíveis.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-8">
                    <h2 className="text-2xl font-semibold mb-4">Componentes de Feedback</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium">Toast Notifications</h3>
                            <div className="space-y-2">
                                <Button onClick={() => showToast('default')}>Toast Padrão</Button>
                                <Button onClick={() => showToast('success')} variant="outline" className="ml-2">
                                    Sucesso
                                </Button>
                                <Button onClick={() => showToast('error')} variant="destructive" className="ml-2">
                                    Erro
                                </Button>
                                <Button onClick={() => showToast('info')} variant="secondary" className="ml-2">
                                    Informação
                                </Button>
                                <Button onClick={() => showToast('warning')} variant="outline" className="ml-2 border-yellow-500 text-yellow-600">
                                    Alerta
                                </Button>
                            </div>
                            <Toaster />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-medium">Skeletons</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                                <Skeleton className="h-[250px] w-full rounded-xl" />
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-xl font-medium mb-4">Avatares</h3>
                        <div className="flex flex-wrap gap-4">
                            <Avatar>
                                <AvatarImage src="/images/cliente1.png" alt="Cliente 1" />
                                <AvatarFallback>JP</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage src="/images/cliente2.png" alt="Cliente 2" />
                                <AvatarFallback>MC</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>C3</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>+5</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
