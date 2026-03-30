import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const health = {
            status: "ready",
            timestamp: new Date().toISOString(),
            checks: {
                mongodb_uri: !!process.env.MONGODB_URI,
                jwt_secret: !!process.env.JWT_SECRET,
                admin_email: !!process.env.ADMIN_EMAIL,
                node_env: process.env.NODE_ENV,
            }
        };

        return NextResponse.json(health);
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
