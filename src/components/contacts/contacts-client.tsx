"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createContact, deleteContact } from "@/lib/actions/contacts"
import { Plus, Search, Mail, Phone, Building, Trash2 } from "lucide-react"

type Contact = {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    jobTitle?: string | null
    organization?: { id: string; name: string } | null
    _count: { leads: number; activities: number }
}

type Organization = { id: string; name: string }

interface ContactsClientProps {
    contacts: Contact[]
    organizations: Organization[]
}

export function ContactsClient({ contacts, organizations }: ContactsClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        organizationId: "",
        notes: "",
    })

    const filteredContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createContact({
                name: formData.name,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                jobTitle: formData.jobTitle || undefined,
                organizationId: formData.organizationId || undefined,
                notes: formData.notes || undefined,
            })
            setIsModalOpen(false)
            setFormData({ name: "", email: "", phone: "", jobTitle: "", organizationId: "", notes: "" })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return
        try {
            await deleteContact(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    const orgOptions = organizations.map((o) => ({ value: o.id, label: o.name }))

    return (
        <div className="space-y-6">
            <PageHeader
                title="Contacts"
                description="Manage your contacts and organizations"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Contact
                    </Button>
                }
            />

            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContacts.map((contact) => (
                    <Card key={contact.id} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <Avatar name={contact.name} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-foreground font-medium truncate">{contact.name}</h3>
                                    {contact.jobTitle && (
                                        <p className="text-sm text-muted-foreground truncate">{contact.jobTitle}</p>
                                    )}
                                    {contact.organization && (
                                        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                                            <Building className="h-3 w-3" />
                                            {contact.organization.name}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(contact.id)}
                                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-4 space-y-2">
                                {contact.email && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        {contact.phone}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Badge variant="outline">{contact._count.leads} leads</Badge>
                                <Badge variant="outline">{contact._count.activities} activities</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredContacts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No contacts found. Create your first contact to get started.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Contact"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        placeholder="Enter contact name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Phone"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            placeholder="e.g. Sales Manager"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
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
                        label="Notes"
                        placeholder="Additional notes..."
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Contact
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
