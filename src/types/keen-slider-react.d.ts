// types/keen-slider-react.d.ts
declare module 'keen-slider/react' {
    import type { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
    export function useKeenSlider<
        HTMLElementType = HTMLDivElement,
        OptionsType = KeenSliderOptions
    >(
        options?: OptionsType,
        plugins?: any[]
    ): [React.RefObject<HTMLElementType>, { current?: KeenSliderInstance }];
    export type { KeenSliderInstance, KeenSliderOptions };
}

declare module 'keen-slider' {
    export interface KeenSliderInstance {
        on: (event: string, callback: Function) => void;
        next: () => void;
        prev: () => void;
        moveToIdx: (index: number) => void;
        track: {
            details: {
                rel: number;
                slides: any[];
                [key: string]: any;
            };
            [key: string]: any;
        };
        container: HTMLElement;
        [key: string]: any;
    }

    export interface KeenSliderOptions {
        initial?: number;
        loop?: boolean;
        mode?: string;
        slides?: {
            perView?: number;
            spacing?: number;
            [key: string]: any;
        };
        breakpoints?: {
            [key: string]: any;
        };
        slideChanged?: (slider: KeenSliderInstance) => void;
        created?: (slider: KeenSliderInstance) => void;
        [key: string]: any;
    }
}