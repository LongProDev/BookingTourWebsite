import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users...");

    // Create admin user
    const admin = new User({
      username: "Admin",
      email: "admin@gmail.com",
      password: "Admin12345",
      role: "admin"
    });

    // Create regular user
    const regularUser = new User({
      username: "User",
      email: "user@gmail.com",
      password: "User12345",
      role: "user"
    });

    await admin.save();
    await regularUser.save();

    console.log("Sample users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();