// vitest.d.ts
declare module 'vitest' {
    export const describe: (name: string, callback: () => void) => void;
    export const it: (name: string, callback: () => Promise<void> | void) => void;
    export const expect: any;
    export const vi: {
        fn: <T extends (...args: any[]) => any>(implementation?: T) => jest.MockInstance<ReturnType<T>, Parameters<T>>;
        mock: (moduleName: string, factory?: () => any) => jest.Mock;
        useFakeTimers: () => void;
        useRealTimers: () => void;
        resetAllMocks: () => void;
    };
    export const beforeEach: (callback: () => void) => void;
    export const afterEach: (callback: () => void) => void;
}

// Create a Jest mock interface to match vitest's API
declare namespace jest {
    interface MockInstance<T, Y extends any[]> {
        mockReturnValue: (val: T) => MockInstance<T, Y>;
        mockResolvedValue: (val: any) => MockInstance<T, Y>;
        mockImplementation: (fn: (...args: Y) => T) => MockInstance<T, Y>;
        mockRejectedValue: (val: any) => MockInstance<T, Y>;
        mockReturnValueOnce: (val: T) => MockInstance<T, Y>;
        mockResolvedValueOnce: (val: any) => MockInstance<T, Y>;
    }
    type Mock = any;
}
