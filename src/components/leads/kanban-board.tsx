"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { LeadStatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { updateLeadStatus } from "@/lib/actions/leads"
import { MoreHorizontal, GripVertical } from "lucide-react"
import Link from "next/link"

type Lead = {
    id: string
    title: string
    description?: string | null
    value?: number | string | null
    status: string
    contact?: { name: string } | null
    organization?: { name: string } | null
}

interface KanbanBoardProps {
    leads: Lead[]
}

const columns = [
    { id: "NEW", title: "New", color: "border-blue-500" },
    { id: "CONTACTED", title: "Contacted", color: "border-yellow-500" },
    { id: "QUALIFIED", title: "Qualified", color: "border-green-500" },
    { id: "PROPOSAL", title: "Proposal", color: "border-purple-500" },
    { id: "NEGOTIATION", title: "Negotiation", color: "border-orange-500" },
    { id: "WON", title: "Won", color: "border-emerald-500" },
    { id: "LOST", title: "Lost", color: "border-red-500" },
]

export function KanbanBoard({ leads: initialLeads }: KanbanBoardProps) {
    const [leads, setLeads] = useState(initialLeads)
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

    const handleDragStart = (e: React.DragEvent, lead: Lead) => {
        setDraggedLead(lead)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        setDragOverColumn(columnId)
    }

    const handleDragLeave = () => {
        setDragOverColumn(null)
    }

    const handleDrop = async (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        setDragOverColumn(null)

        if (!draggedLead || draggedLead.status === columnId) {
            setDraggedLead(null)
            return
        }

        // Optimistic update
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === draggedLead.id ? { ...lead, status: columnId } : lead
            )
        )

        try {
            await updateLeadStatus(draggedLead.id, columnId as "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST")
        } catch (error) {
            // Revert on error
            setLeads((prev) =>
                prev.map((lead) =>
                    lead.id === draggedLead.id
                        ? { ...lead, status: draggedLead.status }
                        : lead
                )
            )
            console.error("Failed to update lead status:", error)
        }

        setDraggedLead(null)
    }

    const getColumnLeads = (columnId: string) =>
        leads.filter((lead) => lead.status === columnId)

    const getColumnValue = (columnId: string) =>
        leads
            .filter((lead) => lead.status === columnId)
            .reduce((sum, lead) => sum + Number(lead.value || 0), 0)

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {columns.map((column) => {
                const columnLeads = getColumnLeads(column.id)
                const columnValue = getColumnValue(column.id)

                return (
                    <div
                        key={column.id}
                        className={cn(
                            "flex-shrink-0 w-72 bg-slate-900/50 rounded-xl border-t-2",
                            column.color,
                            dragOverColumn === column.id && "ring-2 ring-blue-500/50"
                        )}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        {/* Column Header */}
                        <div className="p-4 border-b border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-white">{column.title}</h3>
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400">
                                        {columnLeads.length}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                {formatCurrency(columnValue)}
                            </p>
                        </div>

                        {/* Column Content */}
                        <div className="p-2 space-y-2 min-h-[200px]">
                            {columnLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead)}
                                    className={cn(
                                        "group bg-slate-800 rounded-lg p-3 cursor-grab active:cursor-grabbing",
                                        "border border-slate-700 hover:border-slate-600",
                                        "transition-all duration-200",
                                        draggedLead?.id === lead.id && "opacity-50"
                                    )}
                                >
                                    <div className="flex items-start gap-2">
                                        <GripVertical className="h-4 w-4 text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/leads/${lead.id}`}
                                                className="text-sm font-medium text-white hover:text-blue-400 truncate block"
                                            >
                                                {lead.title}
                                            </Link>
                                            {lead.contact && (
                                                <p className="text-xs text-slate-400 mt-1 truncate">
                                                    {lead.contact.name}
                                                </p>
                                            )}
                                            {lead.organization && (
                                                <p className="text-xs text-slate-500 truncate">
                                                    {lead.organization.name}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-blue-400 mt-2">
                                                {formatCurrency(Number(lead.value || 0))}
                                            </p>
                                        </div>
                                        <button className="p-1 rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {columnLeads.length === 0 && (
                                <div className="flex items-center justify-center h-20 text-slate-500 text-sm">
                                    Drop leads here
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
