"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Registration failed")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl opacity-20" />

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                        <span className="text-white font-bold text-xl">CRM</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create an account</h1>
                    <p className="text-slate-400 mt-2">Get started with NextCRM today</p>
                </div>

                {/* Register form */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Registration successful!
                            </h2>
                            <p className="text-slate-400">
                                Redirecting you to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Input
                                type="text"
                                label="Full name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                leftIcon={<User className="h-5 w-5" />}
                                required
                            />

                            <Input
                                type="email"
                                label="Email address"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="h-5 w-5" />}
                                required
                            />

                            <Input
                                type="password"
                                label="Password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="h-5 w-5" />}
                                required
                            />

                            <Input
                                type="password"
                                label="Confirm password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock className="h-5 w-5" />}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Create account
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
