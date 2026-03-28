"use client";

import { useEffect, useState } from "react";
import { Users, FolderKanban, Star, MessageSquare, ArrowUpRight, ArrowDownRight, Zap, Globe, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalProjects: 0,
        featuredProjects: 0,
        totalLeads: 0,
        newLeads: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [membersRes, projectsRes, leadsRes] = await Promise.allSettled([
                    fetch("/api/members"),
                    fetch("/api/projects"),
                    fetch("/api/leads"),
                ]);

                const members = membersRes.status === "fulfilled" && membersRes.value.ok
                    ? await membersRes.value.json() : JSON.parse(localStorage.getItem("agencyx_members") || "[]");
                const projects = projectsRes.status === "fulfilled" && projectsRes.value.ok
                    ? await projectsRes.value.json() : JSON.parse(localStorage.getItem("agencyx_projects") || "[]");
                const leads = leadsRes.status === "fulfilled" && leadsRes.value.ok
                    ? await leadsRes.value.json() : JSON.parse(localStorage.getItem("agencyx_leads") || "[]");

                setStats({
                    totalMembers: members.length,
                    totalProjects: projects.length,
                    featuredProjects: projects.filter((p: any) => p.featured).length,
                    totalLeads: leads.length,
                    newLeads: leads.filter((l: any) => l.status === "new").length,
                });
            } catch {
                const members = JSON.parse(localStorage.getItem("agencyx_members") || "[]");
                const projects = JSON.parse(localStorage.getItem("agencyx_projects") || "[]");
                const leads = JSON.parse(localStorage.getItem("agencyx_leads") || "[]");
                setStats({
                    totalMembers: members.length,
                    totalProjects: projects.length,
                    featuredProjects: projects.filter((p: any) => p.featured).length,
                    totalLeads: leads.length,
                    newLeads: leads.filter((l: any) => l.status === "new").length,
                });
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const statCards = [
        { icon: Users, label: "Personnel", value: stats.totalMembers, color: "text-blue-400", glow: "from-blue-500/20", href: "/admin/members" },
        { icon: FolderKanban, label: "Projects", value: stats.totalProjects, color: "text-accent", glow: "from-accent/20", href: "/admin/projects" },
        { icon: Star, label: "Featured", value: stats.featuredProjects, color: "text-yellow-400", glow: "from-yellow-500/20", href: "/admin/projects" },
        { icon: MessageSquare, label: "Leads", value: stats.totalLeads, badge: stats.newLeads, color: "text-emerald-400", glow: "from-emerald-500/20", href: "/admin/leads" },
    ];

    const quickLinks = [
        { label: "Add Personnel", href: "/admin/members", color: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400" },
        { label: "New Project", href: "/admin/projects", color: "bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent" },
        { label: "View Leads", href: "/admin/leads", color: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400" },
        { label: "Settings", href: "/admin/settings", color: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-400" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Overview</p>
                    <h1 className="text-5xl font-black text-white tracking-tighter italic">
                        Command <span className="text-accent not-italic">Center</span>
                    </h1>
                    <p className="mt-3 text-lg text-zinc-500 font-medium tracking-tight">
                        Real-time intelligence and agency operations.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-sm font-black uppercase tracking-widest text-emerald-400">
                        {loading ? "Loading..." : "All Systems Nominal"}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group relative overflow-hidden rounded-4xl border border-white/5 bg-zinc-950/60 p-7 backdrop-blur-2xl transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${stat.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="relative">
                                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 ${stat.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-1.5">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-black text-white tracking-tighter leading-none">
                                        {loading ? "—" : stat.value}
                                    </p>
                                    {"badge" in stat && stat.badge ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-accent">
                                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                                            {stat.badge} new
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="rounded-4xl border border-white/5 bg-zinc-950/40 p-7">
                <h3 className="text-sm font-black text-white tracking-tighter uppercase mb-5">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickLinks.map((ql) => (
                        <Link
                            key={ql.label}
                            href={ql.href}
                            className={`flex items-center justify-center rounded-xl border px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-200 ${ql.color}`}
                        >
                            {ql.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
