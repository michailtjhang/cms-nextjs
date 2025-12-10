import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/actions/auth"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            )
        }

        const user = await createUser({ name, email, password })

        return NextResponse.json({
            message: "User created successfully",
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        )
    }
}
