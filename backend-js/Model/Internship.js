const mongoose = require("mongoose");
require("./Question");
const internshipSchema = new mongoose.Schema({
    internshipDetails: {
        title: {
            type: String,
            required: true
        },
        department: {
            type : String,
        },
        responsibilities: [{
            type : String,
        }],
        skillsRequired: [{
            type : String,
        }],
        openings: {
            type : Number,
        },
        duration: {
            type : String,
        },
        applicationDeadline: {
            type : Date,
        },
        startDate : {
            type : String,
        },
        location: {
            address: {
                type : String,
            },
            pinCode : {
                type : Number,
            },
            city: {
                type: String,
            },
        },
        stipend: String,
    },

    eligibility: {
        optional: { type: Boolean, default: false },
        highestLevelOfEducation: String,
        preferredDegrees: [String],
        graduationYearRange: [Number],
    },

    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],

    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
    }],

    status: {
        type: Boolean,
        default: true
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
}, { timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);
module.exports = Internship;