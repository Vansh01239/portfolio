import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
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
    createdAt: Date;
    updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        bio: { type: String, required: true },
        skills: [{ type: String }],
        imageUrl: { type: String, default: "" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        socialLinks: {
            github: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

// Force Next.js HMR to recompile the Mongoose Schema on every save
if (mongoose.models.Member) {
    delete mongoose.models.Member;
}

export default mongoose.model<IMember>("Member", MemberSchema);
