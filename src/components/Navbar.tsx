"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Work", href: "/work" },
    { name: "Team", href: "/teams" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (pathname?.startsWith("/admin")) return null;

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/40"
                    : "bg-transparent"
                    }`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <div className="flex h-[72px] items-center justify-between">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-black text-sm tracking-tight">AX</span>
                            </div>
                            <span className="text-white font-black text-xl tracking-tight">
                                Agency<span className="text-accent">X</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200 group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/contact"
                                className="rounded-xl bg-white text-black px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95"
                            >
                                Start a Project
                            </Link>
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-white/5"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-[72px] left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5"
                    >
                        <div className="px-6 py-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-4 text-base font-semibold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5 mt-4 flex flex-col gap-3">
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center px-4 py-4 text-base font-bold text-black bg-white rounded-xl uppercase tracking-wide shadow-lg shadow-white/20 hover:bg-zinc-200 transition-all"
                                >
                                    Start a Project
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
