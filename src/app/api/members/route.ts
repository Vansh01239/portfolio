import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";
import { z } from "zod";

const MemberSchema = z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    bio: z.string().min(10),
    skills: z.array(z.string()),
    status: z.enum(["active", "inactive"]).default("active"),
    imageUrl: z.string().optional().or(z.literal("")),
    socialLinks: z.object({
        github: z.string().optional().or(z.literal("")),
        linkedin: z.string().optional().or(z.literal("")),
        twitter: z.string().optional().or(z.literal("")),
    }),
});

export async function GET() {
    try {
        await dbConnect();
        const members = await Member.find({}).sort({ createdAt: -1 });
        return NextResponse.json(members, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const result = MemberSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
        }

        const member = await Member.create(result.data);
        return NextResponse.json(member, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
