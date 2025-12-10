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
import { Badge } from "@/components/ui/badge"
import { createActivity, toggleActivityComplete, deleteActivity } from "@/lib/actions/activities"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Plus, Phone, Mail, CalendarCheck, FileText, CheckCircle, Circle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Activity = {
    id: string
    type: string
    title: string
    description?: string | null
    dueDate?: Date | null
    completed: boolean
    createdAt: Date
    user?: { name?: string | null } | null
    lead?: { id: string; title: string } | null
    contact?: { id: string; name: string } | null
}

interface ActivitiesClientProps {
    activities: Activity[]
    leads: { id: string; title: string }[]
    contacts: { id: string; name: string }[]
}

const activityTypes = [
    { value: "CALL", label: "Call", icon: Phone },
    { value: "EMAIL", label: "Email", icon: Mail },
    { value: "MEETING", label: "Meeting", icon: CalendarCheck },
    { value: "NOTE", label: "Note", icon: FileText },
    { value: "TASK", label: "Task", icon: CalendarCheck },
]

export function ActivitiesClient({ activities, leads, contacts }: ActivitiesClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "CALL",
        title: "",
        description: "",
        dueDate: "",
        leadId: "",
        contactId: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createActivity({
                type: formData.type as "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK",
                title: formData.title,
                description: formData.description || undefined,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
                leadId: formData.leadId || undefined,
                contactId: formData.contactId || undefined,
            })
            setIsModalOpen(false)
            setFormData({ type: "CALL", title: "", description: "", dueDate: "", leadId: "", contactId: "" })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggle = async (id: string) => {
        try {
            await toggleActivityComplete(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this activity?")) return
        try {
            await deleteActivity(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    const getIcon = (type: string) => {
        const found = activityTypes.find((t) => t.value === type)
        return found?.icon || CalendarCheck
    }

    const leadOptions = leads.map((l) => ({ value: l.id, label: l.title }))
    const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }))
    const typeOptions = activityTypes.map((t) => ({ value: t.value, label: t.label }))

    return (
        <div className="space-y-6">
            <PageHeader
                title="Activities"
                description="Track your calls, meetings, and tasks"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Activity
                    </Button>
                }
            />

            <div className="space-y-3">
                {activities.map((activity) => {
                    const Icon = getIcon(activity.type)
                    return (
                        <Card key={activity.id} className={cn(activity.completed && "opacity-60")}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <button
                                        onClick={() => handleToggle(activity.id)}
                                        className="mt-1 text-slate-400 hover:text-blue-400"
                                    >
                                        {activity.completed ? (
                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </button>
                                    <div className="p-2 rounded-lg bg-slate-800">
                                        <Icon className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-white font-medium", activity.completed && "line-through")}>
                                            {activity.title}
                                        </p>
                                        {activity.description && (
                                            <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge variant="outline">{activity.type}</Badge>
                                            {activity.dueDate && (
                                                <Badge variant="info">{formatDate(activity.dueDate)}</Badge>
                                            )}
                                            {activity.lead && (
                                                <Badge variant="default">{activity.lead.title}</Badge>
                                            )}
                                            {activity.contact && (
                                                <Badge variant="default">{activity.contact.name}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{formatDateTime(activity.createdAt)}</span>
                                        <button
                                            onClick={() => handleDelete(activity.id)}
                                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {activities.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-slate-400">
                            No activities yet. Create your first activity to start tracking.
                        </CardContent>
                    </Card>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Activity" size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Type"
                            options={typeOptions}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        />
                        <Input
                            label="Due Date"
                            type="datetime-local"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Title"
                        placeholder="Activity title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Lead"
                            options={leadOptions}
                            value={formData.leadId}
                            onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                            placeholder="Select lead"
                        />
                        <Select
                            label="Contact"
                            options={contactOptions}
                            value={formData.contactId}
                            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                            placeholder="Select contact"
                        />
                    </div>
                    <Textarea
                        label="Description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>Create Activity</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
