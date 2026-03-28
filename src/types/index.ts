export interface Member {
    id: string;
    name: string;
    role: string;
    bio: string;
    skills: string[];
    imageUrl: string;
    status: "active" | "inactive";
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
    };
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    imageUrl: string;
    links: {
        github?: string;
        demo?: string;
    };
    featured: boolean;
    status: "published" | "draft";
    teamMembers?: any[]; // Array of Member objects when populated, or IDs when creating
}
