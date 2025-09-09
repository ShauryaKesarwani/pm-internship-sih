const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
        type: String,
        enum: ["Submitted", "Under Review", "Shortlisted", "Rejected", "Hired"],
        default: "Submitted"
    },

    answers: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        answer: { type: String, required: true }
    }],
    documents: [String], //.pdf, .docs

    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;