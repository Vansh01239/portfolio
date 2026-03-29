import { NextRequest, NextResponse } from "next/server";

// Zero-dependency diagnostic to find the root of the 500 error
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        diagnostic: "Naked GET is working",
        timestamp: new Date().toISOString(),
        node: process.version
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        return NextResponse.json({
            diagnostic: "Naked POST received data",
            received: body.email || "No email",
            status: "Success Establish Connectivity"
        });
    } catch (e: any) {
        return NextResponse.json({ error: "Naked POST failed", message: e.message }, { status: 500 });
    }
}
