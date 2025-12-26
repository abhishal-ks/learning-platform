import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// ~~~~~~~~~~~~~~~~    Kiṃ ahaṃ saccidānandaḥ? - Adwaith philosophy thesis topic    ~~~~~~~~~~~~~~~~

if (!MONGODB_URI) {
    throw new Error('Kripya env variables me mongo_uri define kre');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        mongoose
            .connect(MONGODB_URI)
            .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    return cached.conn
}