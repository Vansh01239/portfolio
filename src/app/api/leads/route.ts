import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { z } from "zod";

const LeadSchema = z.object({
    name: z.string().min(2),
    email: z.string().min(1).email(),
    message: z.string().min(5),
    status: z.enum(["new", "read", "archived"]).default("new"),
});

export async function GET() {
    try {
        await dbConnect();
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        return NextResponse.json(leads, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const result = LeadSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
        }

        const lead = await Lead.create(result.data);
        return NextResponse.json(lead, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
