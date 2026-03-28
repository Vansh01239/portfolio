"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Member, Project } from "@/types";
import MemberCard from "@/components/MemberCard";
import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

const mockMembers: Member[] = [
    { id: "1", name: "Alex Rivera", role: "Creative Director", bio: "Leading vision and design strategy.", skills: ["Branding", "UI/UX", "Strategy"], imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", status: "active", socialLinks: { twitter: "#", linkedin: "#", github: "#" } },
    { id: "2", name: "Sarah Chen", role: "Lead Developer", bio: "Focused on high-performance architectures.", skills: ["Next.js", "TypeScript", "Cloud"], imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800", status: "active", socialLinks: { twitter: "#", linkedin: "#", github: "#" } },
    { id: "3", name: "Marcus Thorne", role: "Backend Architect", bio: "Scaling systems and refining APIs.", skills: ["Node.js", "Go", "Kubernetes"], imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800", status: "active", socialLinks: { twitter: "#", github: "#" } },
    { id: "4", name: "Elena Vance", role: "Motion Designer", bio: "Bringing digital products to life.", skills: ["Figma", "After Effects", "Rive"], imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800", status: "active", socialLinks: { linkedin: "#", twitter: "#" } },
];

const mockProjects: Project[] = [
    { id: "p1", title: "Lumina SaaS Platform", description: "A comprehensive analytics dashboard for modern enterprise teams with real-time feedback.", techStack: ["Next.js", "Three.js", "Tailwind"], imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", featured: true, status: "published", links: { github: "#", demo: "#" } },
    { id: "p2", title: "Pulse Crypto Wallet", description: "Next-generation secure wallet with a focus on ease of use and rapid transaction speeds.", techStack: ["React Native", "Rust", "TypeScript"], imageUrl: "https://images.unsplash.com/photo-1633151209323-9562477382f6?auto=format&fit=crop&q=80&w=800", featured: true, status: "published", links: { github: "#", demo: "#" } },
    { id: "p3", title: "Aether AI Assistant", description: "Intelligent workflow automation powered by advanced neural networks and deep learning.", techStack: ["Python", "PyTorch", "Next.js"], imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800", featured: true, status: "published", links: { demo: "#" } },
];

export default function Home() {
    const [members, setMembers] = useState<Member[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [membersRes, projectsRes] = await Promise.allSettled([
                    fetch("/api/members"),
                    fetch("/api/projects"),
                ]);

                if (membersRes.status === "fulfilled" && membersRes.value.ok) {
                    const data = await membersRes.value.json();
                    setMembers(data.length > 0 ? data.filter((m: any) => m.status === "active").map((m: any) => ({ ...m, id: m._id || m.id })) : mockMembers);
                } else {
                    setMembers(mockMembers);
                }

                if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
                    const data = await projectsRes.value.json();
                    setProjects(data.length > 0 ? data.filter((p: any) => p.status === "published").map((p: any) => ({ ...p, id: p._id || p.id })) : mockProjects);
                } else {
                    setProjects(mockProjects);
                }
            } catch {
                setMembers(mockMembers);
                setProjects(mockProjects);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-48 text-center mesh-gradient">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] brightness-100 contrast-150" />
                    <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[160px] animate-pulse" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-black text-white/80 backdrop-blur-sm mb-12 uppercase tracking-widest"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Available for new projects
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-6xl text-7xl font-black tracking-tighter text-white sm:text-9xl lg:text-[10rem] leading-[0.8] mb-12"
                >
                    Crafting <span className="text-accent text-glow">Superior</span> <br /> Digital Products.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl text-xl text-zinc-400 sm:text-2xl font-bold leading-relaxed tracking-tight"
                >
                    Transforming complex ideas into seamless digital experiences through modern engineering and world-class design.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-16 flex flex-col gap-6 sm:flex-row items-center"
                >
                    <Link href="/contact">
                        <Button size="lg" className="rounded-2xl px-12 py-8 text-xl font-black uppercase tracking-tighter shadow-2xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                            Start Project
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 py-8 text-xl font-black uppercase tracking-tighter border-white/10 hover:bg-white/5 transition-all">
                        Showreel
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
                >
                    <div className="h-12 w-7 rounded-full border-2 border-white/20 flex justify-center p-1.5">
                        <div className="h-2 w-2 rounded-full bg-white/40" />
                    </div>
                </motion.div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px] pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/80 to-black pointer-events-none" />

                <div className="mx-auto max-w-7xl relative">
                    <Reveal width="100%">
                        <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8">
                            <div className="max-w-3xl">
                                <h2 className="text-5xl font-black text-white sm:text-8xl tracking-tighter italic leading-none">Selected <span className="text-accent not-italic">Works</span></h2>
                                <p className="mt-8 text-2xl text-zinc-500 font-bold tracking-tight">A curated selection of digital products we've built from the ground up.</p>
                            </div>
                            <Link href="/projects" className="text-sm font-black uppercase tracking-[0.3em] text-accent hover:text-white transition-colors flex items-center gap-3 group">
                                Explore Archive <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </Reveal>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, i) => (
                                <Reveal key={project.id} delay={i * 0.1}>
                                    <ProjectCard project={project} />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[3rem] border border-white/5 glass p-20 text-center">
                            <p className="text-zinc-500 text-lg font-medium">More masterpieces in the making. Check back soon.</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="about" className="py-48 px-4 sm:px-6 lg:px-8 bg-zinc-950/30 relative border-y border-white/5">
                <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />
                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 gap-24 lg:grid-cols-2 lg:items-center">
                        <Reveal>
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-10 bg-accent/20 blur-[100px] opacity-0 transition-opacity duration-1000 group-hover:opacity-100 rounded-full pointer-events-none" />
                                <div className="relative aspect-4/5 w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 shadow-3xl transition-all duration-700 ease-out transform-gpu group-hover:scale-[1.02] group-hover:-rotate-1">
                                    <Image
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
                                        alt="Agency culture"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
                                </div>
                                <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 h-40 w-40 glass rounded-full flex flex-col items-center justify-center border border-white/10 shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                                    <span className="text-5xl font-black text-white">5+</span>
                                    <span className="text-xs font-bold text-accent uppercase tracking-widest mt-1">Years</span>
                                </div>
                            </div>
                        </Reveal>
                        <div className="space-y-12">
                            <Reveal>
                                <h2 className="text-5xl font-black text-white sm:text-7xl lg:text-8xl tracking-tighter leading-[0.9] italic">
                                    We build <br /> <span className="text-accent not-italic drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">identities</span><br /> that last.
                                </h2>
                            </Reveal>

                            {/* Stats/Feature Grid */}
                            <Reveal delay={0.2}>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { title: "Cloud Native", value: "100%" },
                                        { title: "Pixel Perfect", value: "UI/UX" },
                                        { title: "User Centric", value: "Scale" },
                                        { title: "Global", value: "Reach" }
                                    ].map((stat, i) => (
                                        <div key={stat.title} className="p-6 glass rounded-3xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors group">
                                            <div className="text-3xl font-black text-white group-hover:text-accent transition-colors">{stat.value}</div>
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">{stat.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <p className="text-xl text-zinc-400 leading-relaxed font-medium tracking-tight border-l-2 border-accent/40 pl-6">
                                    We combine raw engineering power with artistic vision to create digital solutions that aren't just functional, but entirely unforgettable. Your brand deserves nothing less.
                                </p>
                            </Reveal>

                            <Reveal delay={0.6}>
                                <div className="flex flex-wrap items-center gap-6 pt-4">
                                    <Link href="/contact">
                                        <Button className="rounded-2xl px-10 py-6 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all">
                                            Start Your Project
                                        </Button>
                                    </Link>
                                    <Link href="#team" className="text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group">
                                        Meet the Team <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-48 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--accent-glow),transparent_40%)]" />
                <div className="mx-auto max-w-7xl relative">
                    <Reveal width="100%">
                        <div className="mb-24 text-center max-w-4xl mx-auto">
                            <h2 className="text-5xl font-black text-white sm:text-8xl tracking-tighter leading-none italic">Founding <span className="text-accent not-italic">Team</span></h2>
                            <p className="mt-8 text-2xl text-zinc-500 font-bold tracking-tight">The visionaries and builders behind AgencyX.</p>
                        </div>
                    </Reveal>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                    ) : members.length > 0 ? (
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                            {members.map((member, i) => (
                                <Reveal key={member.id} delay={i * 0.1}>
                                    <MemberCard member={member} />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[3rem] border border-white/5 glass p-20 text-center">
                            <p className="text-zinc-500 text-lg font-medium">Expanding our universe, one expert at a time.</p>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
