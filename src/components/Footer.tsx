import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-zinc-950 py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_40%)]" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
                    <div className="space-y-6 col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-black tracking-widest text-white group">
                            AGENCY<span className="text-accent transition-all group-hover:text-white">X</span>
                        </Link>
                        <p className="text-lg text-zinc-500 max-w-sm font-medium leading-relaxed">
                            Building high-performance digital products for ambitious brands. We merge engineering excellence with world-class design.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Navigation</h3>
                        <ul className="space-y-4">
                            <li><Link href="#about" className="text-sm font-semibold text-zinc-500 hover:text-accent transition-colors">Our Story</Link></li>
                            <li><Link href="#team" className="text-sm font-semibold text-zinc-500 hover:text-accent transition-colors">The Team</Link></li>
                            <li><Link href="#projects" className="text-sm font-semibold text-zinc-500 hover:text-accent transition-colors">Case Studies</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Connect</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">X / Twitter</a></li>
                            <li><a href="#" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">LinkedIn</a></li>
                            <li><a href="https://github.com" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-zinc-600">
                    <p>© {new Date().getFullYear()} AgencyX. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
