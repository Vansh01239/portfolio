import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
    name: string;
    email: string;
    message: string;
    date: string;
    status: "new" | "read" | "archived";
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: String, default: () => new Date().toISOString() },
        status: { type: String, enum: ["new", "read", "archived"], default: "new" },
    },
    { timestamps: true }
);

export default (mongoose.models.Lead as Model<ILead>) ||
    mongoose.model<ILead>("Lead", LeadSchema);
