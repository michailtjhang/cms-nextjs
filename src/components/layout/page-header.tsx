interface PageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {description && (
                    <p className="text-slate-400 text-sm mt-1">{description}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    )
}
