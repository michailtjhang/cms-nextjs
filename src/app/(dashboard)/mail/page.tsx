
import { PageHeader } from "@/components/layout/page-header"
import { MailClient } from "@/components/mail/mail-client"
import { getEmails } from "@/lib/actions/mail"

export default async function MailPage() {
    let emails: any[] = []
    try {
        emails = await getEmails("inbox")
    } catch (error) {
        console.error("Failed to fetch emails:", error)
        // In pro, we might want to return empty or show error UI, but avoid 500 crash
        // Fallback to empty array
    }

    // Serialize dates for client component
    const serializedEmails = emails.map((email: any) => ({
        ...email,
        createdAt: email.createdAt.toISOString()
    }))

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mail"
                description="Manage your email communications"
            />
            <MailClient initialEmails={serializedEmails} />
        </div>
    )
}
