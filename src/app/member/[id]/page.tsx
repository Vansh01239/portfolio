"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Member } from "@/types";
import { Github, Linkedin, Twitter, ArrowLeft, Loader2 } from "lucide-react";
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
                                <Twitter className="h-6 w-6" />
                            </a>
                        )}
                        {member.socialLinks.linkedin && (
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        )}
                        {member.socialLinks.github && (
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                <Github className="h-6 w-6" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
