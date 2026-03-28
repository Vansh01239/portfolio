"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Mail, Calendar, User, MessageSquare, Trash2, Search, Eye, Archive } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

interface Lead {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    status: "new" | "read" | "archived";
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "new" | "read" | "archived">("all");
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json();
                setLeads(data.map((l: any) => ({ ...l, id: l._id || l.id })));
            } else {
                const stored = localStorage.getItem("agencyx_leads");
                if (stored) setLeads(JSON.parse(stored));
            }
        } catch {
            const stored = localStorage.getItem("agencyx_leads");
            if (stored) setLeads(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const deleteLead = async (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id));
        try {
            await fetch(`/api/leads/${id}`, { method: "DELETE" });
            showToast("Lead removed", "success");
        } catch {
            showToast("Removed locally", "info");
        }
    };

    const updateLeadStatus = async (id: string, newStatus: "read" | "archived") => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        try {
            await fetch(`/api/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch { /* silent fallback */ }
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || l.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const newCount = leads.filter(l => l.status === "new").length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">
                            Leads <span className="text-accent underline decoration-white/10 underline-offset-8">Inbox</span>
                        </h1>
                        <p className="mt-3 text-lg text-zinc-500 font-medium">
                            {newCount > 0 ? `${newCount} new lead${newCount > 1 ? "s" : ""} awaiting review` : "All caught up — no new leads."}
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-full rounded-xl border border-white/5 bg-zinc-950/60 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-accent/40 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {(["all", "new", "read", "archived"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filterStatus === f
                                    ? "bg-accent text-white"
                                    : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {f}
                                {f === "new" && newCount > 0 && (
                                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/30 text-[9px] font-black">
                                        {newCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
            </p>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className={`relative rounded-2xl border bg-zinc-950/50 p-7 transition-all duration-300 hover:border-white/10 ${lead.status === "new"
                                    ? "border-accent/30 shadow-[0_0_15px_-5px_var(--accent-glow)]"
                                    : "border-white/5"
                                    }`}
                                onMouseEnter={() => lead.status === "new" && updateLeadStatus(lead.id, "read")}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-5">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1 text-xs font-bold text-white border border-white/5">
                                                <User className="h-3 w-3 text-accent" />
                                                {lead.name}
                                            </span>
                                            <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1 text-xs font-bold text-zinc-500 border border-white/5">
                                                <Mail className="h-3 w-3" />
                                                {lead.email}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(lead.date).toLocaleDateString()}
                                            </span>
                                            {lead.status === "new" && (
                                                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-base text-zinc-300 font-medium leading-relaxed italic">
                                            "{lead.message}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {lead.status !== "archived" && (
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, "archived")}
                                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                                                title="Archive"
                                            >
                                                <Archive className="h-3.5 w-3.5" />
                                                Archive
                                            </button>
                                        )}
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="p-2.5 text-zinc-500 hover:text-accent rounded-lg hover:bg-accent/10 transition-all"
                                            title="Reply via email"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => deleteLead(lead.id)}
                                            className="p-2.5 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/20 p-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-zinc-600">
                                <MessageSquare className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black text-white">No Leads Found</h3>
                            <p className="mt-2 text-zinc-500 font-medium">
                                {searchTerm ? "Try a different search term." : "Your inbox is empty."}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
