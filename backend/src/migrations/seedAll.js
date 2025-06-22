import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";
import Resident from "../models/residents.model.js";
import User from "../models/user.model.js";

const residents = [
    {
        firstName: "Chester Luke",
        middleName: "Arroyo",
        lastName: "Maligaso",
        birthDate: new Date("2003-08-29"),
        age: 21,
        gender: "Male",
        purok: "Purok 6",
        civilStatus: "Single",
        occupation: "Software Developer",
        contactNumber: "09171234567",
        isVerified: false,
        parents: {
            father: {
                name: "Esmilo L. Maligaso",
                occupation: "Tricycle Driver",
                contactNumber: "09181234567",
            },
            mother: {
                name: "Dina Rachell A. Maligaso",
                occupation: "Housewife",
                contactNumber: "09191234567",
            },
        },
    },
];

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

const seedAll = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        console.log("Clearing existing data...");
        await Resident.deleteMany();
        await User.deleteMany();

        // Seed residents
        console.log("Seeding residents...");
        await Resident.insertMany(residents);
        console.log(`✅ ${residents.length} residents seeded successfully!`);

        // Hash passwords and prepare admin users for insertion
        console.log("Seeding admin users...");
        const hashedUsers = await Promise.all(
            adminUsers.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword,
                };
            })
        );

        // Insert admin users
        await User.insertMany(hashedUsers);
        console.log(`✅ ${adminUsers.length} admin users seeded successfully!`);

        console.log("\n🎉 All data seeded successfully!");
        console.log("\n📋 Admin Users Created:");
        adminUsers.forEach(user => {
            console.log(`   - ${user.role.toUpperCase()}: ${user.email} (Password: ${user.password})`);
        });

        console.log("\n📋 Residents Created:");
        residents.forEach(resident => {
            console.log(`   - ${resident.firstName} ${resident.middleName} ${resident.lastName}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedAll();
