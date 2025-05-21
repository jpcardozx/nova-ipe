export const logger = {
    log: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(...args);
        }
    },
    warn: (...args: any[]) => {
        console.warn(...args);
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
    debug: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(...args);
        }
    },
    info: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.info(...args);
        }
    },
};
