'use client'

import * as React from "react"

export interface SelectProps {
    onValueChange?: (value: string) => void
    defaultValue?: string
    children: React.ReactNode
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

export interface SelectContentProps {
    children: React.ReactNode
}

export interface SelectItemProps {
    value: string
    children: React.ReactNode
}

export interface SelectValueProps {
    placeholder?: string
}

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}>({
    value: '',
    onValueChange: () => { },
    open: false,
    setOpen: () => { }
})

export const Select: React.FC<SelectProps> = ({ onValueChange, defaultValue = '', children }) => {
    const [value, setValue] = React.useState(defaultValue)
    const [open, setOpen] = React.useState(false)

    const handleValueChange = (newValue: string) => {
        setValue(newValue)
        onValueChange?.(newValue)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = '', children, ...props }) => {
    const { open, setOpen } = React.useContext(SelectContext)

    return (
        <button
            type="button"
            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            onClick={() => setOpen(!open)}
            {...props}
        >
            {children}
            <svg
                className={`h-4 w-4 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    )
}

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
    const { open } = React.useContext(SelectContext)

    if (!open) return null

    return (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {children}
        </div>
    )
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
    const { onValueChange } = React.useContext(SelectContext)

    return (
        <div
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onValueChange(value)}
        >
            {children}
        </div>
    )
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
    const { value } = React.useContext(SelectContext)

    return (
        <span className={value ? '' : 'text-muted-foreground'}>
            {value || placeholder}
        </span>
    )
}