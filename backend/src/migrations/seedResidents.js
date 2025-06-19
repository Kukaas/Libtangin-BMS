import mongoose from "mongoose";
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

const seedResidents = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        await Resident.deleteMany();
        await User.deleteMany()
        await Resident.insertMany(residents);
        console.log("Residents seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding residents:", error);
        process.exit(1);
    }
};

seedResidents();
