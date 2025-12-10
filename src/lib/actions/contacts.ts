"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getContacts() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            organization: { select: { id: true, name: true } },
            _count: { select: { leads: true, activities: true } },
        },
    })
}

export async function createContact(data: {
    name: string
    email?: string
    phone?: string
    jobTitle?: string
    address?: string
    notes?: string
    organizationId?: string
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const contact = await prisma.contact.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            jobTitle: data.jobTitle,
            address: data.address,
            notes: data.notes,
            organizationId: data.organizationId || null,
        },
    })

    revalidatePath("/contacts")
    revalidatePath("/dashboard")
    return contact
}

export async function updateContact(
    id: string,
    data: {
        name?: string
        email?: string | null
        phone?: string | null
        jobTitle?: string | null
        address?: string | null
        notes?: string | null
        organizationId?: string | null
    }
) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const contact = await prisma.contact.update({
        where: { id },
        data,
    })

    revalidatePath("/contacts")
    revalidatePath(`/contacts/${id}`)
    return contact
}

export async function deleteContact(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.contact.delete({ where: { id } })
    revalidatePath("/contacts")
}

// Organizations
export async function getOrganizations() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.organization.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { contacts: true, leads: true } },
        },
    })
}

export async function createOrganization(data: {
    name: string
    email?: string
    phone?: string
    website?: string
    industry?: string
    address?: string
    notes?: string
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const org = await prisma.organization.create({ data })
    revalidatePath("/contacts")
    return org
}

export async function deleteOrganization(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.organization.delete({ where: { id } })
    revalidatePath("/contacts")
}
