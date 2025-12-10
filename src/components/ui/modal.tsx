"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose()
        }
    }

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    }

    if (!isOpen) return null

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                ref={modalRef}
                className={cn(
                    "w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl",
                    "animate-in zoom-in-95 fade-in duration-200",
                    sizes[size]
                )}
            >
                {(title || description) && (
                    <div className="flex items-start justify-between p-6 border-b border-slate-800">
                        <div>
                            {title && (
                                <h2 className="text-xl font-semibold text-white">{title}</h2>
                            )}
                            {description && (
                                <p className="text-sm text-slate-400 mt-1">{description}</p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-1"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    )
}
