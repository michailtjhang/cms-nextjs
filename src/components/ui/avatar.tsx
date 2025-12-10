import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null
    name?: string | null
    size?: "sm" | "md" | "lg"
}

export function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
    }

    const colors = [
        "bg-blue-600",
        "bg-green-600",
        "bg-purple-600",
        "bg-amber-600",
        "bg-pink-600",
        "bg-cyan-600",
    ]

    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0

    if (src) {
        return (
            <div
                className={cn(
                    "rounded-full overflow-hidden flex items-center justify-center",
                    sizes[size],
                    className
                )}
                {...props}
            >
                <img src={src} alt={name || "Avatar"} className="h-full w-full object-cover" />
            </div>
        )
    }

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center font-medium text-white",
                sizes[size],
                colors[colorIndex],
                className
            )}
            {...props}
        >
            {getInitials(name)}
        </div>
    )
}
