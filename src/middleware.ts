import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lightweight middleware that checks for session cookie
// instead of importing heavy NextAuth module
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check for NextAuth session cookie
    const sessionCookie = request.cookies.get("authjs.session-token") ||
        request.cookies.get("__Secure-authjs.session-token")
    const isLoggedIn = !!sessionCookie

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
    const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/leads") ||
        pathname.startsWith("/contacts") ||
        pathname.startsWith("/products") ||
        pathname.startsWith("/activities") ||
        pathname.startsWith("/quotes") ||
        pathname.startsWith("/mail") ||
        pathname.startsWith("/settings")
    const isPublicRoute = pathname === "/"

    // Redirect logged-in users away from auth routes
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Redirect non-logged-in users to login from protected routes
    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect root to dashboard if logged in, otherwise to login
    if (isPublicRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        } else {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}

