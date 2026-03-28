"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-100 flex flex-col gap-4">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-4 min-w-[320px] rounded-2xl border p-6 shadow-2xl backdrop-blur-3xl animate-in slide-in-from-right-10 duration-500 ${toast.type === "success"
                            ? "bg-zinc-950/80 border-emerald-500/20 text-emerald-400"
                            : toast.type === "error"
                                ? "bg-zinc-950/80 border-red-500/20 text-red-400"
                                : "bg-zinc-950/80 border-blue-500/20 text-blue-400"
                            }`}
                    >
                        {toast.type === "success" && <CheckCircle className="h-6 w-6 shrink-0" />}
                        {toast.type === "error" && <AlertCircle className="h-6 w-6 shrink-0" />}
                        {toast.type === "info" && <Info className="h-6 w-6 shrink-0" />}

                        <p className="flex-1 text-sm font-bold tracking-tight">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
