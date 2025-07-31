'use client';

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "../../lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
    children: React.ReactNode;
    className?: string;
}

const CarouselContext = React.createContext<{
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} | null>(null);

function Carousel({
    opts,
    plugins,
    orientation = "horizontal",
    setApi,
    children,
    className,
}: CarouselProps) {
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const [carouselRef, api] = useEmblaCarousel({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
    }, plugins);

    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const onSelect = React.useCallback(() => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, [api]);

    React.useEffect(() => {
        if (!api) return;
        setApi?.(api);
        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api?.off("select", onSelect);
            api?.off("reInit", onSelect);
        };
    }, [api, onSelect, setApi]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                api,
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
            }}
        >
            <div className={cn("relative", className)}>
                <div ref={carouselRef} className="overflow-hidden">
                    <div className="flex">
                        {children}
                    </div>
                </div>
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex", className)} {...props} />;
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("min-w-0 flex-shrink-0 flex-grow-0", className)} {...props} />;
}

function CarouselPrevious({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { scrollPrev, canScrollPrev } = React.useContext(CarouselContext) || {};

    return (
        <button
            className={cn("absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full", className)}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous slide</span>
        </button>
    );
}

function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { scrollNext, canScrollNext } = React.useContext(CarouselContext) || {};

    return (
        <button
            className={cn("absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full", className)}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="sr-only">Next slide</span>
        </button>
    );
}

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
};
export default Carousel;