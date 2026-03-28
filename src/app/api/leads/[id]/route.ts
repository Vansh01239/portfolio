import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const lead = await Lead.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        return NextResponse.json(lead, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const lead = await Lead.findByIdAndDelete(id);
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        return NextResponse.json({ message: "Lead deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
