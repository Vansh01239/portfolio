import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { z } from "zod";

// Force Node.js runtime to ensure compatibility with bcryptjs and mongoose
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// Diagnostic GET to check if the endpoint is alive
export async function GET() {
    return NextResponse.json({
        status: "alive",
        env: {
            hasMongo: !!process.env.MONGODB_URI,
            hasJwt: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
}

export async function POST(req: NextRequest) {
    try {
        console.log("Login POST request received");

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ error: "Configuration Error", message: "MONGODB_URI is not defined in Vercel environment" }, { status: 500 });
        }

        await dbConnect();
        console.log("Database connected successfully");

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid format", details: result.error.issues }, { status: 400 });
        }

        const { email, password } = result.data;
        console.log("Searching for admin:", email.toLowerCase());

        const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

        if (!admin) {
            console.warn("Admin not found:", email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.warn("Password mismatch for:", email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        console.log("Password verified, signing JWT...");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_at_least_32_characters_long");

        const token = await new SignJWT({
            email: admin.email,
            role: admin.role,
            displayName: admin.displayName
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        const response = NextResponse.json({ success: true, message: "Login successful", user: { email: admin.email, displayName: admin.displayName } }, { status: 200 });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: true, // Always true for Vercel
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        console.log("Login successful, cookie set");
        return response;
    } catch (error: any) {
        console.error("CRITICAL LOGIN ERROR:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        }, { status: 500 });
    }
}
