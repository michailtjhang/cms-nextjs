import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-slate-700 text-slate-200",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30",
        info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        outline: "border border-slate-700 text-slate-400",
    }

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

// Lead status specific badges
export function LeadStatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
        NEW: { variant: "info", label: "New" },
        CONTACTED: { variant: "warning", label: "Contacted" },
        QUALIFIED: { variant: "success", label: "Qualified" },
        PROPOSAL: { variant: "info", label: "Proposal" },
        NEGOTIATION: { variant: "warning", label: "Negotiation" },
        WON: { variant: "success", label: "Won" },
        LOST: { variant: "danger", label: "Lost" },
    }

    const config = statusConfig[status] || { variant: "default", label: status }

    return <Badge variant={config.variant}>{config.label}</Badge>
}
