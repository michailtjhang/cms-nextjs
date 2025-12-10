import { auth } from "@/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar user={session.user} />
            <main className="lg:pl-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
