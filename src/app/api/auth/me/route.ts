import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "production_ready_fallback_secret_at_least_32_chars");

export async function GET(req: NextRequest) {
    try {
        const tokenTokenObj = req.cookies.get("admin_token");
        const token = tokenTokenObj?.value;
        console.log(`[AUTH_ME_DEBUG] Token found: ${!!token}`);

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        console.log(`[AUTH_ME_DEBUG] Token verified for: ${payload.email}`);

        return NextResponse.json({
            user: {
                uid: payload.id || "admin",
                email: payload.email,
                displayName: payload.displayName || "Admin User"
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error(`[AUTH_ME_DEBUG] Token verification failed: ${error.message}`);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
