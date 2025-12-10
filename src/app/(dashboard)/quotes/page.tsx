import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { variant: "default" | "info" | "success" | "warning" | "danger"; label: string }> = {
    DRAFT: { variant: "default", label: "Draft" },
    SENT: { variant: "info", label: "Sent" },
    ACCEPTED: { variant: "success", label: "Accepted" },
    DECLINED: { variant: "danger", label: "Declined" },
    EXPIRED: { variant: "warning", label: "Expired" },
}

export default async function QuotesPage() {
    const quotes = await prisma.quote.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            lead: { select: { title: true } },
            user: { select: { name: true } },
        },
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Quotes"
                description="Manage your sales quotations"
                actions={
                    <Button disabled>
                        <Plus className="h-4 w-4" />
                        New Quote (Coming Soon)
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
                                        </tr>
                                    )
                                })}
                                {quotes.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mb-4">
                                                <FileText className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white mb-2">No quotes yet</h3>
                                            <p className="text-slate-400">
                                                Quote creation feature coming soon. Stay tuned!
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
