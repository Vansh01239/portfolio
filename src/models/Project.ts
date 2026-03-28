import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
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
    teamMembers: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        techStack: [{ type: String }],
        imageUrl: { type: String, default: "" },
        links: {
            github: { type: String, default: "" },
            demo: { type: String, default: "" },
        },
        featured: { type: Boolean, default: false },
        status: { type: String, enum: ["published", "draft"], default: "published" },
        teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    },
    { timestamps: true }
);

ProjectSchema.index({ status: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ createdAt: -1 });

// Force Next.js HMR to recompile the Mongoose Schema on every save
if (mongoose.models.Project) {
    delete mongoose.models.Project;
}

export default mongoose.model<IProject>("Project", ProjectSchema);
