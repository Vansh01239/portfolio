import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return NextResponse.json({
            user: {
                uid: "admin",
                email: payload.email,
                displayName: payload.displayName || "Admin User"
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
