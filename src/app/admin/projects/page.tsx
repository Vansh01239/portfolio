"use client";

import { useState, useEffect, useCallback } from "react";
import { Project, Member } from "@/types";
import { Plus, Edit, Trash2, ExternalLink, Github, Loader2, Copy, Star, Eye, EyeOff, Search, LayoutGrid, List, StarOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/Modal";
import Image from "next/image";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import TagSelector from "@/components/ui/TagSelector";
import { useToast } from "@/components/ui/Toast";

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        demo: "",
        github: "",
    });
    const [techStack, setTechStack] = useState<string[]>([]);
    const [featured, setFeatured] = useState(false);
    const [status, setStatus] = useState<"published" | "draft">("published");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const { showToast } = useToast();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const [projRes, memRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/members")
            ]);

            if (projRes.ok) {
                const data = await projRes.json();
                setProjects(data.map((p: any) => ({ ...p, id: p._id || p.id })));
            }
            if (memRes.ok) {
                const data = await memRes.json();
                setMembers(data.filter((m: any) => m.status === "active").map((m: any) => ({ ...m, id: m._id || m.id })));
            }
        } catch {
            const stored = localStorage.getItem("agencyx_projects");
            if (stored) setProjects(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                demo: project.links.demo || "",
                github: project.links.github || "",
            });
            setTechStack(project.techStack);
            setFeatured(project.featured);
            setStatus(project.status || "published");
            setSelectedMembers(project.teamMembers?.map((m: any) => m._id || m.id || m) || []);
            setImageUrl(project.imageUrl);
        } else {
            setEditingProject(null);
            setFormData({ title: "", description: "", demo: "", github: "" });
            setTechStack([]);
            setFeatured(false);
            setStatus("published");
            setSelectedMembers([]);
            setImageUrl("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                techStack,
                featured,
                status,
                teamMembers: selectedMembers,
                imageUrl: imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
                links: { demo: formData.demo, github: formData.github },
            };

            let res: Response;
            if (editingProject) {
                res = await fetch(`/api/projects/${editingProject.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                showToast(editingProject ? "Project updated successfully" : "Project created successfully", "success");
                fetchProjects();
            } else {
                // Fallback to localStorage
                const data: Project = {
                    id: editingProject?.id || `p_${Date.now()}`,
                    ...payload,
                };
                const updatedProjects = editingProject
                    ? projects.map(p => p.id === editingProject.id ? data : p)
                    : [...projects, data];
                setProjects(updatedProjects);
                localStorage.setItem("agencyx_projects", JSON.stringify(updatedProjects));
                showToast(editingProject ? "Project updated (local)" : "Project created (local)", "success");
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
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("Project deleted", "success");
                fetchProjects();
            } else {
                const filtered = projects.filter(p => p.id !== id);
                setProjects(filtered);
                localStorage.setItem("agencyx_projects", JSON.stringify(filtered));
                showToast("Project deleted (local)", "success");
            }
        } catch {
            const filtered = projects.filter(p => p.id !== id);
            setProjects(filtered);
            localStorage.setItem("agencyx_projects", JSON.stringify(filtered));
            showToast("Project deleted (local)", "success");
        }
    };

    const handleToggleFeatured = async (project: Project) => {
        const newFeatured = !project.featured;
        // Optimistic UI update
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, featured: newFeatured } : p));
        try {
            await fetch(`/api/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: newFeatured }),
            });
            showToast(newFeatured ? "Marked as featured" : "Removed from featured", "success");
        } catch {
            showToast("Updated locally", "info");
        }
    };

    const handleToggleStatus = async (project: Project) => {
        const newStatus = project.status === "published" ? "draft" : "published";
        // Optimistic UI update
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p));
        try {
            await fetch(`/api/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            showToast(newStatus === "published" ? "Project published" : "Project set to draft", "success");
        } catch {
            showToast("Updated locally", "info");
        }
    };

    const handleDuplicate = async (project: Project) => {
        const payload = {
            title: `${project.title} (Copy)`,
            description: project.description,
            techStack: project.techStack,
            imageUrl: project.imageUrl,
            featured: false,
            status: "draft" as const,
            links: project.links,
        };
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                showToast("Project duplicated as draft", "success");
                fetchProjects();
            }
        } catch {
            const duplicated: Project = { ...payload, id: `p_${Date.now()}` };
            setProjects(prev => [...prev, duplicated]);
            showToast("Duplicated locally", "info");
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic">
                            Project <span className="text-accent not-italic">Archive</span>
                        </h1>
                        <p className="mt-3 text-lg text-zinc-500 font-medium tracking-tight">
                            Curate and showcase your agency's digital products.
                        </p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="rounded-2xl px-8 py-5 text-base font-black uppercase tracking-tighter shrink-0">
                        <Plus className="mr-2 h-5 w-5" />
                        New Project
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-full rounded-xl border border-white/5 bg-zinc-950/60 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-accent/40 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {(["all", "published", "draft"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filterStatus === f
                                    ? "bg-accent text-white"
                                    : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-white/5 p-1">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-600 hover:text-white"}`}>
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-600 hover:text-white"}`}>
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Count */}
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
                {filterStatus !== "all" && ` • ${filterStatus}`}
            </p>

            {/* Content */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/20 p-20 text-center">
                    <p className="text-zinc-500 font-medium text-lg">
                        {searchTerm ? "No projects match your search." : "No projects yet. Create your first one!"}
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {filteredProjects.map((project, i) => (
                        <div
                            key={project.id}
                            className="group relative flex overflow-hidden rounded-4xl border border-white/5 bg-zinc-950/50 transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            {/* Image */}
                            <div className="relative w-36 sm:w-52 shrink-0 border-r border-white/5 overflow-hidden">
                                <Image
                                    src={project.imageUrl || "/placeholder-project.jpg"}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 144px, 208px"
                                    priority={i < 4}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Status overlay */}
                                <div className="absolute top-3 left-3">
                                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${project.status === "published"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-zinc-800/80 text-zinc-400"
                                        }`}>
                                        {project.status === "published" ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6 sm:p-8 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-black text-white tracking-tight truncate">{project.title}</h3>
                                        <p className="mt-1.5 text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed">{project.description}</p>
                                    </div>
                                    {project.featured && (
                                        <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                                    )}
                                </div>

                                {/* Tech stack */}
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {project.techStack.slice(0, 3).map((tech) => (
                                        <span key={tech} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 3 && (
                                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                                            +{project.techStack.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Action bar — always visible */}
                                <div className="mt-auto pt-5 flex items-center gap-2 border-t border-white/5">
                                    <button
                                        onClick={() => handleToggleFeatured(project)}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${project.featured
                                            ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                                            : "bg-white/5 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                            }`}
                                        title={project.featured ? "Remove featured" : "Mark as featured"}
                                    >
                                        {project.featured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                                        {project.featured ? "Unfeature" : "Feature"}
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(project)}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${project.status === "published"
                                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-red-500/15 hover:text-red-400"
                                            : "bg-white/5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            }`}
                                    >
                                        {project.status === "published" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                        {project.status === "published" ? "Unpublish" : "Publish"}
                                    </button>
                                    <div className="flex-1" />
                                    <button onClick={() => handleOpenModal(project)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDuplicate(project)} className="p-2 text-zinc-500 hover:text-accent rounded-lg hover:bg-accent/10 transition-all" title="Duplicate">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-3">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="flex items-center gap-5 rounded-2xl border border-white/5 bg-zinc-950/50 px-6 py-4 transition-all hover:border-white/10 hover:bg-zinc-950/70"
                        >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/5">
                                <Image src={project.imageUrl || "/placeholder-project.jpg"} alt={project.title} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black text-white tracking-tight truncate">{project.title}</h3>
                                <p className="text-xs text-zinc-500 truncate">{project.techStack.join(" · ")}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggleFeatured(project)}
                                    className={`p-2 rounded-lg transition-all ${project.featured ? "text-yellow-400 bg-yellow-500/10" : "text-zinc-600 hover:text-yellow-400"}`}
                                    title="Toggle featured"
                                >
                                    <Star className={`h-4 w-4 ${project.featured ? "fill-yellow-500" : ""}`} />
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(project)}
                                    className={`p-2 rounded-lg transition-all ${project.status === "published" ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-600 hover:text-emerald-400"}`}
                                    title="Toggle status"
                                >
                                    {project.status === "published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                                <button onClick={() => handleOpenModal(project)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProject ? "Edit Project" : "New Project"}
            >
                <form onSubmit={handleSubmit} className="space-y-7 p-1">
                    <Input label="Project Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <div>
                        <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">Description</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the project's vision and impact..."
                            required
                        />
                    </div>
                    <TagSelector label="Tech Stack" placeholder="Add tech (e.g. React, Docker)..." tags={techStack} onChange={setTechStack} />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input label="Demo URL" placeholder="https://demo.example.com" value={formData.demo} onChange={e => setFormData({ ...formData, demo: e.target.value })} />
                        <Input label="GitHub URL" placeholder="https://github.com/..." value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} />
                    </div>

                    {/* Team Members Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">Assign Team</label>
                        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-white/5 p-4">
                            {members.length === 0 ? (
                                <p className="text-sm text-zinc-500">No active members found.</p>
                            ) : (
                                members.map((member) => {
                                    const isSelected = selectedMembers.includes(member.id);
                                    return (
                                        <button
                                            key={member.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedMembers(prev =>
                                                    isSelected ? prev.filter(id => id !== member.id) : [...prev, member.id]
                                                );
                                            }}
                                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${isSelected
                                                    ? "bg-accent text-white"
                                                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <div className="relative h-5 w-5 overflow-hidden rounded-full">
                                                <Image src={member.imageUrl || "/placeholder-avatar.jpg"} alt={member.name} fill className="object-cover" />
                                            </div>
                                            {member.name}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 rounded-2xl border border-white/5 bg-white/5 p-6">
                        <ToggleSwitch label="Published" enabled={status === "published"} onChange={(val) => setStatus(val ? "published" : "draft")} />
                        <ToggleSwitch label="Featured" enabled={featured} onChange={setFeatured} />
                    </div>

                    <Input label="Image URL" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                    <Button type="submit" className="w-full rounded-2xl py-7 text-base font-black uppercase tracking-tighter" size="lg" isLoading={submitting}>
                        {editingProject ? "Save Changes" : "Create Project"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
