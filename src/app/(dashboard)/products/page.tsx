import { prisma } from "@/lib/prisma"
import { ProductsClient } from "@/components/products/products-client"

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })

    return <ProductsClient products={products} />
}
