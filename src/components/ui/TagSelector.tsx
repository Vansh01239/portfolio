"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagSelectorProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, onChange, placeholder = "Add tag...", label }) => {
    const [inputValue, setInputValue] = useState("");

    const addTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-2.5">
            {label && <label className="block text-sm font-bold uppercase tracking-widest text-zinc-500">{label}</label>}
            <div className="flex flex-wrap gap-2 min-h-[56px] w-full rounded-2xl border border-white/10 bg-zinc-950/20 px-4 py-2 focus-within:border-accent/40 transition-all">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent/20 px-3 py-1 text-xs font-bold text-accent border border-accent/20"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-accent/60 hover:text-accent transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <div className="flex flex-1 items-center min-w-[120px]">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? placeholder : ""}
                        className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={addTag}
                        className="ml-2 rounded-lg bg-white/5 p-1 text-zinc-500 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagSelector;
