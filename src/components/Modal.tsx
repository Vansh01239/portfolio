"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-6 backdrop-blur-xl animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-white/5 bg-zinc-950/80 p-12 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-300"
            >
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white tracking-tighter italic">{title}</h2>
                    <button
                        onClick={onClose}
                        className="group rounded-2xl p-3 text-zinc-500 hover:bg-white/5 hover:text-white transition-all transform hover:rotate-90 duration-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="relative">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
