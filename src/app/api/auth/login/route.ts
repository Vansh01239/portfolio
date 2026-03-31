import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { z } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LoginSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
});

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "production_fallback_secret_at_least_32_chars_long"
);

export async function GET() {
    return NextResponse.json({ status: "Login API Online" });
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
        }

        const { email, password } = result.data;
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await new SignJWT({
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
            displayName: admin.displayName,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            success: true,
            user: { email: admin.email, displayName: admin.displayName, role: admin.role },
        });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error("Login API Error:", error.message);
        return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
    }
}
