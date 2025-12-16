"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Mail, Inbox, Send, Archive, Trash2, Search, Star, MoreVertical, Reply, Forward } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { sendEmail, deleteEmail, markAsRead, toggleStar } from "@/lib/actions/mail"
import { useRouter } from "next/navigation"

interface MailClientProps {
    initialEmails: any[]
    currentFolder: string
}

export function MailClient({ initialEmails, currentFolder }: MailClientProps) {
    const [emails, setEmails] = useState(initialEmails)
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState(currentFolder)
    const [isComposing, setIsComposing] = useState(false)
    const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" })
    const router = useRouter()

    // Sync state if props change (when navigating)
    React.useEffect(() => {
        setEmails(initialEmails)
        setActiveTab(currentFolder)
        setSelectedEmailId(null) // Reset selection on folder change
    }, [initialEmails, currentFolder])

    const selectedEmail = emails.find((e) => e.id === selectedEmailId)

    const filteredEmails = emails.filter((email) => {
        const matchesSearch =
            email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.from.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
        router.push(`/mail?folder=${tabId}`)
    }

    // ... (rest of filtering and handlers same as before) ...

    const handleEmailClick = async (email: any) => {
        setSelectedEmailId(email.id)
        if (!email.read) {
            await markAsRead(email.id)
            router.refresh()
            setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e))
        }
    }

    const handleDelete = async (id: string | undefined) => {
        if (!id) return
        await deleteEmail(id)
        setEmails(prev => prev.filter(e => e.id !== id))
        setSelectedEmailId(null)
        router.refresh()
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await sendEmail(composeData)
            if (result && !result.success) {
                alert(`Error: ${result.error}`)
                return;
            }
            // Success
            setIsComposing(false)
            setComposeData({ to: "", subject: "", body: "" })
            alert("Email sent successfully!")
            router.refresh()
            // Optional: navigate to sent folder?
            // router.push("/mail?folder=sent") 
        } catch (err) {
            alert("An unexpected error occurred.")
        }
    }

    // Compose View
    if (isComposing) {
        return (
            <Card className="h-[calc(100vh-12rem)] border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Compose Email</h2>
                        <Button variant="ghost" onClick={() => setIsComposing(false)}>Cancel</Button>
                    </div>
                    <form onSubmit={handleSend} className="space-y-4 max-w-2xl">
                        <Input
                            placeholder="To"
                            value={composeData.to}
                            onChange={e => setComposeData({ ...composeData, to: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Subject"
                            value={composeData.subject}
                            onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                            required
                        />
                        <textarea
                            className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your message..."
                            value={composeData.body}
                            onChange={e => setComposeData({ ...composeData, body: e.target.value })}
                            required
                        />
                        <div className="flex justify-end">
                            <Button type="submit">
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            {/* Sidebar */}
            <Card className="lg:col-span-1 border-slate-800 bg-slate-900/50">
                <CardContent className="p-4 space-y-2">
                    <Button className="w-full mb-4 gap-2" onClick={() => setIsComposing(true)}>
                        <Mail className="h-4 w-4" />
                        Compose
                    </Button>
                    {[
                        { id: "inbox", label: "Inbox", icon: Inbox, count: currentFolder === 'inbox' ? initialEmails.filter(e => !e.read).length : undefined },
                        { id: "sent", label: "Sent", icon: Send },
                        { id: "archive", label: "Archive", icon: Archive },
                        { id: "trash", label: "Trash", icon: Trash2 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                activeTab === tab.id
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Email List */}
            <Card className={cn(
                "lg:col-span-1 border-slate-800 bg-slate-900/50 flex flex-col",
                selectedEmailId ? "hidden lg:flex" : "flex"
            )}>
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search mail..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.map((email) => (
                        <button
                            key={email.id}
                            onClick={() => handleEmailClick(email)}
                            className={cn(
                                "w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors",
                                selectedEmailId === email.id && "bg-slate-800/80 border-l-2 border-l-blue-500",
                                !email.read && "bg-slate-800/20"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-sm font-medium", !email.read ? "text-white" : "text-slate-300")}>
                                    {email.from}
                                </span>
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {formatDate(email.createdAt)}
                                </span>
                            </div>
                            <h4 className={cn("text-sm mb-1 truncate", !email.read ? "text-white font-medium" : "text-slate-400")}>
                                {email.subject}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{email.body.substring(0, 50)}...</p>
                        </button>
                    ))}
                    {filteredEmails.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No emails found
                        </div>
                    )}
                </div>
            </Card>

            {/* Email Content */}
            <Card className={cn(
                "lg:col-span-2 border-slate-800 bg-slate-900/50",
                selectedEmailId ? "flex" : "hidden lg:flex"
            )}>
                {selectedEmail ? (
                    <div className="flex flex-col h-full w-full">
                        <div className="p-6 border-b border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="lg:hidden p-2"
                                        onClick={() => setSelectedEmailId(null)}
                                    >
                                        <Reply className="h-4 w-4" /> {/* Using Reply as Back icon placeholder */}
                                    </Button>
                                    <h2 className="text-xl font-semibold text-white">{selectedEmail.subject}</h2>
                                    <Badge variant="outline" className="ml-2">Inbox</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="p-2">
                                        <Star className={cn("h-4 w-4", selectedEmail.starred ? "text-yellow-400 fill-yellow-400" : "text-slate-400")} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2"
                                        onClick={() => handleDelete(selectedEmail.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-slate-400" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="p-2">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Avatar name={selectedEmail.from} />
                                <div>
                                    <p className="text-sm font-medium text-white">{selectedEmail.from}</p>
                                    <p className="text-xs text-slate-400">To: {selectedEmail.to}</p>
                                </div>
                                <span className="ml-auto text-xs text-slate-500">
                                    {formatDate(selectedEmail.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 p-6 text-slate-300 mx-auto w-full">
                            <p className="leading-relaxed whitespace-pre-wrap">
                                {selectedEmail.body}
                            </p>
                        </div>
                        <div className="p-4 border-t border-slate-800 flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Reply className="h-4 w-4" /> Reply
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Forward className="h-4 w-4" /> Forward
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full text-slate-500">
                        <Mail className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select an email to view</p>
                    </div>
                )}
            </Card>
        </div>
    )
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            variant === "outline" ? "border border-slate-700 text-slate-400" : "bg-blue-600 text-white",
            className
        )}>
            {children}
        </span>
    )
}
