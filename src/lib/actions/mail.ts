"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getEmails(folder: string = "inbox") {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    return prisma.email.findMany({
        where: {
            userId: session.user.id,
            folder: folder
        },
        orderBy: { createdAt: "desc" }
    })
}

export async function sendEmail(data: { to: string; subject: string; body: string }) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // In a real app, you would send via SMTP here.
    // For now, we save to "sent" folder of sender.

    // Create "Sent" copy
    await prisma.email.create({
        data: {
            from: session.user.email || "me@example.com",
            to: data.to,
            subject: data.subject,
            body: data.body,
            folder: "sent",
            read: true,
            userId: session.user.id
        }
    })

    // Simulate "Inbox" copy if we were sending to another user in system?
    // Not needed unless we want to demo internal messaging between users.
    // Let's keep it simple: just save to Sent.

    revalidatePath("/mail")
}

export async function deleteEmail(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // If already in trash, delete permanently
    const email = await prisma.email.findUnique({ where: { id } })
    if (!email) return

    if (email.folder === "trash") {
        await prisma.email.delete({ where: { id } })
    } else {
        await prisma.email.update({
            where: { id },
            data: { folder: "trash" }
        })
    }
    revalidatePath("/mail")
}

export async function markAsRead(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.email.update({
        where: { id },
        data: { read: true }
    })
    revalidatePath("/mail")
}

export async function toggleStar(id: string, starred: boolean) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.email.update({
        where: { id },
        data: { starred }
    })
    revalidatePath("/mail")
}
