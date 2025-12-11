"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { createLead, updateLead } from "@/lib/actions/leads"

interface LeadFormModalProps {
    isOpen: boolean
    onClose: () => void
    lead?: {
        id: string
        title: string
        description?: string | null
        value?: number | string | null
        status: string
        source?: string | null
        contactId?: string | null
        organizationId?: string | null
    }
    contacts?: { id: string; name: string }[]
    organizations?: { id: string; name: string }[]
}

const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "PROPOSAL", label: "Proposal" },
    { value: "NEGOTIATION", label: "Negotiation" },
    { value: "WON", label: "Won" },
    { value: "LOST", label: "Lost" },
]

const sourceOptions = [
    { value: "WEB", label: "Website" },
    { value: "PHONE", label: "Phone" },
    { value: "EMAIL", label: "Email" },
    { value: "REFERRAL", label: "Referral" },
    { value: "SOCIAL_MEDIA", label: "Social Media" },
    { value: "ADVERTISEMENT", label: "Advertisement" },
    { value: "OTHER", label: "Other" },
]

export function LeadFormModal({
    isOpen,
    onClose,
    lead,
    contacts = [],
    organizations = [],
}: LeadFormModalProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: lead?.title || "",
        description: lead?.description || "",
        value: lead?.value?.toString() || "",
        status: lead?.status || "NEW",
        source: lead?.source || "",
        contactId: lead?.contactId || "",
        organizationId: lead?.organizationId || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = {
                title: formData.title,
                description: formData.description || undefined,
                value: formData.value ? parseFloat(formData.value) : undefined,
                status: formData.status as "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST",
                source: formData.source ? (formData.source as "WEB" | "PHONE" | "EMAIL" | "REFERRAL" | "SOCIAL_MEDIA" | "ADVERTISEMENT" | "OTHER") : undefined,
                contactId: formData.contactId || undefined,
                organizationId: formData.organizationId || undefined,
            }

            if (lead) {
                await updateLead(lead.id, data)
            } else {
                await createLead(data)
            }

            router.refresh()
            onClose()
        } catch (error) {
            console.error("Failed to save lead:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }))
    const orgOptions = organizations.map((o) => ({ value: o.id, label: o.name }))

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={lead ? "Edit Lead" : "Create New Lead"}
            description={lead ? "Update lead information" : "Add a new lead to your pipeline"}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="Enter lead title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Value"
                        type="number"
                        placeholder="0.00"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                </div>

                <Select
                    label="Source"
                    options={sourceOptions}
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Select source"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Contact"
                        options={contactOptions}
                        value={formData.contactId}
                        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                        placeholder="Select contact"
                    />
                    <Select
                        label="Organization"
                        options={orgOptions}
                        value={formData.organizationId}
                        onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                        placeholder="Select organization"
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Enter lead description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {lead ? "Update Lead" : "Create Lead"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
