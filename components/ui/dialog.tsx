'use client'

import * as React from "react"

export interface DialogProps {
    children: React.ReactNode
}

export interface DialogTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

export interface DialogContentProps {
    className?: string
    children: React.ReactNode
}

export interface DialogHeaderProps {
    children: React.ReactNode
}

export interface DialogTitleProps {
    children: React.ReactNode
}

const DialogContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { }
})

export const Dialog: React.FC<DialogProps> = ({ children }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
                        {React.Children.toArray(children).find(child =>
                            React.isValidElement(child) && child.type === DialogContent
                        )}
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    )
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children }) => {
    const { setOpen } = React.useContext(DialogContext)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: () => setOpen(true)
        })
    }

    return (
        <button onClick={() => setOpen(true)}>
            {children}
        </button>
    )
}

export const DialogContent: React.FC<DialogContentProps> = ({ className = '', children }) => {
    const { setOpen } = React.useContext(DialogContext)

    return (
        <div className={`p-6 ${className}`}>
            <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {children}
        </div>
    )
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
    return (
        <div className="mb-4">
            {children}
        </div>
    )
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
    return (
        <h2 className="text-lg font-semibold">
            {children}
        </h2>
    )
}