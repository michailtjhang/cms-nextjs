"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
    LayoutDashboard,
    Users,
    UserCircle,
    Package,
    CalendarCheck,
    Mail,
    FileText,
    Settings,
    ChevronLeft,
    LogOut,
    Menu,
} from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Contacts", href: "/contacts", icon: UserCircle },
    { name: "Products", href: "/products", icon: Package },
    { name: "Activities", href: "/activities", icon: CalendarCheck },
    { name: "Quotes", href: "/quotes", icon: FileText },
    { name: "Mail", href: "/mail", icon: Mail },
]

const bottomNavigation = [
    { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function Sidebar({ user }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border",
                    "transition-all duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">CRM</span>
                            </div>
                            <span className="font-semibold text-lg">NextCRM</span>
                        </Link>
                    )}
                    {collapsed && (
                        <div className="h-8 w-8 mx-auto rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">C</span>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent",
                            "transition-all duration-200",
                            collapsed && "absolute -right-3 top-12 bg-card border border-border shadow-md"
                        )}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-5 w-5 transition-transform duration-200",
                                collapsed && "rotate-180"
                            )}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                                    "transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom section */}
                <div className="px-3 py-4 border-t border-border space-y-2">
                    {bottomNavigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                                    "transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        )
                    })}

                    {/* User section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                                    {user?.name?.[0] || "U"}
                                </div>
                                {!collapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-foreground">{user?.name || "User"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                )}
                            </div>
                            {!collapsed && <ThemeToggle />}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            {!collapsed && <span>Sign Out</span>}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}
