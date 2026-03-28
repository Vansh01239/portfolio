"use client";

import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black pt-32 pb-48 relative">
            <div className="absolute top-0 left-0 w-1/2 h-[600px] bg-[radial-gradient(circle_at_top_left,var(--accent-glow),transparent_50%)] opacity-20 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="max-w-4xl mb-32">
                        <h1 className="text-5xl font-black text-white sm:text-7xl lg:text-8xl tracking-tighter leading-[0.9] italic">
                            Digital <span className="text-accent not-italic">Craftsmanship</span>
                        </h1>
                        <p className="mt-8 text-2xl text-zinc-400 font-bold tracking-tight leading-relaxed">
                            We are AgencyX. A collective of uncompromising engineers and designers obsessed with pushing the boundaries of what is possible on the web.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                    <Reveal>
                        <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-[3rem] border border-white/10 shadow-3xl">
                            <Image
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
                                alt="Agency Team Collaboration"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-black/60 to-transparent mix-blend-multiply" />
                        </div>
                    </Reveal>

                    <div className="space-y-12">
                        <Reveal>
                            <h2 className="text-4xl font-extrabold text-white tracking-tight">Our Philosophy</h2>
                            <p className="mt-6 text-lg text-zinc-400 leading-relaxed font-medium">
                                In a world cluttered with templates and generic solutions, we believe in the power of bespoke engineering. Every product we build is crafted from the ground up to solve complex problems with extraordinary elegance.
                            </p>
                        </Reveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { title: "Uncompromising Quality", desc: "We don't cut corners. Period." },
                                { title: "Performance First", desc: "Millisecond load times. Always." },
                                { title: "User Obsessed", desc: "Design that dictates human behavior." },
                                { title: "Future Proof", desc: "Architectures built for scale." }
                            ].map((item, i) => (
                                <Reveal key={item.title} delay={0.2 + (i * 0.1)}>
                                    <div className="border-l-2 border-accent/50 pl-6 py-2">
                                        <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-2">{item.title}</h3>
                                        <p className="text-sm font-medium text-zinc-500">{item.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                <Reveal width="100%">
                    <div className="rounded-[3rem] glass border border-white/10 p-12 sm:p-24 text-center mt-32 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter italic relative z-10">
                            Ready to build something <span className="text-accent not-italic">extraordinary?</span>
                        </h2>
                        <div className="mt-12 flex justify-center relative z-10">
                            <Link href="/contact">
                                <Button className="rounded-2xl px-12 py-8 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent/20 hover:scale-105 transition-transform">
                                    Let's Talk
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
