// types/keen-slider-react.d.ts
declare module 'keen-slider/react' {
    import type { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
    export function useKeenSlider<
        HTMLElementType = HTMLDivElement,
        OptionsType = KeenSliderOptions
    >(
        options?: OptionsType,
        plugins?: Array<(slider: KeenSliderInstance) => void | (() => void)>
    ): [React.RefObject<HTMLElementType>, { current?: KeenSliderInstance }];
    export type { KeenSliderInstance, KeenSliderOptions };
}

declare module 'keen-slider' {
    export interface KeenSliderInstance {
        on: (event: string, callback: (slider: KeenSliderInstance) => void) => void;
        next: () => void;
        prev: () => void;
        moveToIdx: (index: number) => void;
        track: {
            details: {
                rel: number;
                slides: Array<Record<string, unknown>>;
                [key: string]: unknown;
            };
            [key: string]: unknown;
        };
        container: HTMLElement;
        [key: string]: unknown;
    }

    export interface KeenSliderOptions {
        initial?: number;
        loop?: boolean;
        mode?: string;
        slides?: {
            perView?: number;
            spacing?: number;
            [key: string]: unknown;
        };
        breakpoints?: {
            [key: string]: unknown;
        };
        slideChanged?: (slider: KeenSliderInstance) => void;
        created?: (slider: KeenSliderInstance) => void;
        [key: string]: unknown;
    }
}