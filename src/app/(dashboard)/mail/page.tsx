import { PageHeader } from "@/components/layout/page-header"
import { MailClient } from "@/components/mail/mail-client"

export default function MailPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Mail"
                description="Manage your email communications"
            />
            <MailClient />
        </div>
    )
}
