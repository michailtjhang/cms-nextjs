"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { generateQuoteNumber } from "@/lib/utils"

export async function getQuotes() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.quote.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            lead: { select: { title: true } },
            user: { select: { name: true } },
        },
    })
}

export async function createQuote(data: {
    subject: string
    leadId?: string
    total: number
    status?: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED"
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const quote = await prisma.quote.create({
        data: {
            quoteNumber: generateQuoteNumber(),
            subject: data.subject,
            leadId: data.leadId,
            total: data.total,
            status: data.status || "DRAFT",
            userId: session.user.id,
        },
    })

    revalidatePath("/quotes")
    return quote
}

export async function deleteQuote(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.quote.delete({ where: { id } })
    revalidatePath("/quotes")
}
