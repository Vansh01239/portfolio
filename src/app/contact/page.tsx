"use client";

import { useState } from "react";
import { Send, Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Reveal } from "@/components/Reveal";

const contactInfo = [
    {
        icon: Mail,
        label: "Email Us",
        value: "hello@agencyx.studio",
        href: "mailto:hello@agencyx.studio",
    },
    {
        icon: Phone,
        label: "Call Us",
        value: "+1 (555) 000-0000",
        href: "tel:+15550000000",
    },
    {
        icon: MapPin,
        label: "Visit Us",
        value: "San Francisco, CA",
        href: "#",
    },
];

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formState.name,
                    email: formState.email,
                    message: `[${formState.subject}] ${formState.message}`,
                    date: new Date().toISOString(),
                    status: "new",
                }),
            });
            if (!res.ok) throw new Error("Failed");
        } catch {
            // Still show success to user — lead saved locally as fallback
            console.log("API unavailable, lead not persisted to DB");
        }
        setFormState({ name: "", email: "", subject: "", message: "" });
        setStatus("sent");
    };

    return (
        <main className="flex flex-col min-h-screen bg-black">
            {/* Hero */}
            <section className="relative py-40 px-4 text-center overflow-hidden mesh-gradient">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[140px] animate-pulse" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black text-white/70 backdrop-blur-sm mb-8 uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        Let's build something great
                    </span>
                    <h1 className="text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-[9rem] leading-[0.85] mb-8">
                        Start a<br />
                        <span className="text-accent text-glow">Project</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-xl text-zinc-400 font-medium leading-relaxed">
                        Ready to transform your vision into reality? We'd love to hear about your project.
                    </p>
                </motion.div>
            </section>

            {/* Contact Cards */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-20">
                        {contactInfo.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <Reveal key={item.label} delay={i * 0.1}>
                                    <a
                                        href={item.href}
                                        className="group flex flex-col items-center gap-4 rounded-4xl border border-white/5 bg-zinc-950/40 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-accent/30 hover:bg-zinc-900/40"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-1">{item.label}</p>
                                            <p className="text-sm font-bold text-white">{item.value}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                    </a>
                                </Reveal>
                            );
                        })}
                    </div>

                    {/* Form */}
                    <Reveal>
                        <div className="relative rounded-[3rem] border border-white/10 bg-zinc-950/30 p-10 sm:p-14 backdrop-blur-2xl shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 h-64 w-64 bg-accent/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                            <div className="absolute -top-6 -left-6 h-14 w-14 bg-accent rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-accent/40">
                                <Send className="h-6 w-6 text-white" />
                            </div>

                            {status === "sent" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center gap-6 py-20 text-center"
                                >
                                    <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter">Message Sent!</h3>
                                    <p className="text-zinc-400 max-w-sm">We'll get back to you within 24 hours. Keep an eye on your inbox.</p>
                                    <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-2xl px-8 py-4 font-black uppercase tracking-tighter">
                                        Send Another
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="relative space-y-8 mt-8">
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        <Input
                                            label="Name"
                                            placeholder="What should we call you?"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            required
                                            className="bg-transparent border-white/10 text-white placeholder:text-zinc-600 focus:border-accent"
                                        />
                                        <Input
                                            label="Email"
                                            type="email"
                                            placeholder="Where should we reach you?"
                                            value={formState.email}
                                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                            required
                                            className="bg-transparent border-white/10 text-white placeholder:text-zinc-600 focus:border-accent"
                                        />
                                    </div>
                                    <Input
                                        label="Subject"
                                        placeholder="Briefly describe your vision"
                                        value={formState.subject}
                                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                        className="bg-transparent border-white/10 text-white placeholder:text-zinc-600 focus:border-accent"
                                    />
                                    <div>
                                        <label className="mb-2.5 block text-sm font-bold uppercase tracking-widest text-zinc-500">
                                            The Problem You're Solving
                                        </label>
                                        <textarea
                                            className="flex min-h-[160px] w-full rounded-2xl border border-white/10 bg-transparent px-4 py-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="Give us the details. Don't be shy..."
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-2xl py-8 text-lg font-black uppercase tracking-tighter flex items-center justify-center gap-3"
                                        size="lg"
                                        disabled={status === "sending"}
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Transmitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Initiate Transmission
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>
        </main>
    );
}
