"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const stages = [
    { id: "NEW", label: "New" },
    { id: "CONTACTED", label: "Contacted" },
    { id: "QUALIFIED", label: "Qualified" },
    { id: "PROPOSAL", label: "Proposal" },
    { id: "NEGOTIATION", label: "Negotiation" },
    { id: "WON", label: "Won" },
]

interface PipelineStepsProps {
    currentStatus: string
}

export function PipelineSteps({ currentStatus }: PipelineStepsProps) {
    const isLost = currentStatus === "LOST"
    const currentIndex = stages.findIndex((s) => s.id === currentStatus)
    const isWon = currentStatus === "WON"

    if (isLost) {
        return (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-red-500 font-medium">
                    <span>Lead Status: LOST</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-2">
                    <div className="h-full bg-red-500 rounded-full w-full opacity-50" />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto pb-2 mb-6">
            <div className="flex items-center min-w-[600px] justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-800 -z-10" />
                <div
                    className="absolute top-4 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
                />

                {stages.map((stage, index) => {
                    const isCompleted = index <= currentIndex
                    const isCurrent = index === currentIndex

                    return (
                        <div key={stage.id} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200 bg-slate-950",
                                    isCompleted
                                        ? "border-green-500 text-green-500"
                                        : "border-slate-700 text-slate-700",
                                    isCurrent && "ring-4 ring-green-500/20"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-xs">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium whitespace-nowrap",
                                    isCompleted ? "text-green-500" : "text-slate-500"
                                )}
                            >
                                {stage.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
