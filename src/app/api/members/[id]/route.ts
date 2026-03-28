import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const member = await Member.findById(id);
        if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
        return NextResponse.json(member, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const member = await Member.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
        return NextResponse.json(member, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const member = await Member.findByIdAndDelete(id);
        if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
        return NextResponse.json({ message: "Member deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
