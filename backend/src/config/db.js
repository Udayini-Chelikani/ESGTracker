import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in .env");
    }

    await mongoose.connect(uri);

    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("[db] MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[db] MongoDB disconnected");
    });
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}
