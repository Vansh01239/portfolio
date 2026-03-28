"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Github, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ProjectDetailsPage() {
    const params = useParams();
    const [project, setProject] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProject() {
            try {
                const id = params?.id;
                if (!id) return;

                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) throw new Error("Project not found");

                const data = await res.json();
                setProject(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
                <h1 className="text-5xl font-black text-white italic tracking-tighter">404</h1>
                <p className="mt-4 text-zinc-500 font-medium">{error || "Project could not be found."}</p>
                <Link href="/projects" className="mt-8 text-accent hover:text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Archive
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black pt-32 pb-48 relative">
            <div className="absolute top-0 left-0 right-0 h-[600px] bg-accent/5 opacity-50 blur-[150px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal>
                    <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors mb-12">
                        <ChevronLeft className="h-4 w-4" /> Back to Archive
                    </Link>
                </Reveal>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
                    <div>
                        <Reveal delay={0.1}>
                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter italic leading-[0.9]">
                                {project.title}
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 text-xl sm:text-2xl text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-12 flex flex-wrap gap-4">
                                {project.links?.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                        <Button className="rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-[0.15em] shadow-xl shadow-accent/20 flex items-center gap-3">
                                            Visit Live Site <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                {project.links?.github && (
                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-[0.15em] hover:bg-white hover:text-black flex items-center gap-3">
                                            GitHub Repo <Github className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={0.4}>
                        <div className="relative aspect-4/3 w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl transform-gpu hover:scale-[1.02] transition-transform duration-700">
                            <Image
                                src={project.imageUrl || "/placeholder-project.jpg"}
                                alt={project.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-black/40 to-transparent mix-blend-multiply" />
                        </div>
                    </Reveal>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-24">
                    {/* Tech Stack */}
                    <div className="col-span-1">
                        <Reveal>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/5 pb-4">Technologies</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.techStack?.map((tech: string) => (
                                    <span key={tech} className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* Team Members */}
                    <div className="col-span-1 md:col-span-2">
                        <Reveal delay={0.2}>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/5 pb-4">Contributors</h3>
                            {project.teamMembers && project.teamMembers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {project.teamMembers.map((member: any) => (
                                        <div key={member._id} className="flex items-center gap-5 p-5 rounded-3xl glass border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10 shrink-0">
                                                <Image src={member.imageUrl || "/placeholder-avatar.jpg"} alt={member.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white transition-colors tracking-tight">{member.name}</h4>
                                                <p className="text-xs font-black uppercase tracking-widest text-accent mt-1">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-600 font-medium">No team members assigned.</p>
                            )}
                        </Reveal>
                    </div>
                </div>
            </div>
        </main>
    );
}
