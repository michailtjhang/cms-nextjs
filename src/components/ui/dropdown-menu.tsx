"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuItem {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: "default" | "danger"
    disabled?: boolean
}

interface DropdownMenuProps {
    trigger: React.ReactNode
    items: DropdownMenuItem[]
    align?: "left" | "right"
}

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
                {trigger}
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute z-50 mt-1 w-40 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1",
                        "animate-in fade-in-0 zoom-in-95",
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                item.onClick()
                                setIsOpen(false)
                            }}
                            disabled={item.disabled}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                                item.variant === "danger"
                                    ? "text-red-400 hover:bg-red-500/10"
                                    : "text-slate-300 hover:bg-slate-700",
                                item.disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
