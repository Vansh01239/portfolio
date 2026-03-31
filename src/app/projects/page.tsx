"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import { Reveal } from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { Loader2, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.filter((p: Project) => p.status === "published"));
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <main className="min-h-screen bg-black pt-32 pb-48">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px] pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/80 to-black pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl font-black text-white sm:text-8xl tracking-tighter italic leading-none">
                                Project <span className="text-accent not-italic">Archive</span>
                            </h1>
                            <p className="mt-8 text-2xl text-zinc-500 font-bold tracking-tight">
                                A comprehensive index of our digital products, open-source tools, and client collaborations.
                            </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-xl glass p-1 border border-white/5">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </Reveal>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    </div>
                ) : projects.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, i) => (
                                <Reveal key={project.id || (project as any)._id} delay={i * 0.1}>
                                    <ProjectCard project={project} />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            {projects.map((project: any, i) => (
                                <Reveal key={project.id || (project as any)._id} delay={i * 0.05} width="100%">
                                    <Link
                                        href={`/project/${project.id || (project as any)._id}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-4xl glass border border-white/5 hover:border-accent/30 transition-all hover:bg-zinc-900/60"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative h-20 w-20 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                                                <Image
                                                    src={project.imageUrl || "/placeholder-project.jpg"}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-accent transition-colors tracking-tighter italic">{project.title}</h3>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {project.techStack?.slice(0, 4).map((tech: string) => (
                                                        <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                                            {project.teamMembers && project.teamMembers.length > 0 && (
                                                <div className="flex items-center -space-x-2">
                                                    {project.teamMembers.slice(0, 3).map((member: any) => (
                                                        <div key={member._id} className="relative h-8 w-8 overflow-hidden rounded-full border border-black backdrop-blur-md">
                                                            <Image src={member.imageUrl || "/placeholder-avatar.jpg"} alt={member.name} fill className="object-cover" />
                                                        </div>
                                                    ))}
                                                    {project.teamMembers.length > 3 && (
                                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-black bg-zinc-800 text-[10px] font-bold text-white">
                                                            +{project.teamMembers.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-black group-hover:bg-white group-hover:border-white transition-all duration-300 transform group-hover:-rotate-45">
                                                <ArrowUpRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="rounded-[3rem] border border-white/5 glass p-20 text-center">
                        <p className="text-zinc-500 text-lg font-medium">No projects available in the archive yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
