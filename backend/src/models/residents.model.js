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
                required: false,
            },
            occupation: {
                type: String,
                required: false,
            },
            contactNumber: {
                type: String,
                required: false,
            },
            deceased: {
                type: Boolean,
                default: false,
            },
        },
        mother: {
            name: {
                type: String,
                required: false,
            },
            occupation: {
                type: String,
                required: false,
            },
            contactNumber: {
                type: String,
                required: false,
            },
            deceased: {
                type: Boolean,
                default: false,
            },
        },
    },

}, { timestamps: true })

const Resident = mongoose.model("Resident", residentSchema);

export default Resident;


