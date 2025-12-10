"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/leads/kanban-board"
import { LeadFormModal } from "@/components/leads/lead-form-modal"
import { ViewToggle } from "@/components/leads/view-toggle"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LeadStatusBadge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Lead = {
    id: string
    title: string
    description?: string | null
    value?: number | string | null
    status: string
    source?: string | null
    createdAt: Date | string
    contact?: { id: string; name: string } | null
    organization?: { id: string; name: string } | null
}

type Contact = { id: string; name: string }
type Organization = { id: string; name: string }

interface LeadsClientProps {
    leads: Lead[]
    contacts: Contact[]
    organizations: Organization[]
}

export function LeadsClient({ leads, contacts, organizations }: LeadsClientProps) {
    const [view, setView] = useState<"kanban" | "table">("kanban")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredLeads = leads.filter((lead) =>
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leads"
                description="Manage your sales pipeline and track opportunities"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Lead
                    </Button>
                }
            />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" size="md">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                </div>
                <ViewToggle defaultView="kanban" onViewChange={setView} />
            </div>

            {/* Content */}
            {view === "kanban" ? (
                <KanbanBoard leads={filteredLeads} />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left text-sm font-medium text-slate-400 p-4">Title</th>
                                        <th className="text-left text-sm font-medium text-slate-400 p-4">Contact</th>
                                        <th className="text-left text-sm font-medium text-slate-400 p-4">Value</th>
                                        <th className="text-left text-sm font-medium text-slate-400 p-4">Status</th>
                                        <th className="text-left text-sm font-medium text-slate-400 p-4">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <Link
                                                    href={`/leads/${lead.id}`}
                                                    className="text-white font-medium hover:text-blue-400"
                                                >
                                                    {lead.title}
                                                </Link>
                                                {lead.organization && (
                                                    <p className="text-sm text-slate-400">{lead.organization.name}</p>
                                                )}
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {lead.contact?.name || "-"}
                                            </td>
                                            <td className="p-4 text-blue-400 font-medium">
                                                {formatCurrency(Number(lead.value || 0))}
                                            </td>
                                            <td className="p-4">
                                                <LeadStatusBadge status={lead.status} />
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">
                                                {formatDate(lead.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredLeads.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                                No leads found. Create your first lead to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <LeadFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={contacts}
                organizations={organizations}
            />
        </div>
    )
}
