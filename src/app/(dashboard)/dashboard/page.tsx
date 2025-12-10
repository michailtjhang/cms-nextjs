import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, LeadStatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
    Users,
    DollarSign,
    UserCircle,
    CalendarCheck,
    TrendingUp,
    Phone,
    Mail,
    FileText,
} from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
    const [
        totalLeads,
        wonLeads,
        totalContacts,
        totalActivities,
        recentLeads,
        recentActivities,
    ] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "WON" } }),
        prisma.contact.count(),
        prisma.activity.count(),
        prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { contact: true, user: true },
        }),
        prisma.activity.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true, lead: true },
        }),
    ])

    const totalValue = await prisma.lead.aggregate({
        _sum: { value: true },
        where: { status: "WON" },
    })

    return {
        totalLeads,
        wonLeads,
        totalContacts,
        totalActivities,
        totalRevenue: totalValue._sum.value || 0,
        recentLeads,
        recentActivities,
    }
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const stats = await getDashboardStats()

    const activityIcons: Record<string, typeof Phone> = {
        CALL: Phone,
        EMAIL: Mail,
        MEETING: CalendarCheck,
        NOTE: FileText,
        TASK: CalendarCheck,
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description={`Welcome back, ${session.user.name || "User"}!`}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Leads"
                    value={stats.totalLeads}
                    icon={Users}
                    variant="blue"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Won Deals"
                    value={stats.wonLeads}
                    icon={TrendingUp}
                    variant="green"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(Number(stats.totalRevenue))}
                    icon={DollarSign}
                    variant="purple"
                />
                <StatsCard
                    title="Contacts"
                    value={stats.totalContacts}
                    icon={UserCircle}
                    variant="amber"
                />
            </div>

            {/* Recent sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Leads</CardTitle>
                            <Link
                                href="/leads"
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.recentLeads.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">
                                No leads yet. Create your first lead to get started.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentLeads.map((lead) => (
                                    <Link
                                        key={lead.id}
                                        href={`/leads/${lead.id}`}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                                    >
                                        <Avatar name={lead.title} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {lead.title}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {lead.contact?.name || "No contact"} •{" "}
                                                {formatCurrency(Number(lead.value || 0))}
                                            </p>
                                        </div>
                                        <LeadStatusBadge status={lead.status} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Activities</CardTitle>
                            <Link
                                href="/activities"
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivities.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">
                                No activities yet. Start tracking your tasks and calls.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentActivities.map((activity) => {
                                    const Icon = activityIcons[activity.type] || CalendarCheck
                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                                        >
                                            <div className="p-2 rounded-lg bg-slate-800">
                                                <Icon className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {activity.user?.name} • {formatDate(activity.createdAt)}
                                                </p>
                                            </div>
                                            <Badge variant={activity.completed ? "success" : "outline"}>
                                                {activity.completed ? "Done" : "Pending"}
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
