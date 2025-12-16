"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

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
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized: Please log in." }
    }

    try {
        // 1. Send via SMTP (Real Email)
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            console.log("Attempting SMTP send to:", data.to)
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            await transporter.verify()

            await transporter.sendMail({
                from: process.env.SMTP_FROM || session.user.email || `"NextCRM" <${process.env.SMTP_USER}>`,
                to: data.to,
                subject: data.subject,
                text: data.body,
                html: data.body.replace(/\n/g, "<br>"),
            })
            console.log("SMTP Send Success")
        }

        // 2. Save to "Sent" folder in Database
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

        revalidatePath("/mail")
        return { success: true }
    } catch (error: any) {
        console.error("Mail Action Error:", error)
        // Return reliable error string to client
        return { success: false, error: error.message || "Failed to send email" }
    }
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
