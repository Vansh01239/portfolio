import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import "@/models/Member"; // Ensure Member model is registered for populate

export async function GET() {
    try {
        await dbConnect();
        const projects = await Project.find({})
            .populate("teamMembers", "name role imageUrl socialLinks")
            .sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const project = await Project.create(body);
        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
