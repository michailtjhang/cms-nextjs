"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { LeadStatus, LeadSource } from "@prisma/client"

export async function getLeads() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            contact: true,
            organization: true,
            user: true,
            _count: { select: { activities: true } },
        },
    })
}

export async function getLead(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.lead.findUnique({
        where: { id },
        include: {
            contact: true,
            organization: true,
            user: true,
            activities: {
                orderBy: { createdAt: "desc" },
                include: { user: true },
            },
        },
    })
}

export async function createLead(data: {
    title: string
    description?: string
    value?: number
    status?: LeadStatus
    source?: LeadSource
    contactId?: string
    organizationId?: string
    expectedCloseDate?: Date
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const lead = await prisma.lead.create({
        data: {
            title: data.title,
            description: data.description,
            value: data.value,
            status: data.status || "NEW",
            source: data.source,
            contactId: data.contactId || null,
            organizationId: data.organizationId || null,
            expectedCloseDate: data.expectedCloseDate,
            userId: session.user.id,
        },
    })

    revalidatePath("/leads")
    revalidatePath("/dashboard")
    return lead
}

export async function updateLead(
    id: string,
    data: {
        title?: string
        description?: string
        value?: number
        status?: LeadStatus
        source?: LeadSource
        contactId?: string | null
        organizationId?: string | null
        expectedCloseDate?: Date | null
    }
) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const lead = await prisma.lead.update({
        where: { id },
        data,
    })

    revalidatePath("/leads")
    revalidatePath(`/leads/${id}`)
    revalidatePath("/dashboard")
    return lead
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const lead = await prisma.lead.update({
        where: { id },
        data: { status },
    })

    revalidatePath("/leads")
    revalidatePath("/dashboard")
    return lead
}

export async function deleteLead(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.lead.delete({ where: { id } })

    revalidatePath("/leads")
    revalidatePath("/dashboard")
}
