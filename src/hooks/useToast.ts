'use client';

import * as React from 'react';

// Define ToasterToast type locally instead of importing
type ToastActionType = {
    altText?: string;
    onClick: () => void;
    label: string;
};

type ToasterToast = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionType;
    duration?: number;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000; // em ms

const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return `toast-${count}`;
}

type ActionType = {
    type: typeof actionTypes[keyof typeof actionTypes];
    toast?: ToasterToast;
    toastId?: string;
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration: number = 5000) => {
    if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId));
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: actionTypes.DISMISS_TOAST,
            toastId,
        });
    }, duration);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: ToasterToast[], action: ActionType): ToasterToast[] => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            if (!action.toast) return state;

            const newToast = { ...action.toast };

            if (state.length >= TOAST_LIMIT) {
                const oldestToast = state[0];
                if (oldestToast && toastTimeouts.has(oldestToast.id)) {
                    clearTimeout(toastTimeouts.get(oldestToast.id)!);
                    toastTimeouts.delete(oldestToast.id);
                }
                return [...state.slice(1, TOAST_LIMIT), newToast];
            }

            return [...state, newToast];

        case actionTypes.UPDATE_TOAST:
            if (!action.toast) return state;
            return state.map((t) =>
                t.id === action.toast?.id ? { ...t, ...action.toast } : t
            );

        case actionTypes.DISMISS_TOAST:
            if (!action.toastId) return state;

            const newState = state.map((t) =>
                t.id === action.toastId ? { ...t, open: false } : t
            );

            setTimeout(() => {
                dispatch({
                    type: actionTypes.REMOVE_TOAST,
                    toastId: action.toastId,
                });
            }, TOAST_REMOVE_DELAY);

            return newState;

        case actionTypes.REMOVE_TOAST:
            if (!action.toastId) return state;
            return state.filter((t) => t.id !== action.toastId);

        default:
            return state;
    }
};

const listeners: Array<(state: ToasterToast[]) => void> = [];

let memoryState: ToasterToast[] = [];

function dispatch(action: ActionType) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast(props: Toast) {
    const id = genId();

    const update = (props: ToasterToast) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
        });

    const dismiss = () =>
        dispatch({
            type: actionTypes.DISMISS_TOAST,
            toastId: id,
        });

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            duration: props.duration || 5000,
            onOpenChange: (open) => {
                if (!open) {
                    dismiss();
                }
            },
        },
    });

    const duration = props.duration || 5000;
    if (duration > 0) {
        addToRemoveQueue(id, duration);
    }

    return {
        id,
        dismiss,
        update,
    };
}

function useToast() {
    const [state, setState] = React.useState<ToasterToast[]>([]);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    // Variantes de toast convenientes
    const success = (props: Omit<Toast, 'variant'>) =>
        toast({ ...props, variant: 'success' });

    const error = (props: Omit<Toast, 'variant'>) =>
        toast({ ...props, variant: 'destructive' });

    const warning = (props: Omit<Toast, 'variant'>) =>
        toast({ ...props, variant: 'warning' });

    const info = (props: Omit<Toast, 'variant'>) =>
        toast({ ...props, variant: 'info' });

    return {
        toast,
        success,
        error,
        warning,
        info,
        dismiss: (toastId?: string) => {
            if (toastId) {
                dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
            } else {
                // Dismiss all toasts
                state.forEach(t => {
                    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: t.id });
                });
            }
        },
        toasts: state,
    };
}

export { useToast, toast };
