import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { z } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "production_ready_fallback_secret_at_least_32_chars");

export async function GET() {
    return NextResponse.json({ status: "Login API is online" });
}

export async function POST(req: NextRequest) {
    let currentStep = "INITIALIZATION";
    try {
        currentStep = "DB_CONNECT";
        await dbConnect();

        currentStep = "BODY_PARSE";
        const body = await req.json();

        currentStep = "VALIDATION";
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.issues }, { status: 400 });
        }

        const { email, password } = result.data;
        const normalizedEmail = email.toLowerCase().trim();

        currentStep = "ADMIN_LOOKUP";
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return NextResponse.json({ error: "Access denied. Invalid credentials." }, { status: 401 });
        }

        currentStep = "BCRYPT_COMPARE";
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Access denied. Invalid credentials." }, { status: 401 });
        }

        currentStep = "JWT_SIGNING";
        const token = await new SignJWT({
            email: admin.email,
            role: admin.role,
            displayName: admin.displayName,
            id: admin._id
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
            user: { email: admin.email, displayName: admin.displayName, role: admin.role }
        });

        currentStep = "SET_COOKIE";
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error(`CRITICAL_AUTH_ERROR AT ${currentStep}:`, error);
        return NextResponse.json({
            error: "System Integrity Failure",
            step: currentStep,
            message: error.message
        }, { status: 500 });
    }
}
