const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    auth0Id: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type : String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    avatar: {
        type : String,
    },
    field: {  // e.g., "Tech", "Finance"
        type : String
    },
    phoneNumber: {
        type : String,
    },
    about: {
        type: String,
        default: "",
    },
    residence: {
        pin : {
            type : Number,
        },
        city : {
            type : String,
        },
        state : {
            type : String,
        },
    },

    experience: {
        internships: [{
            title: String,
            company: String,
            duration: String,
            description: String,
        }],
        default: [],
    },

    resume: {
        skills: [{
            type : String,
        }],
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
        certifications: [String],
        docResume : {

        },
        socialLinks: {
            linkedin: { type: String },
            github: { type: String },
            website: { type: String },
        },
    },

    internships: {
        applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
        pastInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" }],
        currentInternship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    },
    resumeDoc: {
        filename: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadedAt: { type: Date, default: Date.now }
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;