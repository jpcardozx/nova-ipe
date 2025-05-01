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