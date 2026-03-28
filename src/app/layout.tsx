import { AuthProvider } from "@/hooks/useAuth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AgencyX | Modern Creative Agency",
    description: "Digital agency specializing in high-end design and performance-oriented web applications.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className={`${inter.className} bg-black text-zinc-100 antialiased cursor-auto`}>
                <AuthProvider>
                    <Navbar />
                    <div className="pt-[72px]">
                        {children}
                    </div>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
