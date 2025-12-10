"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutGrid, List } from "lucide-react"

interface ViewToggleProps {
    defaultView?: "kanban" | "table"
    onViewChange?: (view: "kanban" | "table") => void
}

export function ViewToggle({ defaultView = "kanban", onViewChange }: ViewToggleProps) {
    const [view, setView] = useState<"kanban" | "table">(defaultView)

    const handleViewChange = (newView: "kanban" | "table") => {
        setView(newView)
        onViewChange?.(newView)
    }

    return (
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <button
                onClick={() => handleViewChange("kanban")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    view === "kanban"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                )}
            >
                <LayoutGrid className="h-4 w-4" />
                Kanban
            </button>
            <button
                onClick={() => handleViewChange("table")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    view === "table"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                )}
            >
                <List className="h-4 w-4" />
                Table
            </button>
        </div>
    )
}
