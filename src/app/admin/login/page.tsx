"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Successful login – Middleware will now allow access
                router.push("/admin/dashboard");
                // Force a refresh to update AuthProvider state
                setTimeout(() => window.location.reload(), 100);
            } else {
                const data = await res.json();
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 backdrop-blur-xl shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Admin Access</h2>
                    <p className="mt-2 text-sm text-zinc-400">Please sign in to manage your portfolio</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4 text-white">
                        <div className="relative">
                            <Mail className="absolute left-3 top-9 h-5 w-5 text-zinc-500" />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="admin@agency.com"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-9 h-5 w-5 text-zinc-500" />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
