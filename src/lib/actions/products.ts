"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getProducts() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })
}

export async function createProduct(data: {
    name: string
    sku?: string
    description?: string
    price: number
    quantity?: number
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const product = await prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            description: data.description,
            price: data.price,
            quantity: data.quantity || 0,
        },
    })

    revalidatePath("/products")
    return product
}

export async function updateProduct(
    id: string,
    data: {
        name?: string
        sku?: string | null
        description?: string | null
        price?: number
        quantity?: number
        isActive?: boolean
    }
) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const product = await prisma.product.update({
        where: { id },
        data,
    })

    revalidatePath("/products")
    return product
}

export async function deleteProduct(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.product.delete({ where: { id } })
    revalidatePath("/products")
}
