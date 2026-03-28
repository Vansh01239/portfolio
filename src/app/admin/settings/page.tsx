"use client";

import React from "react";
import { Settings, Shield, Bell, Database, Globe, Zap } from "lucide-react";

const settingSections = [
    {
        title: "System Configuration",
        icon: Settings,
        description: "Core application settings and global variables.",
        options: ["SEO Meta Tags", "API Endpoints", "Maintenance Mode"]
    },
    {
        title: "Security & Access",
        icon: Shield,
        description: "Manage administrative permissions and authentication protocols.",
        options: ["Admin Credentials", "Two-Factor Auth", "Access Logs"]
    },
    {
        title: "Notifications",
        icon: Bell,
        description: "Configure system alerts and internal messaging.",
        options: ["Email Templates", "Desktop Alerts", "SMS Gateway"]
    },
    {
        title: "Data Management",
        icon: Database,
        description: "Database backup, export, and synchronization tools.",
        options: ["Export All Data", "Cleanup Logs", "Sync Media Cloud"]
    }
];

export default function SettingsPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div>
                <h1 className="text-5xl font-black text-white tracking-tighter">System <span className="text-accent italic">Settings</span></h1>
                <p className="mt-4 text-lg text-zinc-500 font-medium">Configure and optimize your agency's digital infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settingSections.map((section, i) => (
                    <div
                        key={section.title}
                        className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-10 transition-all duration-500 hover:border-white/10 hover:translate-y-[-4px]"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-start gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                                <section.icon className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-white tracking-tight">{section.title}</h3>
                                <p className="mt-2 text-zinc-500 font-medium leading-relaxed">{section.description}</p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {section.options.map(option => (
                                        <div key={option} className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-zinc-400 border border-white/5 hover:border-accent/40 hover:text-white cursor-pointer transition-all">
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-[3rem] border border-white/5 bg-linear-to-br from-accent/5 to-purple-500/5 p-12 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-radial-gradient from-accent/10 to-transparent -z-10" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl text-center md:text-left">
                        <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
                            <Zap className="h-8 w-8 text-accent animate-pulse" />
                            System Optimization
                        </h2>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            Your CMS is currently running on the latest Vercel Edge infrastructure with optimized Edge Caching enabled. Performance is at peak capacity.
                        </p>
                    </div>
                    <button className="rounded-2xl bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-[#030303] hover:bg-accent hover:text-white transition-all shadow-2xl">
                        Purge Edge Cache
                    </button>
                </div>
            </div>
        </div>
    );
}
