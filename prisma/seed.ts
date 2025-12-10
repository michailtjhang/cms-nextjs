import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
        },
    })
    console.log("✅ Created admin user:", admin.email)

    // Create sample organizations
    const org1 = await prisma.organization.create({
        data: {
            name: "Acme Corporation",
            email: "contact@acme.com",
            phone: "+1 234 567 890",
            website: "https://acme.com",
            industry: "Technology",
            address: "123 Main St, New York, NY",
        },
    })

    const org2 = await prisma.organization.create({
        data: {
            name: "TechStart Inc",
            email: "hello@techstart.io",
            phone: "+1 555 123 456",
            website: "https://techstart.io",
            industry: "SaaS",
        },
    })
    console.log("✅ Created sample organizations")

    // Create sample contacts
    const contact1 = await prisma.contact.create({
        data: {
            name: "John Smith",
            email: "john@acme.com",
            phone: "+1 234 567 891",
            jobTitle: "CEO",
            organizationId: org1.id,
        },
    })

    const contact2 = await prisma.contact.create({
        data: {
            name: "Sarah Johnson",
            email: "sarah@techstart.io",
            phone: "+1 555 123 457",
            jobTitle: "CTO",
            organizationId: org2.id,
        },
    })

    const contact3 = await prisma.contact.create({
        data: {
            name: "Mike Brown",
            email: "mike@example.com",
            phone: "+1 777 888 999",
            jobTitle: "Sales Manager",
        },
    })
    console.log("✅ Created sample contacts")

    // Create sample products
    await prisma.product.createMany({
        data: [
            {
                name: "Enterprise CRM License",
                sku: "CRM-ENT-001",
                description: "Annual enterprise license for CRM software",
                price: 9999.00,
                quantity: 100,
            },
            {
                name: "Professional Support",
                sku: "SUP-PRO-001",
                description: "24/7 professional support package",
                price: 2499.00,
                quantity: 50,
            },
            {
                name: "Training Package",
                sku: "TRN-001",
                description: "Complete training for your team",
                price: 1499.00,
                quantity: 25,
            },
        ],
    })
    console.log("✅ Created sample products")

    // Create sample leads
    const lead1 = await prisma.lead.create({
        data: {
            title: "Enterprise CRM Implementation",
            description: "Full CRM implementation for Acme Corporation",
            value: 50000.00,
            status: "QUALIFIED",
            source: "WEB",
            contactId: contact1.id,
            organizationId: org1.id,
            userId: admin.id,
        },
    })

    const lead2 = await prisma.lead.create({
        data: {
            title: "SaaS Platform Integration",
            description: "Integration services for TechStart",
            value: 25000.00,
            status: "PROPOSAL",
            source: "REFERRAL",
            contactId: contact2.id,
            organizationId: org2.id,
            userId: admin.id,
        },
    })

    const lead3 = await prisma.lead.create({
        data: {
            title: "Training Workshop",
            description: "On-site training for sales team",
            value: 5000.00,
            status: "NEW",
            source: "EMAIL",
            contactId: contact3.id,
            userId: admin.id,
        },
    })

    const lead4 = await prisma.lead.create({
        data: {
            title: "Annual Support Contract",
            description: "Renewal of annual support package",
            value: 12000.00,
            status: "NEGOTIATION",
            source: "PHONE",
            contactId: contact1.id,
            organizationId: org1.id,
            userId: admin.id,
        },
    })
    console.log("✅ Created sample leads")

    // Create sample activities
    await prisma.activity.createMany({
        data: [
            {
                type: "CALL",
                title: "Initial discovery call with Acme",
                description: "Discussed requirements and timeline",
                completed: true,
                completedAt: new Date(),
                leadId: lead1.id,
                contactId: contact1.id,
                userId: admin.id,
            },
            {
                type: "MEETING",
                title: "Demo presentation for TechStart",
                description: "Product demo and Q&A session",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                leadId: lead2.id,
                contactId: contact2.id,
                userId: admin.id,
            },
            {
                type: "EMAIL",
                title: "Follow up on proposal",
                description: "Send updated pricing proposal",
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                leadId: lead2.id,
                userId: admin.id,
            },
            {
                type: "TASK",
                title: "Prepare training materials",
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                leadId: lead3.id,
                userId: admin.id,
            },
            {
                type: "NOTE",
                title: "Contract negotiation notes",
                description: "Client requested 10% discount for multi-year commitment",
                completed: true,
                completedAt: new Date(),
                leadId: lead4.id,
                userId: admin.id,
            },
        ],
    })
    console.log("✅ Created sample activities")

    console.log("🎉 Database seeding completed!")
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
