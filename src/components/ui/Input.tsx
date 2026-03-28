import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-bold uppercase tracking-widest text-zinc-500">
                    {label}
                </label>
            )}
            <input
                className={`flex h-14 w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500/50" : ""
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>}
        </div>
    );
};

export default Input;
