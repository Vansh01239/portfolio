import Image from "next/image";
import Link from "next/link";
import { Member } from "@/types";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface MemberCardProps {
    member: Member;
}

// Inline SVGs for icons not available in lucide-react v1.7+
const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-[3rem] glass p-3 transition-all hover:shadow-3xl hover:shadow-accent/20"
        >
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2.5rem]">
                <Image
                    src={member.imageUrl || "/placeholder-user.jpg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-100" />

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex justify-center gap-4 py-3 glass rounded-2xl border border-white/10 backdrop-blur-xl">
                        {member.socialLinks.twitter && (
                            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </a>
                        )}
                        {member.socialLinks.linkedin && (
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <LinkedinIcon className="h-5 w-5" />
                            </a>
                        )}
                        {member.socialLinks.github && (
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <GithubIcon className="h-5 w-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 text-center">
                <h3 className="text-2xl font-black text-white transition-colors group-hover:text-accent tracking-tighter">{member.name}</h3>
                <p className="text-xs font-black tracking-[0.2em] text-accent/80 uppercase mt-2">{member.role}</p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {member.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-white/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-white/5 transition-colors group-hover:border-accent/20 group-hover:text-zinc-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <Link href={`/member/${member.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {member.name}'s profile</span>
            </Link>
        </motion.div>
    );
};

export default MemberCard;
