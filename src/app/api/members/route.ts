import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

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
        const member = await Member.create(body);
        return NextResponse.json(member, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
