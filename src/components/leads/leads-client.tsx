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
import { deleteLead } from "@/lib/actions/leads"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
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
    const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined)

    const filteredLeads = leads.filter((lead) =>
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (lead: Lead) => {
        // Convert dates to strings or handle type mismatch if necessary
        // The Lead type in this file has dates as Date | string, so it should be fine if Modal expects compatible types
        // LeadFormModal expects: lead?: { id, title, description?, value?, status, source?, contactId?, organizationId? }
        // We need to map our Lead to that format
        const leadForModal = {
            id: lead.id,
            title: lead.title,
            description: lead.description,
            value: lead.value,
            status: lead.status,
            source: lead.source,
            contactId: lead.contact?.id,
            organizationId: lead.organization?.id
        }
        setSelectedLead(leadForModal as any) // Type assertion to match what Modal expects vs this file's Lead type
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this lead?")) {
            await deleteLead(id)
        }
    }

    const handleCreate = () => {
        setSelectedLead(undefined)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leads"
                description="Manage your sales pipeline and track opportunities"
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4" />
                        New Lead
                    </Button>
                }
            />

            {/* ... Toolbar ... */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
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
                                    <tr className="border-b border-border">
                                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Title</th>
                                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Contact</th>
                                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Value</th>
                                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Created</th>
                                        <th className="text-right text-sm font-medium text-muted-foreground p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="border-b border-border hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <Link
                                                    href={`/leads/${lead.id}`}
                                                    className="text-foreground font-medium hover:text-primary"
                                                >
                                                    {lead.title}
                                                </Link>
                                                {lead.organization && (
                                                    <p className="text-sm text-muted-foreground">{lead.organization.name}</p>
                                                )}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {lead.contact?.name || "-"}
                                            </td>
                                            <td className="p-4 text-primary font-medium">
                                                {formatCurrency(Number(lead.value || 0))}
                                            </td>
                                            <td className="p-4">
                                                <LeadStatusBadge status={lead.status} />
                                            </td>
                                            <td className="p-4 text-muted-foreground text-sm">
                                                {formatDate(lead.createdAt)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu
                                                    trigger={<MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                                                    items={[
                                                        {
                                                            label: "View Details",
                                                            icon: <Eye className="h-4 w-4" />,
                                                            onClick: () => window.location.href = `/leads/${lead.id}`
                                                        },
                                                        {
                                                            label: "Edit",
                                                            icon: <Edit className="h-4 w-4" />,
                                                            onClick: () => handleEdit(lead)
                                                        },
                                                        {
                                                            label: "Delete",
                                                            icon: <Trash2 className="h-4 w-4" />,
                                                            variant: "danger",
                                                            onClick: () => handleDelete(lead.id)
                                                        }
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredLeads.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
                lead={selectedLead}
            />
        </div>
    )
}
