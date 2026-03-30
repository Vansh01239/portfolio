import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { z } from "zod";

// Force Node.js runtime for compatibility with bcryptjs and mongoose
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "production_ready_fallback_secret_at_least_32_chars");

export async function GET() {
    return NextResponse.json({
        status: "Login API is online",
        timestamp: new Date().toISOString()
    });
}

import Admin from "@/models/Admin";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        let body;
        try {
            body = await req.json();
            console.log(`[AUTH_DEBUG] Login attempt received`);
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
        }

        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.issues }, { status: 400 });
        }

        const { email, password } = result.data;
        const normalizedEmail = email.toLowerCase().trim();

        // Safe model lookup
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            console.warn(`[AUTH_DEBUG] No admin found for: ${normalizedEmail}`);
            return NextResponse.json({ error: "Access denied. Invalid credentials." }, { status: 401 });
        }

        console.log(`[AUTH_DEBUG] Admin found. Comparing passwords...`);
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            console.warn(`[AUTH_DEBUG] Password mismatch for: ${normalizedEmail}`);
            return NextResponse.json({ error: "Access denied. Invalid credentials." }, { status: 401 });
        }

        console.log(`[AUTH_DEBUG] Authentication successful for: ${normalizedEmail}`);

        // Generate JWT
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
            user: {
                email: admin.email,
                displayName: admin.displayName,
                role: admin.role
            }
        });

        // Set secure cookie - explicitly false for localhost dev to prevent rejection
        const isProduction = process.env.NODE_ENV === "production";
        console.log(`[AUTH_DEBUG] Setting cookie. Production mode: ${isProduction}`);

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: isProduction, // Must be false for http://localhost
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        console.log("[AUTH_DEBUG] Cookie set successfully in response");
        return response;

    } catch (error: any) {
        console.error("CRITICAL_AUTH_ERROR:", error);
        return NextResponse.json({
            error: "System Integrity Failure",
            message: error.message
        }, { status: 500 });
    }
}
