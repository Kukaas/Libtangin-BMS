import mongoose from "mongoose";

const residentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    purok: {
        type: String,
        required: true,
    },
    civilStatus: {
        type: String,
        required: true,
        enum: ["Single", "Married", "Divorced", "Widowed"],
        default: "Single",
    },
    occupation: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    parents: {
        father: {
            name: {
                type: String,
                required: true,
            },
            occupation: {
                type: String,
                required: true,
            },
            contactNumber: {
                type: String,
                required: true,
            },
        },
        mother: {
            name: {
                type: String,
                required: true,
            },
            occupation: {
                type: String,
                required: true,
            },
            contactNumber: {
                type: String,
                required: true,
            },
        },
    },

}, { timestamps: true })

const Resident = mongoose.model("Resident", residentSchema);

export default Resident;


