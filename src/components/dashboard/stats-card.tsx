import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    variant?: "default" | "blue" | "green" | "purple" | "amber"
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = "default",
}: StatsCardProps) {
    const variants = {
        default: {
            bg: "bg-slate-800/50",
            iconBg: "bg-slate-700",
            iconColor: "text-slate-300",
        },
        blue: {
            bg: "bg-blue-500/10",
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
        },
        green: {
            bg: "bg-green-500/10",
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400",
        },
        purple: {
            bg: "bg-purple-500/10",
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400",
        },
        amber: {
            bg: "bg-amber-500/10",
            iconBg: "bg-amber-500/20",
            iconColor: "text-amber-400",
        },
    }

    const { bg, iconBg, iconColor } = variants[variant]

    return (
        <div
            className={cn(
                "rounded-xl border border-slate-800 p-6",
                "bg-slate-900/50 backdrop-blur-sm",
                "transition-all duration-200 hover:border-slate-700"
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {description && (
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    trend.isPositive ? "text-green-400" : "text-red-400"
                                )}
                            >
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-sm text-slate-500">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={cn("p-3 rounded-lg", iconBg)}>
                    <Icon className={cn("h-6 w-6", iconColor)} />
                </div>
            </div>
        </div>
    )
}
