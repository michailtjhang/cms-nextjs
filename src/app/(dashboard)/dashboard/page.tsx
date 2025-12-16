import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, LeadStatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { formatCurrency, formatDate } from "@/lib/utils"
import { OverviewChart } from "@/components/dashboard/overview-chart"
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
    // ... (previous stats fetching remains)
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

    // ... (trend calculation remains)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const prevLeads = await prisma.lead.count({ where: { createdAt: { lt: thirtyDaysAgo } } })

    const startOfThisMonth = new Date()
    startOfThisMonth.setDate(1)

    const startOfLastMonth = new Date(startOfThisMonth)
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)

    // ... (more trend calc logic)
    // Re-implement simplified trend logic to keep file cleaner if replacing block
    // But since I am inserting chart data, I will add it here.

    // Revenue Chart Data (Last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const wonLeadsForChart = await prisma.lead.findMany({
        where: {
            status: "WON",
            createdAt: { gte: sixMonthsAgo }
        },
        select: {
            createdAt: true,
            value: true
        }
    })

    const chartDataMap = new Map<string, number>()

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthName = d.toLocaleString('default', { month: 'short' })
        chartDataMap.set(monthName, 0)
    }

    wonLeadsForChart.forEach(lead => {
        const monthName = lead.createdAt.toLocaleString('default', { month: 'short' })
        // Prisma Decimal to number
        const val = Number(lead.value) || 0
        if (chartDataMap.has(monthName)) {
            chartDataMap.set(monthName, (chartDataMap.get(monthName) || 0) + val)
        }
    })

    const revenueChartData = Array.from(chartDataMap.entries()).map(([name, total]) => ({
        name,
        total
    }))

    // Re-run the trend logic from before effectively
    const leadsThisMonth = await prisma.lead.count({ where: { createdAt: { gte: startOfThisMonth } } })
    const leadsLastMonth = await prisma.lead.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } })

    const wonThisMonth = await prisma.lead.count({ where: { status: "WON", updatedAt: { gte: startOfThisMonth } } })
    const wonLastMonth = await prisma.lead.count({ where: { status: "WON", updatedAt: { gte: startOfLastMonth, lt: startOfThisMonth } } })

    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
    }

    return {
        totalLeads,
        wonLeads,
        totalContacts,
        totalActivities,
        totalRevenue: totalValue._sum.value || 0,
        recentLeads,
        recentActivities,
        trends: {
            leads: calculateTrend(leadsThisMonth, leadsLastMonth),
            won: calculateTrend(wonThisMonth, wonLastMonth)
        },
        revenueChartData
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
                    trend={{ value: Math.abs(stats.trends.leads), isPositive: stats.trends.leads >= 0 }}
                />
                <StatsCard
                    title="Won Deals"
                    value={stats.wonLeads}
                    icon={TrendingUp}
                    variant="green"
                    trend={{ value: Math.abs(stats.trends.won), isPositive: stats.trends.won >= 0 }}
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

            {/* Chart Section */}
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={stats.revenueChartData} />
                    </CardContent>
                </Card>
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
                                className="text-sm text-primary hover:text-primary/80"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.recentLeads.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-8">
                                No leads yet. Create your first lead to get started.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentLeads.map((lead) => (
                                    <Link
                                        key={lead.id}
                                        href={`/leads/${lead.id}`}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                    >
                                        <Avatar name={lead.title} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {lead.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
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
                                className="text-sm text-primary hover:text-primary/80"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivities.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-8">
                                No activities yet. Start tracking your tasks and calls.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentActivities.map((activity) => {
                                    const Icon = activityIcons[activity.type] || CalendarCheck
                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                        >
                                            <div className="p-2 rounded-lg bg-muted">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
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
