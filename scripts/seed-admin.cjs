const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@agency.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, default: "Admin User" },
    role: { type: String, default: "admin" }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await mongoose.connect(MONGODB_URI);

    console.log('Checking for existing Admin:', ADMIN_EMAIL);
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
        console.log('Admin already exists. Updating password...');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('Admin password updated successfully.');
    } else {
        console.log('Creating new Admin...');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await Admin.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            displayName: "Chief Orchestrator",
            role: "admin"
        });
        console.log('Admin created successfully.');
    }

    await mongoose.disconnect();
    console.log('Done.');
}

seedAdmin().catch(function (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
});
