// testing-library.d.ts
declare module '@testing-library/react' {
    export function renderHook<Result, Props>(
        render: (props: Props) => Result,
        options?: {
            initialProps?: Props;
            wrapper?: React.ComponentType<{ children: React.ReactNode }>;
        }
    ): {
        result: {
            current: Result;
        };
        rerender: (props: Props) => void;
        unmount: () => void;
    };

    export function act(callback: () => Promise<void> | void): Promise<void> | void;
}
