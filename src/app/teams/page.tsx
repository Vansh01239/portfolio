"use client";

import { useState, useEffect } from "react";
import { Member } from "@/types";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import { Loader2, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";

export default function TeamsPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch("/api/members");
                if (res.ok) {
                    const data = await res.json();
                    setMembers(data.filter((m: Member) => m.status === "active"));
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMembers();
    }, []);

    return (
        <main className="min-h-screen bg-black pt-32 pb-48 relative">
            <div className="absolute top-0 right-0 w-3/4 h-[800px] bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_50%)] opacity-30 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="max-w-3xl mb-24">
                        <h1 className="text-5xl font-black text-white sm:text-8xl tracking-tighter leading-none italic">
                            The <span className="text-accent not-italic">Team</span>
                        </h1>
                        <p className="mt-8 text-2xl text-zinc-500 font-bold tracking-tight">
                            Meet the brilliant minds powering our digital innovations. We are engineers, designers, and strategists.
                        </p>
                    </div>
                </Reveal>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    </div>
                ) : members.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {members.map((member, i) => (
                            <Reveal key={member.id || (member as any)._id} delay={i * 0.1}>
                                <div className="group relative block overflow-hidden rounded-[2.5rem] glass p-3 transition-all hover:shadow-2xl hover:shadow-accent/20 border border-white/5 hover:border-white/10">
                                    <div className="relative aspect-4/5 w-full overflow-hidden rounded-4xl bg-zinc-900">
                                        <Image
                                            src={member.imageUrl || "/placeholder-avatar.jpg"}
                                            alt={member.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:-rotate-2 opacity-90 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-60" />

                                        <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                                            <h3 className="text-2xl font-black text-white tracking-tighter">{member.name}</h3>
                                            <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mt-2 line-clamp-1">{member.role}</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-3 mb-6">
                                            {member.bio || "Crafting digital experiences at AgencyX."}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            {member.socialLinks?.github && (
                                                <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                                                    <Github className="h-5 w-5" />
                                                </a>
                                            )}
                                            {member.socialLinks?.linkedin && (
                                                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#0a66c2] transition-colors">
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                            )}
                                            {member.socialLinks?.twitter && (
                                                <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#1d9bf0] transition-colors">
                                                    <Twitter className="h-5 w-5" />
                                                </a>
                                            )}
                                            {!member.socialLinks?.github && !member.socialLinks?.linkedin && !member.socialLinks?.twitter && (
                                                <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Connect</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[3rem] border border-white/5 glass p-20 text-center">
                        <p className="text-zinc-500 text-lg font-medium">No team members available right now.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
