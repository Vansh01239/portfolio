import mongoose from "mongoose";
import Member from "../src/models/Member";
import Project from "../src/models/Project";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/agencyx";

const members = [
    {
        name: "Alex Rivera",
        role: "Creative Director",
        bio: "Alex is a visionary director with over 12 years of experience in digital brand transformation. He has led multiple award-winning projects for Fortune 500 companies, focusing on the intersection of human-centered design and emerging technologies.",
        skills: ["Branding", "UI/UX", "Strategy"],
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
        status: "active",
        socialLinks: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
        name: "Sarah Chen",
        role: "Lead Developer",
        bio: "Sarah is a full-stack engineer specializing in scalable cloud architectures. With a background in computer science and a passion for clean code, she ensures that every project built at AgencyX is robust, performant, and future-proof.",
        skills: ["Next.js", "TypeScript", "Cloud"],
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
        status: "active",
        socialLinks: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
        name: "Marcus Thorne",
        role: "Backend Architect",
        bio: "Marcus is the silent engine behind our most complex systems. He excels at optimizing database queries, architecting microservices, and ensuring that our applications can handle massive user loads with zero downtime.",
        skills: ["Node.js", "Go", "Kubernetes"],
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
        status: "active",
        socialLinks: { github: "#", twitter: "#" }
    },
    {
        name: "Elena Vance",
        role: "Motion Designer",
        bio: "Elena believes that animation is the soul of a digital product. She crafts fluid micro-interactions and stunning visual narratives that guide users and make every interaction feel natural and delightful.",
        skills: ["Figma", "After Effects", "Rive"],
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
        status: "active",
        socialLinks: { github: "#", linkedin: "#", twitter: "#" }
    }
];

const projects = [
    {
        title: "Lumina SaaS Platform",
        description: "Lumina is a next-generation enterprise analytics suite designed to give teams deep insights into their performance. \n\nBy leveraging advanced data processing and a highly interactive UI, it allows stakeholders to visualize complex trends and make informed decisions in seconds. The platform features real-time collaboration, predictive modeling, and a customizable widget system.",
        techStack: ["Next.js", "Three.js", "Tailwind"],
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        featured: true,
        status: "published",
        links: { github: "#", demo: "#" }
    },
    {
        title: "Pulse Crypto Wallet",
        description: "Pulse is a security-first cryptocurrency wallet that bridge the gap between complex blockchain tech and everyday users. \n\nBuilt with performance and safety in mind, Pulse offers cross-chain compatibility, instant swaps, and a non-custodial architecture that ensures users always remain in full control of their assets. Our team developed the complete brand identity and mobile application from scratch.",
        techStack: ["React Native", "Rust", "TypeScript"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        featured: true,
        status: "published",
        links: { github: "#", demo: "#" }
    },
    {
        title: "Aether AI Assistant",
        description: "Aether is a cutting-edge artificial intelligence designed to automate creative workflows for designers and developers. \n\nIt integrates directly with professional tools to offer real-time suggestions, automate repetitive tasks, and generate high-fidelity assets based on simple text prompts. The core engine is built on a proprietary LLM model fine-tuned for design-centric tasks.",
        techStack: ["Python", "PyTorch", "Next.js"],
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        featured: true,
        status: "published",
        links: { github: "#", demo: "#" }
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully.");

        const memberCount = await Member.countDocuments();
        if (memberCount === 0) {
            console.log("Seeding members...");
            await (Member as any).insertMany(members);
            console.log(`${members.length} members seeded.`);
        } else {
            console.log("Members already exist, skipping seed.");
        }

        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            console.log("Seeding projects...");
            await (Project as any).insertMany(projects);
            console.log(`${projects.length} projects seeded.`);
        } else {
            console.log("Projects already exist, skipping seed.");
        }

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
