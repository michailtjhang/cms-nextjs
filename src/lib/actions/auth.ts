"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch {
        return null
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        })
        return user
    } catch {
        return null
    }
}

export async function createUser(data: {
    name: string
    email: string
    password: string
}) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    })

    return user
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}
