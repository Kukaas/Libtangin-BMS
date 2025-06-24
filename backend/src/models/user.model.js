import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: function () { return this.role === 'resident'; },
    },
    firstName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "resident", "treasurer", "secretary", "barangay_captain"],
        default: "resident",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpires: {
        type: Date,
    },
    passwordResetCode: {
        type: String,
    },
    passwordResetCodeExpires: {
        type: Date,
    },
    // Document upload fields
    documentType: {
        type: String, // 'id' or 'birth_certificate'
        enum: ['id', 'birth_certificate'],
    },
    idFront: {
        type: String,
    },
    idBack: {
        type: String,
    },
    birthCertificate: {
        type: String,
    },
    documentVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

userSchema.statics.getOfficials = function () {
    return this.find({ role: { $in: ['secretary', 'treasurer', 'barangay_captain'] } });
};

const User = mongoose.model("User", userSchema);

export default User;
