// Declaration file for missing tailwindcss module
declare module 'tailwindcss/defaultTheme' {
    const defaultTheme: {
        screens: {
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
        };
        colors: Record<string, Record<string, string> | string>;
        spacing: Record<string, string>;
        fontFamily: Record<string, string[]>;
        fontSize: Record<string, [string, { lineHeight: string }]>;
        borderRadius: Record<string, string>;
        // Add other properties as needed
    };
    export default defaultTheme;
}
