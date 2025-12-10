"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { ActivityType } from "@prisma/client"

export async function getActivities() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true } },
            lead: { select: { id: true, title: true } },
            contact: { select: { id: true, name: true } },
        },
    })
}

export async function createActivity(data: {
    type: ActivityType
    title: string
    description?: string
    dueDate?: Date
    leadId?: string
    contactId?: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const activity = await prisma.activity.create({
        data: {
            type: data.type,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            leadId: data.leadId || null,
            contactId: data.contactId || null,
            userId: session.user.id,
        },
    })

    revalidatePath("/activities")
    revalidatePath("/dashboard")
    return activity
}

export async function updateActivity(
    id: string,
    data: {
        type?: ActivityType
        title?: string
        description?: string | null
        dueDate?: Date | null
        completed?: boolean
        completedAt?: Date | null
    }
) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    if (data.completed && !data.completedAt) {
        data.completedAt = new Date()
    }

    const activity = await prisma.activity.update({
        where: { id },
        data,
    })

    revalidatePath("/activities")
    revalidatePath("/dashboard")
    return activity
}

export async function toggleActivityComplete(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const activity = await prisma.activity.findUnique({ where: { id } })
    if (!activity) throw new Error("Activity not found")

    const updated = await prisma.activity.update({
        where: { id },
        data: {
            completed: !activity.completed,
            completedAt: !activity.completed ? new Date() : null,
        },
    })

    revalidatePath("/activities")
    revalidatePath("/dashboard")
    return updated
}

export async function deleteActivity(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.activity.delete({ where: { id } })
    revalidatePath("/activities")
    revalidatePath("/dashboard")
}
