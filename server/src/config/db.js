import mongoose from "mongoose";
import { env } from "./env.js";

const DB_PATH = `${env.MONGO_URI}/${env.NODE_ENV === "development" ? "nxt_dev" : "nxt_prod"}`;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    await mongoose.connect(DB_PATH);
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
