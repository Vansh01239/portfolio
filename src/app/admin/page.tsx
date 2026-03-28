"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminRoot() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push("/admin/dashboard");
            } else {
                router.push("/admin/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </div>
    );
}
