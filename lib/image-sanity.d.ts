declare module 'lib/image-sanity' {
    export function extractImageUrl(image: any): string | undefined;
    export function extractAltText(image: any, defaultAlt?: string): string;
}
