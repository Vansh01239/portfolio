import Image from "next/image";
import Link from "next/link";
import { Member } from "@/types";
import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

interface MemberCardProps {
    member: Member;
}

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
                                <Twitter className="h-5 w-5" />
                            </a>
                        )}
                        {member.socialLinks.linkedin && (
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        )}
                        {member.socialLinks.github && (
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
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
