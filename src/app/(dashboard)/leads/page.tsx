import { prisma } from "@/lib/prisma"
import { LeadsClient } from "@/components/leads/leads-client"

export default async function LeadsPage() {
    const [leadsRaw, contacts, organizations] = await Promise.all([
        prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                contact: { select: { id: true, name: true } },
                organization: { select: { id: true, name: true } },
            },
        }),
        prisma.contact.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        prisma.organization.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ])

    // Convert Decimal to number for serialization
    const leads = leadsRaw.map((lead) => ({
        ...lead,
        value: lead.value ? Number(lead.value) : null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        expectedCloseDate: lead.expectedCloseDate?.toISOString() || null,
    }))

    return (
        <LeadsClient
            leads={leads}
            contacts={contacts}
            organizations={organizations}
        />
    )
}
