import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block overflow-hidden rounded-[3rem] glass p-3 transition-all hover:shadow-3xl hover:shadow-accent/20"
        >
            <div className="relative aspect-16/10 overflow-hidden rounded-[2.2rem]">
                <Image
                    src={project.imageUrl || "/placeholder-project.jpg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-white transition-colors group-hover:text-accent tracking-tighter italic">
                        {project.title}
                    </h3>
                    <div className="h-10 w-10 rounded-2xl border border-white/10 flex items-center justify-center text-white/50 group-hover:text-accent group-hover:border-accent group-hover:rotate-45 transition-all duration-500">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                </div>
                <p className="line-clamp-2 text-base text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors leading-relaxed">
                    {project.description}
                </p>
                {/* Contributors Strip */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">The Team</span>
                        <div className="flex items-center -space-x-3">
                            {project.teamMembers.map((member: any) => (
                                <div key={member._id || member.id} className="group/avatar relative flex items-center justify-center">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-950 transition-transform duration-300 hover:z-10 hover:scale-110 shadow-lg cursor-pointer">
                                        <Image
                                            src={member.imageUrl || "/placeholder-avatar.jpg"}
                                            alt={member.name}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                            title={`${member.name} - ${member.role}`}
                                        />
                                    </div>
                                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 transition-opacity duration-300 group-hover/avatar:opacity-100 z-50">
                                        <div className="rounded-xl border border-white/10 bg-zinc-900/95 px-3 py-2 text-center shadow-xl backdrop-blur-xl">
                                            <p className="text-xs font-bold text-white">{member.name}</p>
                                            <p className="text-[10px] font-medium tracking-wide text-accent uppercase mt-0.5">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                    <Link
                        href={`/project/${project.id || (project as any)._id}`}
                        className="text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:text-accent group/link"
                    >
                        View Project <ArrowUpRight className="inline-block h-4 w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                    </Link>

                    <div className="flex space-x-4">
                        {project.links.github && (
                            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-zinc-600 transition-colors hover:text-white">
                                <Github className="h-6 w-6" />
                            </a>
                        )}
                        {project.links.demo && (
                            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-zinc-600 transition-colors hover:text-accent">
                                <ExternalLink className="h-6 w-6" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
