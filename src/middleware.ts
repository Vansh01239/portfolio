import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "production_ready_fallback_secret_at_least_32_chars");

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes, but allow /admin/login
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = req.cookies.get("admin_token")?.value;

        if (!token) {
            console.warn("Middleware: No token found, redirecting to login");
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error: any) {
            console.error("Middleware: JWT Verification failed:", error.message);
            // Token invalid or expired
            const response = NextResponse.redirect(new URL("/admin/login", req.url));
            response.cookies.delete("admin_token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
