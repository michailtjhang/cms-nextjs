"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, FileText, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { deleteQuote } from "@/lib/actions/quotes"
import { QuoteFormModal } from "@/components/quotes/quote-form-modal"
import { useRouter } from "next/navigation"

type Quote = {
    id: string
    quoteNumber: string
    subject: string
    total: number | string
    status: string
    createdAt: Date | string
    lead?: { title: string } | null
}

interface QuotesClientProps {
    quotes: Quote[]
}

const statusConfig: Record<string, { variant: "default" | "info" | "success" | "warning" | "danger"; label: string }> = {
    DRAFT: { variant: "default", label: "Draft" },
    SENT: { variant: "info", label: "Sent" },
    ACCEPTED: { variant: "success", label: "Accepted" },
    DECLINED: { variant: "danger", label: "Declined" },
    EXPIRED: { variant: "warning", label: "Expired" },
}

export function QuotesClient({ quotes }: QuotesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this quote?")) {
            await deleteQuote(id)
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Quotes"
                description="Manage your sales quotations"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Quote
                    </Button>
                }
            />

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Quote #</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Subject</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Lead</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Amount</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Status</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Created</th>
                                    <th className="text-right text-sm font-medium text-slate-400 p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotes.map((quote) => {
                                    const status = statusConfig[quote.status] || statusConfig.DRAFT
                                    return (
                                        <tr key={quote.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="p-4 text-white font-mono">{quote.quoteNumber}</td>
                                            <td className="p-4 text-white">{quote.subject}</td>
                                            <td className="p-4 text-slate-300">{quote.lead?.title || "-"}</td>
                                            <td className="p-4 text-blue-400 font-medium">{formatCurrency(Number(quote.total))}</td>
                                            <td className="p-4">
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">{formatDate(quote.createdAt)}</td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu
                                                    trigger={<MoreHorizontal className="h-4 w-4" />}
                                                    items={[
                                                        {
                                                            label: "Delete",
                                                            icon: <Trash2 className="h-4 w-4" />,
                                                            variant: "danger",
                                                            onClick: () => handleDelete(quote.id)
                                                        }
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                                {quotes.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mb-4">
                                                <FileText className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white mb-2">No quotes yet</h3>
                                            <p className="text-slate-400">
                                                Create your first quote to get started.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <QuoteFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
