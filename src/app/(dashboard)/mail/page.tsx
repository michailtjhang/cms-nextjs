import { PageHeader } from "@/components/layout/page-header"
import { MailClient } from "@/components/mail/mail-client"
import { getEmails } from "@/lib/actions/mail"

export default async function MailPage() {
    const emails = await getEmails("inbox")

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
