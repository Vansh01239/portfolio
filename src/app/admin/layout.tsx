"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, MessageSquare, Settings, LogOut, Loader2, Search, Bell, ChevronDown, Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import { ToastProvider } from "@/components/ui/Toast";
import { useState } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Leads", href: "/admin/leads", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
        );
    }

    if (!user && pathname !== "/admin/login") return null;
    if (pathname === "/admin/login") return <>{children}</>;

    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-accent/30 overflow-x-hidden">
                {/* Sidebar */}
                <aside className={`fixed left-0 top-0 h-full w-72 border-r border-white/5 bg-zinc-950/20 p-8 backdrop-blur-3xl z-50 transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="mb-12 flex items-center justify-between">
                        <Link href="/" className="text-2xl font-black tracking-widest text-white group">
                            AGENCY<span className="text-accent group-hover:text-white transition-colors">X</span>
                            <span className="ml-2 text-xs font-bold uppercase tracking-tighter text-zinc-600">Admin</span>
                        </Link>
                    </div>

                    <nav className="space-y-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center space-x-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${isActive
                                        ? "bg-accent text-white shadow-[0_0_30px_-5px_var(--accent-glow)]"
                                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-zinc-600 group-hover:text-accent"}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-10 left-8 right-8">
                        <button
                            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-white/5 py-4 text-sm font-bold text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20"
                            onClick={() => logout()}
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Wrapper */}
                <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? "lg:ml-72" : "ml-0"}`}>
                    {/* Topbar */}
                    <header className="sticky top-0 z-40 flex h-24 items-center justify-between border-b border-white/5 bg-black/40 px-12 backdrop-blur-2xl">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="rounded-xl bg-white/5 p-2.5 text-zinc-500 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="relative group hidden md:block">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search command or data..."
                                    className="h-12 w-80 rounded-2xl border border-white/5 bg-zinc-950/40 pl-12 pr-4 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="relative rounded-xl bg-white/5 p-2.5 text-zinc-500 hover:bg-white/10 hover:text-white transition-all">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
                            </button>
                            <div className="h-10 w-px bg-white/5 mx-2" />
                            <div className="flex items-center gap-4 cursor-pointer group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white tracking-tight">{user?.displayName || "Admin User"}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">Chief Orchestrator</p>
                                </div>
                                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 group-hover:border-accent/40 transition-all">
                                    <div className="h-full w-full bg-linear-to-br from-accent to-purple-600 flex items-center justify-center text-white font-black">
                                        AX
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-zinc-600 group-hover:text-white transition-all" />
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="relative min-h-[calc(100vh-6rem)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_40%)] -z-10" />
                        <div className="p-12 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
