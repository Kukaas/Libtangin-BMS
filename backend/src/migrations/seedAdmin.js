import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";

const adminUsers = [
    {
        firstName: "Admin",
        middleName: "",
        lastName: "User",
        email: "admin@libtanginbms.com",
        password: "Admin@123",
        role: "admin",
        isEmailVerified: true,
    },
    {
        firstName: "Barangay",
        middleName: "",
        lastName: "Captain",
        email: "captain@libtanginbms.com",
        password: "Captain@123",
        role: "barangay_captain",
        isEmailVerified: true,
    },
    {
        firstName: "Barangay",
        middleName: "",
        lastName: "Secretary",
        email: "secretary@libtanginbms.com",
        password: "Secretary@123",
        role: "secretary",
        isEmailVerified: true,
    },
    {
        firstName: "Barangay",
        middleName: "",
        lastName: "Treasurer",
        email: "treasurer@libtanginbms.com",
        password: "Treasurer@123",
        role: "treasurer",
        isEmailVerified: true,
    },
];

const seedAdminUsers = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to MongoDB");

        // Hash passwords and prepare users for insertion
        const hashedUsers = await Promise.all(
            adminUsers.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword,
                };
            })
        );

        // Clear existing admin users (but keep residents)
        await User.deleteMany({
            role: { $in: ["admin", "barangay_captain", "secretary", "treasurer"] }
        });

        // Insert new admin users
        await User.insertMany(hashedUsers);

        console.log("Admin users seeded successfully!");
        console.log("\nAdmin Users Created:");
        adminUsers.forEach(user => {
            console.log(`- ${user.role.toUpperCase()}: ${user.email} (Password: ${user.password})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin users:", error);
        process.exit(1);
    }
};

seedAdminUsers();
