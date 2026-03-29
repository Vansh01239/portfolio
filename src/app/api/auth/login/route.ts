import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ error: "Configuration Error", message: "MONGODB_URI is not defined" }, { status: 500 });
        }
        if (!process.env.JWT_SECRET) {
            console.warn("JWT_SECRET is not defined, using fallback. This is insecure for production.");
        }

        await dbConnect();

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Validate input
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
        }

        const { email, password } = result.data;

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (admin && await bcrypt.compare(password, admin.password)) {
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

            const response = NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });

            response.cookies.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return response;
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
