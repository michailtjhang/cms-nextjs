"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface OverviewChartProps {
    data: { name: string; total: number }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#334155" : "#e2e8f0"} // Slate 700 vs Slate 200
                    vertical={false}
                />
                <XAxis
                    dataKey="name"
                    stroke={isDark ? "#888888" : "#64748b"} // Slate 500 equivalent
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke={isDark ? "#888888" : "#64748b"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderRadius: '8px',
                        color: isDark ? '#fff' : '#0f172a'
                    }}
                    itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
