import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes, but allow /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = req.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
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
