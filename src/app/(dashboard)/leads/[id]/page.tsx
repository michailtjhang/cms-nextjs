import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, LeadStatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
import {
    ArrowLeft,
    Building,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    User,
    FileText,
    CheckCircle,
    Circle,
} from "lucide-react"
import { PipelineSteps } from "@/components/leads/pipeline-steps"
import Link from "next/link"

interface LeadDetailPageProps {
    params: Promise<{ id: string }>
}


const sourceLabels: Record<string, string> = {
    WEB: "Website",
    PHONE: "Phone",
    EMAIL: "Email",
    REFERRAL: "Referral",
    SOCIAL_MEDIA: "Social Media",
    ADVERTISEMENT: "Advertisement",
    OTHER: "Other",
}

const activityIcons: Record<string, typeof Phone> = {
    CALL: Phone,
    EMAIL: Mail,
    MEETING: Calendar,
    NOTE: FileText,
    TASK: CheckCircle,
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
    const { id } = await params

    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            contact: true,
            organization: true,
            user: { select: { name: true, email: true } },
            activities: {
                orderBy: { createdAt: "desc" },
                take: 10,
                include: { user: { select: { name: true } } },
            },
        },
    })

    if (!lead) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/leads">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <PageHeader
                    title={lead.title}
                    description={`Created on ${formatDate(lead.createdAt)}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <PipelineSteps currentStatus={lead.status} />
                </div>

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lead Details Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Lead Information</CardTitle>
                                <LeadStatusBadge status={lead.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lead.description && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">Description</h4>
                                    <p className="text-white">{lead.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">Value</h4>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {formatCurrency(Number(lead.value || 0))}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">Source</h4>
                                    <p className="text-white">
                                        {lead.source ? sourceLabels[lead.source] || lead.source : "Not specified"}
                                    </p>
                                </div>
                            </div>

                            {lead.expectedCloseDate && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">Expected Close Date</h4>
                                    <div className="flex items-center gap-2 text-white">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {formatDate(lead.expectedCloseDate)}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">Assigned To</h4>
                                <div className="flex items-center gap-2">
                                    <Avatar name={lead.user.name} size="sm" />
                                    <span className="text-white">{lead.user.name}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activities Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lead.activities.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">
                                    No activities recorded for this lead yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {lead.activities.map((activity) => {
                                        const Icon = activityIcons[activity.type] || FileText
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50"
                                            >
                                                <div className="p-2 rounded-lg bg-slate-800">
                                                    <Icon className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium">{activity.title}</span>
                                                        {activity.completed ? (
                                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                                        ) : (
                                                            <Circle className="h-4 w-4 text-slate-500" />
                                                        )}
                                                    </div>
                                                    {activity.description && (
                                                        <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                                                    )}
                                                    <p className="text-xs text-slate-500 mt-2">
                                                        {activity.user?.name} • {formatDateTime(activity.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Card */}
                    {lead.contact && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar name={lead.contact.name} size="lg" />
                                    <div>
                                        <p className="text-white font-medium">{lead.contact.name}</p>
                                        {lead.contact.jobTitle && (
                                            <p className="text-sm text-slate-400">{lead.contact.jobTitle}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {lead.contact.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <a href={`mailto:${lead.contact.email}`} className="text-blue-400 hover:underline">
                                                {lead.contact.email}
                                            </a>
                                        </div>
                                    )}
                                    {lead.contact.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{lead.contact.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Organization Card */}
                    {lead.organization && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    Organization
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white font-medium mb-2">{lead.organization.name}</p>
                                <div className="space-y-2">
                                    {lead.organization.industry && (
                                        <Badge variant="outline">{lead.organization.industry}</Badge>
                                    )}
                                    {lead.organization.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{lead.organization.email}</span>
                                        </div>
                                    )}
                                    {lead.organization.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{lead.organization.phone}</span>
                                        </div>
                                    )}
                                    {lead.organization.website && (
                                        <a
                                            href={lead.organization.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 hover:underline"
                                        >
                                            {lead.organization.website}
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Created</span>
                                    <span className="text-white">{formatDate(lead.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Last Updated</span>
                                    <span className="text-white">{formatDate(lead.updatedAt)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
