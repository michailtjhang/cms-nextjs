import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register")
    const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/leads") ||
        nextUrl.pathname.startsWith("/contacts") ||
        nextUrl.pathname.startsWith("/products") ||
        nextUrl.pathname.startsWith("/activities") ||
        nextUrl.pathname.startsWith("/quotes") ||
        nextUrl.pathname.startsWith("/mail") ||
        nextUrl.pathname.startsWith("/settings")
    const isApiRoute = nextUrl.pathname.startsWith("/api")
    const isPublicRoute = nextUrl.pathname === "/"

    // Redirect logged-in users away from auth routes
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    // Redirect non-logged-in users to login from protected routes
    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    // Redirect root to dashboard if logged in, otherwise to login
    if (isPublicRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        } else {
            return NextResponse.redirect(new URL("/login", nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
