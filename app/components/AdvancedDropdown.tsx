"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AdvancedDropdownProps {
    icon?: React.ReactNode;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    width?: string;
}

export default function AdvancedDropdown({
    icon,
    options,
    selected,
    onSelect,
    placeholder = "Selecionar...",
    width = "w-full",
}: AdvancedDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); useEffect(() => {
        const handleClickOutside = (event: Event) => {
            const target = event.target as unknown;
            // First check if it's an object before attempting to use it
            if (dropdownRef.current && target && typeof target === 'object') {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={`relative ${width}`}
            role="listbox"
            aria-expanded={open}
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-haspopup="listbox"
                aria-label="Selecionar opção"
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-emerald-600">{icon}</span>}
                    <span className="truncate">{selected || placeholder}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div
                    className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 animate-dropdown"
                    role="menu"
                >
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                onSelect(option);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-all ${option === selected
                                ? "bg-emerald-50 text-emerald-700 font-medium"
                                : "text-neutral-700 hover:bg-neutral-100"
                                }`}
                            role="option"
                            aria-selected={option === selected}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.15s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
