import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white px-4 py-20">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                <h1 className="text-5xl font-black mb-12 tracking-tight">Terms of <span className="text-accent">Service</span></h1>

                <div className="space-y-12 text-zinc-400 leading-relaxed text-lg font-medium">
                    <section className="space-y-4">
                        <p>Last updated: March 30, 2026</p>
                        <p>By accessing the website at portfolio.agency, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Use License</h2>
                        <p>Permission is granted to temporarily view the materials on AgencyX's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. Disclaimer</h2>
                        <p>The materials on AgencyX's website are provided on an 'as is' basis. AgencyX makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Limitations</h2>
                        <p>In no event shall AgencyX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AgencyX's website.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
