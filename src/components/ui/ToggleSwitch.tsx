"use client";

import React from "react";

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => {
    return (
        <div className="flex items-center gap-4">
            {label && <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{label}</span>}
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black ${enabled ? "bg-accent" : "bg-zinc-800"
                    }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;
