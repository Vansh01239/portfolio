"use client";

import { useState, useEffect } from "react";
import { Member } from "@/types";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import { Loader2, ExternalLink, X } from "lucide-react";

// Inline SVGs for social icons not in lucide-react v1.7+
const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

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
                                                    <GithubIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                            {member.socialLinks?.linkedin && (
                                                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#0a66c2] transition-colors">
                                                    <LinkedinIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                            {member.socialLinks?.twitter && (
                                                <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#1d9bf0] transition-colors">
                                                    <X className="h-5 w-5" />
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
