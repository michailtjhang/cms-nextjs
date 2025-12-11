import { prisma } from "@/lib/prisma"
import { QuotesClient } from "@/components/quotes/quotes-client"
import { auth } from "@/auth"

export default async function QuotesPage() {
    const session = await auth()

    const quotes = await prisma.quote.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: "desc" },
        include: {
            lead: { select: { title: true } },
        },
    })

    // Serializing Decimal and Date objects similar to LeadsPage to avoid warnings
    const serializedQuotes = quotes.map(quote => ({
        ...quote,
        total: quote.total.toString(),
        createdAt: quote.createdAt.toISOString(),
    }))

    return <QuotesClient quotes={serializedQuotes} />
}

