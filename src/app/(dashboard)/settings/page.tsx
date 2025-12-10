import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Palette } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    return (
        <div className="space-y-6 max-w-4xl">
            <PageHeader
                title="Settings"
                description="Manage your account and application settings"
            />

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-400" />
                        <div>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your personal information</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar name={session.user.name} size="lg" />
                        <div>
                            <h3 className="text-white font-medium">{session.user.name}</h3>
                            <p className="text-sm text-slate-400">{session.user.email}</p>
                            <Badge variant="info" className="mt-2">{session.user.role || "User"}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            defaultValue={session.user.name || ""}
                            disabled
                        />
                        <Input
                            label="Email"
                            type="email"
                            defaultValue={session.user.email || ""}
                            disabled
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" disabled>
                            Update Profile (Coming Soon)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-slate-400" />
                        <div>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and security settings</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Current Password"
                            type="password"
                            placeholder="••••••••"
                            disabled
                        />
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            disabled
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" disabled>
                            Change Password (Coming Soon)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-slate-400" />
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-800">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-sm text-slate-400">Receive email updates about your leads</p>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-800">
                            <div>
                                <p className="text-white font-medium">Activity Reminders</p>
                                <p className="text-sm text-slate-400">Get reminded about upcoming activities</p>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-slate-400" />
                        <div>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-sm text-slate-400">Currently using dark theme</p>
                        </div>
                        <Badge variant="success">Enabled</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
