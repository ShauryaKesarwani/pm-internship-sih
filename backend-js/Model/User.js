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
    contact: {
        type : String,
    },
    residence: {
        type : String,
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
        socialLinks: [String],
        docResume : {

        }
    },

    internships: {
        applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
        pastInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" }],
        currentInternship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;