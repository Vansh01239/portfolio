"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Member } from "@/types";
import { ArrowLeft, Loader2, X } from "lucide-react";

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
import Button from "@/components/ui/Button";

export default function MemberDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/members/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMember({ ...data, id: data._id || data.id });
                } else {
                    console.error("Failed to fetch member:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching member:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold">Member not found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-12">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Team
            </Button>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
                    <Image
                        src={member.imageUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800"}
                        alt={member.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{member.name}</h1>
                        <p className="mt-2 text-xl font-medium text-accent">{member.role}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Biography</h3>
                        <p className="text-lg text-zinc-400 leading-relaxed">{member.bio}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                                <span key={skill} className="rounded-full bg-zinc-800 px-4 py-1 text-sm font-semibold text-zinc-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-6 pt-6">
                        {member.socialLinks.twitter && (
                            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-400 transition-colors">
                                <X className="h-6 w-6" />
                            </a>
                        )}
                        {member.socialLinks.linkedin && (
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <LinkedinIcon className="h-6 w-6" />
                            </a>
                        )}
                        {member.socialLinks.github && (
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                <GithubIcon className="h-6 w-6" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
