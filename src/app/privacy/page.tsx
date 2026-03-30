import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white px-4 py-20">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                <h1 className="text-5xl font-black mb-12 tracking-tight">Privacy <span className="text-accent">Policy</span></h1>

                <div className="space-y-12 text-zinc-400 leading-relaxed text-lg font-medium">
                    <section className="space-y-4">
                        <p>Last updated: March 30, 2026</p>
                        <p>AgencyX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by AgencyX.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                        <p>We collect information that you provide directly to us when you fill out a contact form, including your name, email address, and project details. We also collect usage data through analytics tools to improve our website performance.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To respond to your inquiries and project requests.</li>
                            <li>To improve our website design and user experience.</li>
                            <li>To provide you with updates and marketing communications (if opted-in).</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Information Sharing</h2>
                        <p>We do not sell or lease your personal information to third parties. We may share information with trusted service providers who help us operate our website, as long as they agree to keep it confidential.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
