import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import "@/models/Member"; // Ensure Member model is registered

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const project = await Project.findById(id).populate("teamMembers", "name role imageUrl socialLinks");
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json({ message: "Project deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
