import mongoose from 'mongoose';
import 'dotenv/config';

console.log('DEBUG: Starting DB debug script');
console.log('DEBUG: MONGODB_URI present?', !!process.env.MONGODB_URI);
console.log('DEBUG: MONGODB_URI (first 100 chars):', process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0, 100) : 'undefined');

(async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('DEBUG: Connected to MongoDB:', conn.connection.host);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('DEBUG: MongoDB connection failed:', err.message || err);
        console.error(err.stack || err);
        process.exit(1);
    }
})();
