import { prisma } from "@/lib/prisma"
import { ContactsClient } from "@/components/contacts/contacts-client"

export default async function ContactsPage() {
    const [contacts, organizations] = await Promise.all([
        prisma.contact.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                organization: { select: { id: true, name: true } },
                _count: { select: { leads: true, activities: true } },
            },
        }),
        prisma.organization.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ])

    return <ContactsClient contacts={contacts} organizations={organizations} />
}
