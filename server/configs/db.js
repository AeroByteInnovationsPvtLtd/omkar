import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ MongoDB Connected")
    );

    mongoose.connection.on("error", (err) =>
      console.log("❌ MongoDB Error:", err.message)
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "resumeBuilder", // ✅ important
    });

  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
