import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, type = "text", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            "w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700",
                            "text-white placeholder-slate-500",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "transition-all duration-200",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-400">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input }
