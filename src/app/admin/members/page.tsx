"use client";

import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/Modal";
import Image from "next/image";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import TagSelector from "@/components/ui/TagSelector";
import { useToast } from "@/components/ui/Toast";

export default function MembersManager() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        twitter: "",
        linkedin: "",
        github: "",
    });
    const [skills, setSkills] = useState<string[]>([]);
    const [status, setStatus] = useState<"active" | "inactive">("active");
    const [imageUrl, setImageUrl] = useState("");
    const { showToast } = useToast();

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/members");
            if (res.ok) {
                const data = await res.json();
                setMembers(data.map((m: any) => ({ ...m, id: m._id || m.id })));
            } else {
                const stored = localStorage.getItem("agencyx_members");
                if (stored) setMembers(JSON.parse(stored));
            }
        } catch {
            const stored = localStorage.getItem("agencyx_members");
            if (stored) setMembers(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    const handleOpenModal = (member?: Member) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                bio: member.bio,
                twitter: member.socialLinks.twitter || "",
                linkedin: member.socialLinks.linkedin || "",
                github: member.socialLinks.github || "",
            });
            setSkills(member.skills);
            setStatus(member.status || "active");
            setImageUrl(member.imageUrl);
        } else {
            setEditingMember(null);
            setFormData({ name: "", role: "", bio: "", twitter: "", linkedin: "", github: "" });
            setSkills([]);
            setStatus("active");
            setImageUrl("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                role: formData.role,
                bio: formData.bio,
                skills,
                status,
                imageUrl: imageUrl || "https://images.unsplash.com/photo-1599305016911-995c2e92c206?auto=format&fit=crop&q=80&w=400",
                socialLinks: {
                    twitter: formData.twitter,
                    linkedin: formData.linkedin,
                    github: formData.github,
                },
            };

            let res: Response;
            if (editingMember) {
                res = await fetch(`/api/members/${editingMember.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/members", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                showToast(editingMember ? "Personnel record updated" : "Personnel deployed", "success");
                fetchMembers();
            } else {
                // Fallback to localStorage
                const data: Member = { id: editingMember?.id || Date.now().toString(), ...payload };
                const updated = editingMember
                    ? members.map(m => m.id === editingMember.id ? data : m)
                    : [...members, data];
                setMembers(updated);
                localStorage.setItem("agencyx_members", JSON.stringify(updated));
                showToast(editingMember ? "Updated (local)" : "Created (local)", "success");
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            showToast("Operation failed", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this personnel?")) return;
        try {
            const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Personnel removed", "success");
                fetchMembers();
            } else {
                const filtered = members.filter(m => m.id !== id);
                setMembers(filtered);
                localStorage.setItem("agencyx_members", JSON.stringify(filtered));
                showToast("Removed (local)", "success");
            }
        } catch {
            const filtered = members.filter(m => m.id !== id);
            setMembers(filtered);
            localStorage.setItem("agencyx_members", JSON.stringify(filtered));
            showToast("Removed (local)", "success");
        }
    };

    const handleToggleStatus = async (member: Member) => {
        const newStatus = member.status === "active" ? "inactive" : "active";
        setMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
        try {
            await fetch(`/api/members/${member.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            showToast(newStatus === "active" ? "Personnel activated" : "Personnel deactivated", "success");
        } catch {
            showToast("Updated locally", "info");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter italic">Team <span className="text-accent not-italic">Personnel</span></h1>
                    <p className="mt-3 text-lg text-zinc-500 font-medium tracking-tight">Deploy and manage your agency's elite talent pool.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="rounded-2xl px-8 py-5 text-base font-black uppercase tracking-tighter shrink-0">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Personnel
                </Button>
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
                {members.length} member{members.length !== 1 ? "s" : ""}
            </p>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {members.map((member, i) => (
                        <div
                            key={member.id}
                            className="group relative flex items-center gap-5 rounded-2xl border border-white/5 bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/5">
                                <Image
                                    src={member.imageUrl || "/placeholder-user.jpg"}
                                    alt={member.name}
                                    fill
                                    sizes="80px"
                                    priority={i < 6}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-black text-white tracking-tight truncate">{member.name}</h3>
                                    <button
                                        onClick={() => handleToggleStatus(member)}
                                        className="shrink-0"
                                        title={member.status === "active" ? "Active — click to deactivate" : "Inactive — click to activate"}
                                    >
                                        <span className={`block h-2 w-2 rounded-full transition-colors cursor-pointer ${member.status === "active" ? "bg-emerald-500 shadow-[0_0_6px_var(--color-emerald-500)]" : "bg-red-500"}`} />
                                    </button>
                                </div>
                                <p className="text-xs font-bold text-accent uppercase tracking-widest mt-0.5 truncate">{member.role}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                                <button onClick={() => handleOpenModal(member)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all" title="Edit">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(member.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMember ? "Edit Personnel" : "Add Personnel"}
            >
                <form onSubmit={handleSubmit} className="space-y-7 p-1">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        <Input label="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">Bio</label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Brief biography..."
                            required
                        />
                    </div>
                    <TagSelector label="Skills" placeholder="Add skill (e.g. React, Design)..." tags={skills} onChange={setSkills} />
                    <ToggleSwitch label="Active" enabled={status === "active"} onChange={(val) => setStatus(val ? "active" : "inactive")} />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input label="Image URL" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                        <Input label="Twitter" value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input label="LinkedIn" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
                        <Input label="GitHub" value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} />
                    </div>
                    <Button type="submit" className="w-full rounded-2xl py-7 text-base font-black uppercase tracking-tighter" size="lg" isLoading={submitting}>
                        {editingMember ? "Save Changes" : "Add Personnel"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
