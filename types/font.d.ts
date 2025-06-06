declare global {
    interface FontFaceDescriptors {
        display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
        style?: string;
        weight?: string;
        stretch?: string;
        unicodeRange?: string;
        variant?: string;
        featureSettings?: string;
        variationSettings?: string;
    }

    interface FontFace {
        family: string;
        style: string;
        weight: string;
        stretch: string;
        unicodeRange: string;
        variant: string;
        featureSettings: string;
        variationSettings: string;
        display: string;
        status: string;
        loaded: Promise<FontFace>;
        load(): Promise<FontFace>;
    }

    interface FontFaceConstructor {
        new(family: string, source: string | ArrayBuffer, descriptors?: FontFaceDescriptors): FontFace;
        prototype: FontFace;
    }

    interface FontFaceSet {
        add(font: FontFace): void;
        check(font: string, text?: string): boolean;
        clear(): void;
        delete(font: FontFace): boolean;
        forEach(callbackfn: (value: FontFace, key: FontFace, parent: FontFaceSet) => void): void;
        load(font: string, text?: string): Promise<FontFace[]>;
        ready: Promise<FontFaceSet>;
    }

    interface Document {
        fonts: FontFaceSet;
        documentElement: HTMLElement;
    }

    interface Window {
        FontFace: FontFaceConstructor;
    }
}

export { };
