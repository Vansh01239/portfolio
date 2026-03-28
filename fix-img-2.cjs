const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const res = await db.collection('projects').updateMany(
            { imageUrl: { $regex: '1551288049-bbbda536339a' } },
            { $set: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' } }
        );
        console.log(`Updated ${res.modifiedCount} projects containing deleted Unsplash image.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
