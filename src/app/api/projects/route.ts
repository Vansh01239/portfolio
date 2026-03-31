import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import "@/models/Member"; // Ensure Member model is registered for populate
import { z } from "zod";

const ProjectSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    techStack: z.array(z.string()),
    imageUrl: z.string().optional().or(z.literal("")),
    links: z.object({
        github: z.string().optional().or(z.literal("")),
        demo: z.string().optional().or(z.literal("")),
    }),
    featured: z.boolean().default(false),
    status: z.enum(["published", "draft"]).default("published"),
    teamMembers: z.array(z.string()).optional(),
});

export async function GET() {
    try {
        await dbConnect();
        const projects = await Project.find({})
            .populate("teamMembers", "name role imageUrl socialLinks")
            .sort({ createdAt: -1 });

        return NextResponse.json(projects, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const result = ProjectSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
        }

        const project = await Project.create(result.data);
        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
