import { prisma } from "@/lib/prisma"
import { ActivitiesClient } from "@/components/activities/activities-client"

export default async function ActivitiesPage() {
    const [activities, leads, contacts] = await Promise.all([
        prisma.activity.findMany({
            orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
            include: {
                user: { select: { name: true } },
                lead: { select: { id: true, title: true } },
                contact: { select: { id: true, name: true } },
            },
        }),
        prisma.lead.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
        prisma.contact.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ])

    return <ActivitiesClient activities={activities} leads={leads} contacts={contacts} />
}
