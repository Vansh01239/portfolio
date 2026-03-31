import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "production_fallback_secret_at_least_32_chars_long"
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return NextResponse.json({
            user: {
                uid: payload.id as string || "admin",
                email: payload.email as string,
                displayName: payload.displayName as string || "Admin User"
            }
        }, { status: 200 });

    } catch {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
