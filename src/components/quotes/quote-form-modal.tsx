"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { createQuote } from "@/lib/actions/quotes"

interface QuoteFormModalProps {
    isOpen: boolean
    onClose: () => void
}

export function QuoteFormModal({ isOpen, onClose }: QuoteFormModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [leads, setLeads] = useState<{ id: string; title: string }[]>([])
    const [formData, setFormData] = useState({
        subject: "",
        leadId: "",
        total: "",
        status: "DRAFT",
    })

    useEffect(() => {
        // Fetch leads for the dropdown
        // Ideally this should be passed as props or fetched via a server action / API
        // For now we'll mock or assume passed props later. 
        // Let's create a getLeadsForSelect action or just fetch from API text
        // Actually, to be clean, let's just use empty for now and I'll update parent to pass it.
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createQuote({
                subject: formData.subject,
                leadId: formData.leadId || undefined,
                total: parseFloat(formData.total) || 0,
                status: formData.status as any,
            })
            onClose()
            setFormData({ subject: "", leadId: "", total: "", status: "DRAFT" })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const statusOptions = [
        { label: "Draft", value: "DRAFT" },
        { label: "Sent", value: "SENT" },
        { label: "Accepted", value: "ACCEPTED" },
        { label: "Declined", value: "DECLINED" },
        { label: "Expired", value: "EXPIRED" },
    ]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Quote"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Subject"
                    placeholder="Quote subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                />

                {/* Note: In a real app we'd need a Lead selector here. 
                    I'll add it if I have the data. For now, manual entry or simple select if props passed. */}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Total Amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.total}
                        onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                        required
                    />
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Create Quote
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
