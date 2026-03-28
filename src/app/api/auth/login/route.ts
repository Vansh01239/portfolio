import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = await new SignJWT({
                email: admin.email,
                role: admin.role,
                displayName: admin.displayName
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("24h")
                .sign(JWT_SECRET);

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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
