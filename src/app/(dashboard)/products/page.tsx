import { prisma } from "@/lib/prisma"
import { ProductsClient } from "@/components/products/products-client"

export default async function ProductsPage() {
    const productsRaw = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })

    // Convert Decimal to number for serialization
    const products = productsRaw.map((product) => ({
        ...product,
        price: Number(product.price),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }))

    return <ProductsClient products={products} />
}
