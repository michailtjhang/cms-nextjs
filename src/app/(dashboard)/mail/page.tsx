import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Inbox, Send, Archive, Trash2 } from "lucide-react"

export default function MailPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Mail"
                description="Manage your email communications"
                actions={
                    <Button>
                        <Mail className="h-4 w-4" />
                        Compose
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <Card className="lg:col-span-1">
                    <CardContent className="p-4 space-y-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
                            <Inbox className="h-4 w-4" />
                            Inbox
                            <span className="ml-auto text-xs bg-blue-500 px-2 py-0.5 rounded-full">0</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800">
                            <Send className="h-4 w-4" />
                            Sent
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800">
                            <Archive className="h-4 w-4" />
                            Archive
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800">
                            <Trash2 className="h-4 w-4" />
                            Trash
                        </button>
                    </CardContent>
                </Card>

                {/* Mail List */}
                <Card className="lg:col-span-3">
                    <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mb-4">
                            <Mail className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Email Integration Coming Soon
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            We&apos;re working on integrating email functionality. This feature will allow you
                            to send and receive emails directly from your CRM.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
