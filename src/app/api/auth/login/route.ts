import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { z } from "zod";

// Force Node.js runtime to ensure compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    console.log("LOGIN_DEBUG: Request received at /api/auth/login");

    try {
        // 1. Check Body Parsing
        let body;
        try {
            body = await req.json();
            console.log("LOGIN_DEBUG: Body parsed successfully");
        } catch (e) {
            console.error("LOGIN_DEBUG: Body parse error", e);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // 2. Validate with Zod
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            console.warn("LOGIN_DEBUG: Validation failed", result.error.issues);
            return NextResponse.json({ error: "Invalid format", details: result.error.issues }, { status: 400 });
        }
        const { email, password } = result.data;

        // 3. Database Connection
        console.log("LOGIN_DEBUG: Connecting to DB...");
        try {
            await dbConnect();
            console.log("LOGIN_DEBUG: DB Connected");
        } catch (dbErr: any) {
            console.error("LOGIN_DEBUG: DB Connection Error", dbErr);
            return NextResponse.json({ error: "Database Connection Error", message: dbErr.message }, { status: 500 });
        }

        // 4. Model Retrieval (Safe approach)
        console.log("LOGIN_DEBUG: Retrying Admin model...");
        const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({
            email: { type: String, required: true },
            password: { type: String, required: true },
            displayName: String,
            role: String
        }));

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        console.log("LOGIN_DEBUG: Admin lookup finished. Admin found?", !!admin);

        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 5. Password Comparison
        console.log("LOGIN_DEBUG: Comparing passwords...");
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("LOGIN_DEBUG: Password match result:", isMatch);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 6. JWT Signing
        console.log("LOGIN_DEBUG: Signing JWT...");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_at_least_32_chars");

        const token = await new SignJWT({
            email: admin.email,
            role: admin.role,
            displayName: admin.displayName
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: { email: admin.email, displayName: admin.displayName }
        });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        console.log("LOGIN_DEBUG: Response ready");
        return response;

    } catch (criticalErr: any) {
        console.error("LOGIN_DEBUG: CRITICAL ERROR", criticalErr);
        return NextResponse.json({
            error: "Critical Server Error",
            message: criticalErr.message,
            step: "Final catch block"
        }, { status: 500 });
    }
}

// Keep GET for diagnostics
export async function GET() {
    return NextResponse.json({ status: "Login API is online", timestamp: new Date().toISOString() });
}
